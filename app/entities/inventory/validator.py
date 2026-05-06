from fastapi import HTTPException


class InventoryValidator:
    @staticmethod
    def validate(data: dict, is_update: bool = False):
        """Валидация ингредиента"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название ингредиента обязательно")

        if not is_update or 'unit' in data:
            unit = data.get('unit', '')
            if not unit or not unit.strip():
                raise HTTPException(400, "Единица измерения обязательна")

        # ИСПРАВЛЕНО: преобразование в float если пришла строка
        if not is_update or 'current_quantity' in data:
            current_quantity = data.get('current_quantity', 0)
            if isinstance(current_quantity, str):
                try:
                    current_quantity = float(current_quantity)
                except ValueError:
                    raise HTTPException(400, "Текущее количество должно быть числом")
            if current_quantity < 0:
                raise HTTPException(400, "Текущее количество не может быть отрицательным")

        # ИСПРАВЛЕНО: преобразование в float если пришла строка
        if not is_update or 'min_quantity' in data:
            min_quantity = data.get('min_quantity', 0)
            if isinstance(min_quantity, str):
                try:
                    min_quantity = float(min_quantity)
                except ValueError:
                    raise HTTPException(400, "Минимальное количество должно быть числом")
            if min_quantity < 0:
                raise HTTPException(400, "Минимальное количество не может быть отрицательным")

        return data