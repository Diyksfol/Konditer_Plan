from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import IngredientRepository


class IngredientService(BaseService):

    def __init__(self):
        super().__init__(IngredientRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация ингредиента"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название ингредиента обязательно")

        if not is_update or 'unit' in data:
            unit = data.get('unit', '')
            if not unit or not unit.strip():
                raise HTTPException(400, "Единица измерения обязательна")

        if not is_update or 'current_quantity' in data:
            current_quantity = data.get('current_quantity', 0)
            if current_quantity < 0:
                raise HTTPException(400, "Текущее количество не может быть отрицательным")

        if not is_update or 'min_quantity' in data:
            min_quantity = data.get('min_quantity', 0)
            if min_quantity < 0:
                raise HTTPException(400, "Минимальное количество не может быть отрицательным")

        return data

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        self.validate(data_dict)
        data_dict['created_at'] = datetime.now()
        data_dict['updated_at'] = datetime.now()
        return self.repo.safe_create(db, data_dict)

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        self.validate(data_dict, is_update=True)
        data_dict['updated_at'] = datetime.now()
        return self.repo.update(db, entity_id, data_dict)

    def get_low_stock(self, db):
        return self.repo.get_low_stock(db)