from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import ScheduleEntryRepository


class ScheduleService(BaseService):

    def __init__(self):
        super().__init__(ScheduleEntryRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация записи расписания"""
        if not is_update or 'order_id' in data:
            order_id = data.get('order_id', 0)
            if order_id <= 0:
                raise HTTPException(400, "ID заказа должен быть больше 0")

        if not is_update or 'recipe_operation_id' in data:
            recipe_operation_id = data.get('recipe_operation_id', 0)
            if recipe_operation_id <= 0:
                raise HTTPException(400, "ID операции рецепта должен быть больше 0")

        if not is_update or 'start_time' in data:
            start_time = data.get('start_time')
            if start_time:
                if isinstance(start_time, str):
                    start_time = datetime.fromisoformat(start_time)
                if start_time < datetime.now():
                    raise HTTPException(400, "Время начала не может быть в прошлом")

        if not is_update or 'end_time' in data:
            end_time = data.get('end_time')
            start_time = data.get('start_time')
            if end_time and start_time:
                if isinstance(end_time, str):
                    end_time = datetime.fromisoformat(end_time)
                if isinstance(start_time, str):
                    start_time = datetime.fromisoformat(start_time)
                if end_time <= start_time:
                    raise HTTPException(400, "Время окончания должно быть больше времени начала")

        if not is_update or 'equipment_id' in data:
            equipment_id = data.get('equipment_id', 0)
            if equipment_id <= 0:
                raise HTTPException(400, "ID оборудования должен быть больше 0")

        if not is_update or 'confectioner_id' in data:
            confectioner_id = data.get('confectioner_id', 0)
            if confectioner_id <= 0:
                raise HTTPException(400, "ID кондитера должен быть больше 0")

        if not is_update or 'status' in data:
            status = data.get('status')
            if status and status not in ['scheduled', 'in_progress', 'completed', 'cancelled']:
                raise HTTPException(400, "Статус должен быть: scheduled, in_progress, completed, cancelled")

        return data

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        self.validate(data_dict)
        return self.repo.safe_create(db, data_dict)

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        self.validate(data_dict, is_update=True)
        return self.repo.update(db, entity_id, data_dict)

    def get_by_order_id(self, db, order_id: int):
        return self.repo.get_by_order_id(db, order_id)

    def get_by_equipment(self, db, equipment_id: int):
        return self.repo.get_by_equipment(db, equipment_id)

    def get_by_confectioner(self, db, confectioner_id: int):
        return self.repo.get_by_confectioner(db, confectioner_id)