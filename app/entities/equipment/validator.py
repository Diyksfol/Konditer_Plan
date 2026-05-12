from fastapi import HTTPException


class EquipmentValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация оборудования"""
        if not is_update or 'equipment_name' in data:
            name = data.get('equipment_name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название оборудования обязательно")

        if not is_update or 'equipment_type_id' in data:
            equipment_type_id = data.get('equipment_type_id', 0)
            if equipment_type_id <= 0:
                raise HTTPException(400, "ID типа оборудования должен быть больше 0")

        return data