from app.api.base_api import BaseAPI
from .service import EquipmentService

equipment_api = BaseAPI(service=EquipmentService())
router = equipment_api.router

'''
Пример для создания:
{
  "name": "Духовка Unox XF023",
  "equipment_type_id": 1,
  "is_active": true
}
'''
