from app.api.base_api import BaseAPI
from app.services.inventory_service import InventoryService

inventory_api = BaseAPI(service=InventoryService())
router = inventory_api.router

'''
Пример для создания:
{
  "ingredient_id": 1,
  "unit": "кг",
  "current_quantity": 150.5,
  "min_stock": 50.0
}
'''