from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import ConfectionerRepository


class ConfectionerService(BaseService):

    def __init__(self):
        super().__init__(ConfectionerRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация кондитера"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Имя кондитера обязательно")

        if not is_update or 'qualification_id' in data:
            qualification_id = data.get('qualification_id', 0)
            if qualification_id <= 0:
                raise HTTPException(400, "ID квалификации должен быть больше 0")

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

    def get_active(self, db):
        return self.repo.get_active(db)