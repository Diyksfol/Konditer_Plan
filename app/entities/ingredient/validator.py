from datetime import datetime
from fastapi import HTTPException


class IngredientValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация ингредиента"""
        if not is_update or 'ingredient_name' in data:
            name = data.get('ingredient_name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название ингредиента обязательно")

        if not is_update or 'unit' in data:
            unit = data.get('unit', '')
            if not unit or not unit.strip():
                raise HTTPException(400, "Единица измерения обязательна")

        # Only validate inventory fields if they are present in the data dict
        # (they should have been extracted by the service before validation)
        if 'current_quantity' in data:
            current_quantity_str = data.get('current_quantity', '0')
            try:
                current_quantity = float(current_quantity_str)
                if current_quantity < 0:
                    raise HTTPException(400, "Текущее количество не может быть отрицательным")
            except ValueError:
                raise HTTPException(400, "Текущее количество должно быть числом")

        if 'min_stock' in data:
            min_quantity_str = data.get('min_stock', '0')
            try:
                min_quantity = float(min_quantity_str)
                if min_quantity < 0:
                    raise HTTPException(400, "Минимальное количество не может быть отрицательным")
            except ValueError:
                raise HTTPException(400, "Минимальное количество должно быть числом")

        return data