from fastapi import HTTPException
from app.services.base_service import BaseService
from .repository import RecipeIngredientRepository
from .validator import RecipeIngredientValidator


class RecipeIngredientService(BaseService):

    def __init__(self):
        super().__init__(RecipeIngredientRepository())
        self.validator = RecipeIngredientValidator()

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

    def get_by_recipe_id(self, db, recipe_id: int):
        return self.repo.get_by_recipe_id(db, recipe_id)
