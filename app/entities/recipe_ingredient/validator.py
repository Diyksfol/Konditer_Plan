from fastapi import HTTPException


class RecipeIngredientValidator:
    @staticmethod
    def validate(data: dict, is_update: bool = False):
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