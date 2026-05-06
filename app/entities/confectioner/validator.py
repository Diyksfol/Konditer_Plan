from fastapi import HTTPException


class ConfectionerValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация кондитера"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Имя кондитера обязательно")

        if not is_update or 'qualification_id' in data:
            qualification_id = data.get('qualification_id', 0)
            if qualification_id <= 0:
                raise HTTPException(400, "ID квалификации должен быть больше 0")

        return data