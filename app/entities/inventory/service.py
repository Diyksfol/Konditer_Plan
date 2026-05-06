from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from .repository import InventoryRepository
from .validator import InventoryValidator


class InventoryService(BaseService):

    def __init__(self):
        super().__init__(InventoryRepository())
        self.validator = InventoryValidator()

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        self.validator.validate(data_dict)
        data_dict['last_check'] = datetime.now()
        return self.repo.safe_create(db, data_dict)

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        self.validator.validate(data_dict, is_update=True)
        return self.repo.update(db, entity_id, data_dict)

    def get_low_stock(self, db):
        return self.repo.get_low_stock(db)
