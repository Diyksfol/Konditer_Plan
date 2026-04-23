from app.api.base_api import BaseAPI
from app.services.equipment_type_service import EquipmentTypeService

equipment_type_api = BaseAPI(service=EquipmentTypeService())
router = equipment_type_api.router

'''
Пример для создания:
{
  "name": "Духовой шкаф"
}
'''