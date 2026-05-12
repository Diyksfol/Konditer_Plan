from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from app.services.planning_service import PlanningService
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

        # Генерация расписания
        try:
            PlanningService().plan_order(db, order.order_id)
        except HTTPException as exc:
            # Если планирование не удалось, удаляем расчёт расписания и заказ
            from app.entities.schedule.repository import ScheduleEntryRepository

            schedule_repo = ScheduleEntryRepository()
            schedule_repo.delete_by_order_id(db, order.order_id)
            db.delete(order)
            db.commit()
            detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
            raise HTTPException(status_code=400, detail=f"Не удалось спланировать заказ: {detail}")
        except Exception as e:
            # Если планирование не удалось, удаляем расчёт расписания и заказ
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
