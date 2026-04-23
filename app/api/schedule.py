from app.api.base_api import BaseAPI
from app.services.schedule_service import ScheduleService

schedule_api = BaseAPI(service=ScheduleService())
router = schedule_api.router

'''
Пример для создания:
{
  "order_id": 1,
  "recipe_operation_id": 1,
  "start_time": "2024-12-24T09:00:00",
  "end_time": "2024-12-24T09:30:00",
  "equipment_id": 1,
  "confectioner_id": 1,
  "status": "scheduled"
}
'''