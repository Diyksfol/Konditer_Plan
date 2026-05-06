from datetime import datetime
from fastapi import HTTPException


class IngredientValidator:
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