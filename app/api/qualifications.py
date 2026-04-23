from app.api.base_api import BaseAPI
from app.services.qualification_service import QualificationService

qualification_api = BaseAPI(service=QualificationService())
router = qualification_api.router

'''
Пример для создания:
{
  "name": "Шеф-кондитер"
}
'''