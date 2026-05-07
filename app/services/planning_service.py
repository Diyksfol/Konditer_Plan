from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException
from app.entities.confectioner.repository import ConfectionerRepository
from app.entities.equipment.repository import EquipmentRepository
from app.entities.order.repository import OrderRepository
from app.entities.recipe_operation.repository import RecipeOperationRepository
from app.entities.schedule.repository import ScheduleEntryRepository


class PlanningService:

    def __init__(self):
        self.order_repo = OrderRepository()
        self.recipe_operation_repo = RecipeOperationRepository()
        self.equipment_repo = EquipmentRepository()
        self.confectioner_repo = ConfectionerRepository()
        self.schedule_repo = ScheduleEntryRepository()

    def run(self, db, order_id: Optional[int] = None):
        """Запуск алгоритма планирования.

        Если передан order_id, планирование выполняется только для конкретного заказа.
        Если order_id не указан, производится планирование для всех заказов со статусом "planned".
        """
        if order_id is not None:
            result = self.plan_order(db, order_id)
            return {
                "status": "success",
                "planned_orders": [result]
            }

        orders = self.order_repo.get_by_status(db, "planned")
        if not orders:
            return {
                "status": "success",
                "planned_orders": []
            }

        results = []
        for order in orders:
            try:
                self.plan_order(db, order.order_id)
                results.append({"order_id": order.order_id, "status": "planned"})
            except HTTPException as exc:
                results.append({"order_id": order.order_id, "status": "failed", "detail": exc.detail})

        return {
            "status": "partial_success" if any(item["status"] == "failed" for item in results) else "success",
            "planned_orders": results
        }

    def plan_order(self, db, order_id: int):
        """Планирование одного заказа и сохранение расписания.

        Если для заказа уже были записи расписания, они удаляются перед новым построением.
        """
        order = self.order_repo.get_by_id(db, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Заказ не найден")

        operations = self.recipe_operation_repo.get_by_recipe_id(db, order.recipe_id)
        if not operations:
            raise HTTPException(status_code=400, detail="Для рецепта не найдены операции")

        self.schedule_repo.delete_by_order_id(db, order_id)

        current_end = datetime.combine(order.delivery_date, datetime.min.time())
        schedule_entries = []

        for operation in reversed(operations):
            duration = timedelta(minutes=operation.duration_minutes)
            start_time = current_end - duration

            confectioner = self._find_available_confectioner(
                db,
                start_time,
                current_end,
                operation.required_qualification_id
            )
            if not confectioner:
                raise HTTPException(status_code=400, detail="Нет доступных кондитеров для операции")

            equipment_id = None
            if operation.equipment_type_id:
                equipment = self._find_available_equipment(
                    db,
                    operation.equipment_type_id,
                    start_time,
                    current_end
                )
                if not equipment:
                    raise HTTPException(status_code=400, detail="Нет доступного оборудования для операции")
                equipment_id = equipment.equipment_id

            entry = self._create_schedule_entry(
                db,
                order.order_id,
                operation.recipe_operation_id,
                start_time,
                current_end,
                equipment_id,
                confectioner.confectioner_id
            )
            schedule_entries.append(entry)
            current_end = start_time

        return {
            "order_id": order.order_id,
            "schedule_entries": [
                {
                    "schedule_entry_id": entry.schedule_entry_id,
                    "recipe_operation_id": entry.recipe_operation_id,
                    "start_time": entry.start_time,
                    "end_time": entry.end_time,
                    "equipment_id": entry.equipment_id,
                    "confectioner_id": entry.confectioner_id,
                    "status": entry.status
                }
                for entry in schedule_entries
            ]
        }

    def _find_available_confectioner(self, db, start_time: datetime, end_time: datetime, qualification_id: Optional[int]):
        """Ищем активного кондитера без пересечения текущего интервала."""
        confectioners = self.confectioner_repo.get_active(db)
        for confectioner in confectioners:
            if qualification_id and confectioner.qualification_id != qualification_id:
                continue

            if not self.schedule_repo.get_by_confectioner_and_time(
                    db, confectioner.confectioner_id, start_time, end_time):
                return confectioner

        return None

    def _find_available_equipment(self, db, equipment_type_id: int, start_time: datetime, end_time: datetime):
        """Ищем активное оборудование нужного типа без конфликта."""
        equipments = self.equipment_repo.get_by_equipment_type(db, equipment_type_id)
        for equipment in equipments:
            if not equipment.is_active:
                continue

            if not self.schedule_repo.get_by_equipment_and_time(db, equipment.equipment_id, start_time, end_time):
                return equipment

        return None

    def _create_schedule_entry(self, db, order_id: int, recipe_operation_id: int, start_time: datetime,
                               end_time: datetime, equipment_id: Optional[int], confectioner_id: int):
        return self.schedule_repo.safe_create(db, {
            "order_id": order_id,
            "recipe_operation_id": recipe_operation_id,
            "start_time": start_time,
            "end_time": end_time,
            "equipment_id": equipment_id,
            "confectioner_id": confectioner_id,
            "status": "planned"
        })
