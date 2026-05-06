from fastapi import HTTPException


class EquipmentTypeValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация типа оборудования"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название типа оборудования обязательно")

        return data