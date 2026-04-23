from datetime import datetime
from app.services.base_service import BaseService
from app.repositories.order_repo import OrderRepository
from app.services.validation_service import validate_order
from app.services.schedule_service import generate_schedule


class OrderService(BaseService):

    def __init__(self):
        super().__init__(OrderRepository())

    def create(self, db, order_data):
        validate_order(order_data)

        new_order = {
            "recipe_id": order_data.recipe_id,
            "quantity": order_data.quantity,
            "delivery_date": order_data.delivery_date,
            "status": "planned",
            "created_at": datetime.now()
        }

        order = self.repo.safe_create(db, new_order)

        generate_schedule(order)

        return order

    def get_by_status(self, db, status: str):
        return self.repo.get_by_status(db, status)