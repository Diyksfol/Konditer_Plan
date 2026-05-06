from fastapi import HTTPException
from app.services.base_service import BaseService
from .repository import QualificationRepository
from .validator import QualificationValidator


class QualificationService(BaseService):

    def __init__(self):
        super().__init__(QualificationRepository())
        self.validator = QualificationValidator()

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        self.validator.validate(data_dict)
        return self.repo.safe_create(db, data_dict)

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        self.validator.validate(data_dict, is_update=True)
        return self.repo.update(db, entity_id, data_dict)
