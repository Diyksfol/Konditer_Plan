# services/order_service.py
from datetime import datetime
from app.services.base_service import BaseService
from app.repositories.order_repo import OrderRepository
from app.services.validation_service import validate_order
from app.services.schedule_service import generate_schedule


class OrderService(BaseService):

    def __init__(self):
        super().__init__(OrderRepository())

    def create(self, db, order_data):
        # Преобразуем Pydantic модель в словарь, если нужно
        if hasattr(order_data, 'dict'):
            data_dict = order_data.dict()
        else:
            data_dict = order_data

        # Валидируем данные (передаем словарь)
        #validate_order(data_dict)

        # Подготавливаем данные для создания
        new_order = {
            "recipe_id": data_dict["recipe_id"],
            "quantity": data_dict["quantity"],
            "delivery_date": data_dict["delivery_date"],
            "status": "planned",
            "created_at": datetime.now()
        }

        # Создаем заказ
        order = self.repo.safe_create(db, new_order)

        # Генерируем расписание (пока закомментируйте, если есть ошибки)
        # generate_schedule(order)

        return order

    def get_by_status(self, db, status: str):
        return self.repo.get_by_status(db, status)