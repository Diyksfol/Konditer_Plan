from app.api.base_api import BaseAPI
from app.services.confectioner_service import ConfectionerService

confectioner_api = BaseAPI(service=ConfectionerService())
router = confectioner_api.router

'''
Пример для создания:
{
  "name": "Анна Петрова",
  "qualification_id": 1,
  "is_active": true
}
'''