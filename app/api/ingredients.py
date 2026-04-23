from app.api.base_api import BaseAPI
from app.services.ingredient_service import IngredientService

ingredient_api = BaseAPI(service=IngredientService())
router = ingredient_api.router

'''
Пример для создания:
{
  "name": "Мука пшеничная",
  "unit": "кг",
  "current_quantity": 150.5,
  "min_quantity": 50.0
}
'''