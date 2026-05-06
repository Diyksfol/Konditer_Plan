from datetime import datetime
from fastapi import HTTPException


class ScheduleValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация записи расписания"""
        if not is_update or 'order_id' in data:
            order_id = data.get('order_id', 0)
            if order_id <= 0:
                raise HTTPException(400, "ID заказа должен быть больше 0")

        if not is_update or 'recipe_operation_id' in data:
            recipe_operation_id = data.get('recipe_operation_id', 0)
            if recipe_operation_id <= 0:
                raise HTTPException(400, "ID операции рецепта должен быть больше 0")

        # преобразование строки в datetime
        if not is_update or 'start_time' in data:
            start_time = data.get('start_time')
            if start_time:
                if isinstance(start_time, str):
                    try:
                        start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                    except ValueError:
                        raise HTTPException(400, "Неверный формат даты. Используйте ГГГГ-ММ-ДДTHH:MM:SS")
                if start_time < datetime.now():
                    raise HTTPException(400, "Время начала не может быть в прошлом")

        # ИСПРАВЛЕНО: преобразование строки в datetime и сравнение
        if not is_update or 'end_time' in data:
            end_time = data.get('end_time')
            start_time = data.get('start_time')
            if end_time:
                if isinstance(end_time, str):
                    try:
                        end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
                    except ValueError:
                        raise HTTPException(400, "Неверный формат даты. Используйте ГГГГ-ММ-ДДTHH:MM:SS")

                # Преобразуем start_time если он есть и это строка
                if start_time and isinstance(start_time, str):
                    start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))

                if start_time and end_time <= start_time:
                    raise HTTPException(400, "Время окончания должно быть больше времени начала")

        if not is_update or 'equipment_id' in data:
            equipment_id = data.get('equipment_id', 0)
            if equipment_id <= 0:
                raise HTTPException(400, "ID оборудования должен быть больше 0")

        if not is_update or 'confectioner_id' in data:
            confectioner_id = data.get('confectioner_id', 0)
            if confectioner_id <= 0:
                raise HTTPException(400, "ID кондитера должен быть больше 0")

        if not is_update or 'status' in data:
            status = data.get('status')
            if status and status not in ['scheduled', 'in_progress', 'completed', 'cancelled']:
                raise HTTPException(400, "Статус должен быть: scheduled, in_progress, completed, cancelled")

        return data