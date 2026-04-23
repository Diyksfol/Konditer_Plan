from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import OrderRepository
from app.services.validation_service import validate_order
from app.services.schedule_service import generate_schedule


class OrderService(BaseService):

    def __init__(self):
        super().__init__(OrderRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация заказа"""
        if not is_update or 'recipe_id' in data:
            if data.get('recipe_id', 0) <= 0:
                raise HTTPException(400, "ID рецепта должен быть больше 0")

        if not is_update or 'quantity' in data:
            quantity = data.get('quantity', 0)
            if quantity <= 0:
                raise HTTPException(400, "Количество должно быть больше 0")

        if not is_update or 'delivery_date' in data:
            delivery_date = data.get('delivery_date')
            if delivery_date and delivery_date < datetime.now().date():
                raise HTTPException(400, "Дата доставки не может быть меньше текущей")

        if not is_update or 'status' in data:
            status = data.get('status')
            if status and status not in ['planned', 'in_progress', 'completed', 'cancelled']:
                raise HTTPException(400, "Статус должен быть: planned, in_progress, completed, cancelled")

        return data

    def create(self, db, order_data):
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
        generate_schedule(order)

        return order

    def update(self, db, order_id, order_data):
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