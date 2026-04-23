from app.api.base_api import BaseAPI
from app.services.recipe_ingredient_service import RecipeIngredientService

recipe_ingredient_api = BaseAPI(service=RecipeIngredientService())
router = recipe_ingredient_api.router

'''
Пример для создания:
{
  "recipe_id": 1,
  "ingredient_id": 1,
  "quantity_per_unit": 0.5
}
'''