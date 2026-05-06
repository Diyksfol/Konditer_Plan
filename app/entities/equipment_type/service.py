from fastapi import HTTPException
from app.services.base_service import BaseService
from .repository import EquipmentTypeRepository
from .validator import EquipmentTypeValidator


class EquipmentTypeService(BaseService):

    def __init__(self):
        super().__init__(EquipmentTypeRepository())
        self.validator = EquipmentTypeValidator()

    def validate(self, data: dict, is_update: bool = False):
        return self.validator.validate(data, is_update)

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
