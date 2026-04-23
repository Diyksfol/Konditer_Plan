from fastapi import HTTPException
from app.services.base_service import BaseService
from app.repositories import RecipeOperationRepository


class RecipeOperationService(BaseService):

    def __init__(self):
        super().__init__(RecipeOperationRepository())

    def validate(self, data: dict, is_update: bool = False):
        """Валидация операции рецепта"""
        if not is_update or 'recipe_id' in data:
            recipe_id = data.get('recipe_id', 0)
            if isinstance(recipe_id, str):
                try:
                    recipe_id = int(recipe_id)
                except ValueError:
                    raise HTTPException(400, "ID рецепта должен быть числом")
            if recipe_id <= 0:
                raise HTTPException(400, "ID рецепта должен быть больше 0")

        if not is_update or 'sequence_number' in data:
            sequence_number = data.get('sequence_number', 0)
            if isinstance(sequence_number, str):
                try:
                    sequence_number = int(sequence_number)
                except ValueError:
                    raise HTTPException(400, "Номер последовательности должен быть числом")
            if sequence_number <= 0:
                raise HTTPException(400, "Номер последовательности должен быть больше 0")

        if not is_update or 'duration_minutes' in data:
            duration_minutes = data.get('duration_minutes', 0)
            if isinstance(duration_minutes, str):
                try:
                    duration_minutes = int(duration_minutes)
                except ValueError:
                    raise HTTPException(400, "Длительность должна быть числом")
            if duration_minutes <= 0:
                raise HTTPException(400, "Длительность должна быть больше 0")

        if not is_update or 'equipment_type_id' in data:
            equipment_type_id = data.get('equipment_type_id', 0)
            if isinstance(equipment_type_id, str):
                try:
                    equipment_type_id = int(equipment_type_id)
                except ValueError:
                    raise HTTPException(400, "ID типа оборудования должен быть числом")
            if equipment_type_id <= 0:
                raise HTTPException(400, "ID типа оборудования должен быть больше 0")

        if not is_update or 'required_qualification_id' in data:
            required_qualification_id = data.get('required_qualification_id', 0)
            if isinstance(required_qualification_id, str):
                try:
                    required_qualification_id = int(required_qualification_id)
                except ValueError:
                    raise HTTPException(400, "ID квалификации должен быть числом")
            if required_qualification_id <= 0:
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

    def get_by_recipe_id(self, db, recipe_id: int):
        return self.repo.get_by_recipe_id(db, recipe_id)