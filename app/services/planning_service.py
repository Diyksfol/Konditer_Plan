from datetime import datetime, timedelta, time
from typing import Optional

from fastapi import HTTPException
from app.entities.confectioner.repository import ConfectionerRepository
from app.entities.equipment.repository import EquipmentRepository
from app.entities.order.repository import OrderRepository
from app.entities.recipe_operation.repository import RecipeOperationRepository
from app.entities.schedule.repository import ScheduleEntryRepository

WORK_START = time(9, 0)
WORK_END = time(18, 0)


class PlanningService:

    def __init__(self):
        self.order_repo = OrderRepository()
        self.recipe_operation_repo = RecipeOperationRepository()
        self.equipment_repo = EquipmentRepository()
        self.confectioner_repo = ConfectionerRepository()
        self.schedule_repo = ScheduleEntryRepository()

    def run(self, db, order_id: Optional[int] = None):
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
        order = self.order_repo.get_by_id(db, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Заказ не найден")

        operations = self.recipe_operation_repo.get_by_recipe_id(db, order.recipe_id)
        if not operations:
            raise HTTPException(status_code=400, detail="Для рецепта не найдены операции")

        # Sort operations by sequence_number ascending
        operations = sorted(operations, key=lambda op: op.sequence_number)

        self.schedule_repo.delete_by_order_id(db, order_id)

        # Calculate total duration
        total_duration = sum((timedelta(minutes=op.duration_minutes) for op in operations), timedelta(0))
        workday_duration = datetime.combine(datetime.today(), WORK_END) - datetime.combine(datetime.today(), WORK_START)

        # Determine start date
        if total_duration > workday_duration:
            # If total time exceeds workday, move to previous day
            start_date = order.delivery_date - timedelta(days=1)
        else:
            start_date = order.delivery_date

        current_start = datetime.combine(start_date, WORK_START)
        # If start_date is today, start from current time or WORK_START, whichever is later
        now = datetime.now()
        if start_date == now.date():
            current_start = max(current_start, now)
        schedule_entries = []

        for operation in operations:
            duration = timedelta(minutes=operation.duration_minutes)
            if duration > workday_duration:
                raise HTTPException(
                    status_code=400,
                    detail=f"Операция '{operation.operation_name}' слишком длинная для рабочего дня."
                )

            confectioner, equipment, start_time, end_time = self._find_best_slot_for_operation(
                db,
                start_date,
                current_start,
                duration,
                operation.required_qualification_id,
                operation.equipment_type_id
            )

            if not confectioner:
                raise HTTPException(status_code=400, detail="Нет доступных кондитеров для операции")

            if operation.equipment_type_id and not equipment:
                raise HTTPException(status_code=400, detail="Нет доступного оборудования для операции")

            entry = self._create_schedule_entry(
                db,
                order.order_id,
                operation.recipe_operation_id,
                start_time,
                end_time,
                equipment.equipment_id if equipment else None,
                confectioner.confectioner_id
            )
            schedule_entries.append(entry)
            current_start = end_time

        self.order_repo.update_status(db, order_id, "scheduled")

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

    def update_order_statuses(self, db):
        """Обновляет статусы заказов на основе текущего времени"""
        from app.entities.order.repository import OrderRepository
        from app.entities.schedule.repository import ScheduleEntryRepository

        order_repo = OrderRepository()
        schedule_repo = ScheduleEntryRepository()

        now = datetime.now()

        # Получить все заказы в статусе planned, scheduled или in_progress
        orders = order_repo.get_by_statuses(db, ["planned", "scheduled", "in_progress"])

        for order in orders:
            schedule_entries = schedule_repo.get_by_order_id(db, order.order_id)
            if not schedule_entries:
                continue

            # Проверить статус операций
            all_completed = True
            any_started = False

            for entry in schedule_entries:
                if entry.end_time <= now:
                    # Завершена
                    if entry.status != "completed":
                        schedule_repo.update_status(db, entry.schedule_entry_id, "completed")
                elif entry.start_time <= now < entry.end_time:
                    # В процессе
                    if entry.status != "in_progress":
                        schedule_repo.update_status(db, entry.schedule_entry_id, "in_progress")
                    any_started = True
                    all_completed = False
                else:
                    # Не начата
                    all_completed = False

            # Обновить статус заказа
            if all_completed:
                order_repo.update_status(db, order.order_id, "completed")
            elif any_started:
                order_repo.update_status(db, order.order_id, "in_progress")
            elif order.status != "scheduled":
                order_repo.update_status(db, order.order_id, "scheduled")

    def _fit_into_workday(self, start_time: datetime, current_end: datetime, duration: timedelta) -> datetime:
        """
        Если start_time выходит за начало рабочего дня,
        переносим операцию на конец предыдущего рабочего дня.
        """
        workday_minutes = (
            datetime.combine(start_time.date(), WORK_END) -
            datetime.combine(start_time.date(), WORK_START)
        ).seconds // 60  # = 540 минут (9 часов)

        if duration.total_seconds() / 60 > workday_minutes:
            raise HTTPException(
                status_code=400,
                detail=f"Длительность операции ({int(duration.total_seconds() // 60)} мин) превышает рабочий день (540 мин)"
            )

        day_work_start = datetime.combine(start_time.date(), WORK_START)
        if start_time < day_work_start:
            # Переносим на конец предыдущего рабочего дня
            previous_day_end = datetime.combine(current_end.date() - timedelta(days=1), WORK_END)
            start_time = previous_day_end - duration

        return start_time

    def _find_best_slot_for_operation(self, db, start_date: datetime, current_start: datetime,
                                      duration: timedelta, qualification_id: Optional[int], equipment_type_id: Optional[int]):
        latest_end = datetime.combine(start_date, WORK_END)
        search_start = current_start

        while search_start + duration <= latest_end:
            search_end = search_start + duration
            confectioner = self._find_available_confectioner(
                db,
                search_start,
                search_end,
                qualification_id
            )
            if confectioner:
                equipment = None
                if equipment_type_id:
                    equipment = self._find_available_equipment(
                        db,
                        equipment_type_id,
                        search_start,
                        search_end
                    )
                if equipment_type_id and not equipment:
                    search_start += timedelta(minutes=5)
                    continue
                return confectioner, equipment, search_start, search_end
            search_start += timedelta(minutes=5)

        return None, None, None, None

    def _find_available_confectioner(self, db, start_time: datetime, end_time: datetime, qualification_id: Optional[int]):
        confectioners = self.confectioner_repo.get_active(db)
        eligible = [c for c in confectioners if not qualification_id or c.qualification_id >= qualification_id]
        eligible.sort(key=lambda c: (self._get_confectioner_load(db, c.confectioner_id), c.qualification_id))

        for confectioner in eligible:
            if not self.schedule_repo.get_by_confectioner_and_time(
                    db, confectioner.confectioner_id, start_time, end_time):
                return confectioner
        return None

    def _find_available_equipment(self, db, equipment_type_id: int, start_time: datetime, end_time: datetime):
        equipments = [e for e in self.equipment_repo.get_by_equipment_type(db, equipment_type_id) if e.is_active]
        equipments.sort(key=lambda e: self._get_equipment_load(db, e.equipment_id))

        for equipment in equipments:
            if not self.schedule_repo.get_by_equipment_and_time(db, equipment.equipment_id, start_time, end_time):
                return equipment
        return None

    def _get_confectioner_load(self, db, confectioner_id: int):
        entries = self.schedule_repo.get_by_confectioner(db, confectioner_id)
        return sum(int((entry.end_time - entry.start_time).total_seconds() / 60) for entry in entries)

    def _get_equipment_load(self, db, equipment_id: int):
        entries = self.schedule_repo.get_by_equipment(db, equipment_id)
        return sum(int((entry.end_time - entry.start_time).total_seconds() / 60) for entry in entries)

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