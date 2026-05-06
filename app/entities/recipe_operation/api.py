from app.api.base_api import BaseAPI
from .service import RecipeOperationService

recipe_operation_api = BaseAPI(service=RecipeOperationService())
router = recipe_operation_api.router

'''
Пример для создания:
{
  "recipe_id": 1,
  "sequence_number": 1,
  "duration_minutes": 30,
  "equipment_type_id": 1,
  "required_qualification_id": 1
}
'''
