from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import RecipeIngredientRepository


class RecipeIngredientService(BaseService):

    def __init__(self):
        super().__init__(RecipeIngredientRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация ингредиента рецепта"""
        if not is_update or 'recipe_id' in data:
            recipe_id = data.get('recipe_id', 0)
            if recipe_id <= 0:
                raise HTTPException(400, "ID рецепта должен быть больше 0")

        if not is_update or 'quantity_per_unit' in data:
            quantity_per_unit = data.get('quantity_per_unit', 0)
            if isinstance(quantity_per_unit, str):
                try:
                    quantity_per_unit = float(quantity_per_unit)
                except ValueError:
                    raise HTTPException(400, "Количество на единицу должно быть числом")
            if quantity_per_unit <= 0:
                raise HTTPException(400, "Количество на единицу должно быть больше 0")
            
        if not is_update or 'quantity_per_unit' in data:
            quantity_per_unit = data.get('quantity_per_unit', 0)
            if quantity_per_unit <= 0:
                raise HTTPException(400, "Количество на единицу должно быть больше 0")

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

    def get_by_recipe_id(self, db, recipe_id: int):
        return self.repo.get_by_recipe_id(db, recipe_id)