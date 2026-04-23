from app.api.base_api import BaseAPI
from app.services.order_service import OrderService


order_api = BaseAPI( service=OrderService() )

router = order_api.router

'''
Пример
{
  "recipe_id": 1,
  "quantity": 10,
  "delivery_date": "2026-04-25",
  "status": "planned"
}
'''