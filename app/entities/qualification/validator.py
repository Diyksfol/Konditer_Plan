from fastapi import HTTPException


class QualificationValidator:
    @staticmethod
    def validate(data: dict, is_update: bool = False):
        """Валидация квалификации"""
        if not is_update or 'name' in data:
            name = data.get('name', '')
            if not name or not name.strip():
                raise HTTPException(400, "Название квалификации обязательно")

        return data