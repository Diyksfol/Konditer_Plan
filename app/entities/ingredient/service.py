from datetime import datetime
from fastapi import HTTPException
from app.services.base_service import BaseService
from .repository import IngredientRepository
from .validator import IngredientValidator
from app.entities.inventory.repository import InventoryRepository


class IngredientService(BaseService):

    def __init__(self):
        super().__init__(IngredientRepository())
        self.validator = IngredientValidator()

    def validate(self, data: dict, is_update: bool = False):
        return self.validator.validate(data, is_update)

    def create(self, db, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict()
        else:
            data_dict = data

        # Extract inventory data
        inventory_data = {}
        if 'current_quantity' in data_dict:
            inventory_data['current_quantity'] = data_dict.pop('current_quantity')
        if 'min_stock' in data_dict:
            inventory_data['min_stock'] = data_dict.pop('min_stock')

        self.validate(data_dict)
        ingredient = self.repo.safe_create(db, data_dict)

        # Create inventory if data provided
        if inventory_data:
            inventory_data['ingredient_id'] = ingredient.ingredient_id
            inventory_data['last_check'] = datetime.now()
            inventory_repo = InventoryRepository()
            inventory_repo.safe_create(db, inventory_data)

        return ingredient

    def update(self, db, entity_id, data):
        if hasattr(data, 'dict'):
            data_dict = data.dict(exclude_unset=True)
        else:
            data_dict = data

        # Extract inventory data
        inventory_data = {}
        if 'current_quantity' in data_dict:
            inventory_data['current_quantity'] = data_dict.pop('current_quantity')
        if 'min_stock' in data_dict:
            inventory_data['min_stock'] = data_dict.pop('min_stock')

        self.validate(data_dict, is_update=True)
        ingredient = self.repo.update(db, entity_id, data_dict)

        # Update or create inventory
        if inventory_data:
            inventory_repo = InventoryRepository()
            existing_inventory = inventory_repo.get_by_ingredient_id(db, entity_id)
            if existing_inventory:
                inventory_repo.update(db, existing_inventory.inventory_id, inventory_data)
            else:
                inventory_data['ingredient_id'] = entity_id
                inventory_data['last_check'] = datetime.now()
                inventory_repo.safe_create(db, inventory_data)

        return ingredient

    def get_low_stock(self, db):
        return self.repo.get_low_stock(db)
