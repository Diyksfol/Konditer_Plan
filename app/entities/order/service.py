from datetime import datetime
from fastapi import HTTPException
from decimal import Decimal
from app.services.base_service import BaseService
from app.services.planning_service import PlanningService
from app.entities.inventory.repository import InventoryRepository
from app.entities.recipe_ingredient.repository import RecipeIngredientRepository
from .repository import OrderRepository
from .validator import OrderValidator
# from app.services.schedule_service import generate_schedule


class OrderService(BaseService):

    def __init__(self):
        super().__init__(OrderRepository())
        self.validator = OrderValidator()

    def validate(self, data: dict, is_update: bool = False):
        return self.validator.validate(data, is_update)

    def create(self, db, order_data): # type: ignore
        # Преобразуем в словарь если нужно
        if hasattr(order_data, 'dict'):
            data_dict = order_data.dict()
        else:
            data_dict = order_data

        # Валидация
        self.validate(data_dict)

        # Подготовка данных
        new_order = {
            "recipe_id": data_dict["recipe_id"],
            "quantity": data_dict["quantity"],
            "delivery_date": data_dict["delivery_date"],
            "status": "planned", 
            "created_at": datetime.now()
        }

        # Создание
        order = self.repo.safe_create(db, new_order)

        # Резервируем продукты на складе
        inventory_repo = InventoryRepository()
        recipe_ingredient_repo = RecipeIngredientRepository()
        recipe_ingredients = recipe_ingredient_repo.get_by_recipe_id(db, order.recipe_id)
        reserved = []

        for ing in recipe_ingredients:
            inventory = inventory_repo.get_by_ingredient_id(db, ing.ingredient_id)
            if not inventory:
                raise HTTPException(status_code=400, detail=f"Ингредиент id={ing.ingredient_id} не найден на складе")

            required_amount = Decimal(ing.quantity_per_unit) * Decimal(order.quantity)
            if inventory.current_quantity < required_amount:
                raise HTTPException(
                    status_code=400,
                    detail=f"Недостаточно ингредиента id={ing.ingredient_id}. Нужно {required_amount}, в наличии {inventory.current_quantity}"
                )

            inventory.current_quantity -= required_amount
            db.add(inventory)
            reserved.append((inventory, required_amount))

        db.commit()

        # Генерация расписания
        try:
            PlanningService().plan_order(db, order.order_id)
        except HTTPException as exc:
            # Если планирование не удалось, восстановим зарезервированные продукты, удалим расчёт расписания и заказ
            for inventory, amount in reserved:
                inventory.current_quantity += amount
                db.add(inventory)
            db.commit()

            from app.entities.schedule.repository import ScheduleEntryRepository
            schedule_repo = ScheduleEntryRepository()
            schedule_repo.delete_by_order_id(db, order.order_id)
            db.delete(order)
            db.commit()
            detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
            raise HTTPException(status_code=400, detail=f"Не удалось спланировать заказ: {detail}")
        except Exception as e:
            for inventory, amount in reserved:
                inventory.current_quantity += amount
                db.add(inventory)
            db.commit()

            from app.entities.schedule.repository import ScheduleEntryRepository
            schedule_repo = ScheduleEntryRepository()
            schedule_repo.delete_by_order_id(db, order.order_id)
            db.delete(order)
            db.commit()
            raise HTTPException(status_code=400, detail=f"Не удалось спланировать заказ: {str(e)}")

        return order


    def update(self, db, order_id, order_data): # type: ignore
        # Преобразуем в словарь если нужно
        if hasattr(order_data, 'dict'):
            data_dict = order_data.dict(exclude_unset=True)
        else:
            data_dict = order_data

        # Валидация
        self.validate(data_dict, is_update=True)

        # Обновление
        return self.repo.update(db, order_id, data_dict)

    def get_by_status(self, db, status: str):
        return self.repo.get_by_status(db, status)

    def delete(self, db, entity_id: int):
        """Delete order and all associated schedule entries"""
        # Import here to avoid circular imports
        from app.entities.schedule.repository import ScheduleEntryRepository
        
        # Delete all schedule entries for this order
        schedule_repo = ScheduleEntryRepository()
        schedule_repo.delete_by_order_id(db, entity_id)
        
        # Delete the order
        return super().delete(db, entity_id)
