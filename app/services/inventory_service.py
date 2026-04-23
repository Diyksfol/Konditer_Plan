from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import InventoryRepository


class InventoryService(BaseService):

    def __init__(self):
        super().__init__(InventoryRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация инвентаря"""
        if not is_update or 'ingredient_id' in data:
            ingredient_id = data.get('ingredient_id', 0)
            if ingredient_id <= 0:
                raise HTTPException(400, "ID ингредиента должен быть больше 0")

        if not is_update or 'unit' in data:
            unit = data.get('unit', '')
            if not unit or not unit.strip():
                raise HTTPException(400, "Единица измерения обязательна")

        if not is_update or 'current_quantity' in data:
            current_quantity = data.get('current_quantity', 0)
            if current_quantity < 0:
                raise HTTPException(400, "Текущее количество не может быть отрицательным")

        if not is_update or 'min_stock' in data:
            min_stock = data.get('min_stock', 0)
            if min_stock < 0:
                raise HTTPException(400, "Минимальный запас не может быть отрицательным")

        return data

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        self.validate(data_dict)
        data_dict['last_check'] = datetime.now()
        return self.repo.safe_create(db, data_dict)

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        self.validate(data_dict, is_update=True)
        return self.repo.update(db, entity_id, data_dict)

    def get_low_stock(self, db):
        return self.repo.get_low_stock(db)