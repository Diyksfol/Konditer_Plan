from app.api.base_api import BaseAPI
from .service import RecipeService

recipe_api = BaseAPI(service=RecipeService())
router = recipe_api.router

'''
Пример для создания:
{
  "name": "Наполеон",
  "shelf_life_days": 3
}
'''
