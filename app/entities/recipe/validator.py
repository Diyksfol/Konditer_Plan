from fastapi import HTTPException


class RecipeValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация рецепта"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название рецепта обязательно")

        if not is_update or 'shelf_life_days' in data:
            shelf_life_days = data.get('shelf_life_days', 0)
            if shelf_life_days <= 0:
                raise HTTPException(400, "Срок хранения должен быть больше 0")

        return data