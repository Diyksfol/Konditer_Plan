from datetime import datetime
from fastapi import HTTPException


class OrderValidator:
    def validate(self, data: dict, is_update: bool = False):
        """Валидация заказа"""
        if not is_update or 'recipe_id' in data:
            if data.get('recipe_id', 0) <= 0:
                raise HTTPException(400, "ID рецепта должен быть больше 0")

        if not is_update or 'quantity' in data:
            quantity = data.get('quantity', 0)
            if quantity <= 0:
                raise HTTPException(400, "Количество должно быть больше 0")

        if not is_update or 'delivery_date' in data:
            delivery_date = data.get('delivery_date')
            if delivery_date:
                # Преобразуем строку в объект date, если это строка
                if isinstance(delivery_date, str):
                    try:
                        delivery_date = datetime.strptime(delivery_date, '%Y-%m-%d').date()
                    except ValueError:
                        raise HTTPException(400, "Неверный формат даты. Используйте ГГГГ-ММ-ДД")

                # Сравниваем с текущей датой
                if delivery_date < datetime.now().date():
                    raise HTTPException(400, "Дата доставки не может быть меньше текущей")

        if not is_update or 'status' in data:
            status = data.get('status')
            if status and status not in ['planned', 'in_progress', 'completed', 'cancelled']:
                raise HTTPException(400, "Статус должен быть: planned, in_progress, completed, cancelled")

        return data