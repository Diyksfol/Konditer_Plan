from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
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
        # generate_schedule(order)

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
