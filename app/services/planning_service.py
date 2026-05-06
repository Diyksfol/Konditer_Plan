from datetime import datetime, timedelta
from fastapi import HTTPException
from app.repositories import mock_db
from app.entities.schedule import repository as schedule_repo
from app.entities.order import repository as order_repo
from app.entities.recipe import repository as recipe_repo


def plan_order(order_id: int):
    order = order_repo.get_by_id(order_id)
    if not order:
        raise HTTPException(404, "Заказ не найден")

    operations = recipe_repo.get_operations(order["recipe_id"])

    current_time = datetime.combine(order["delivery_date"], datetime.min.time())

    for op in reversed(operations):
        duration = timedelta(minutes=op["duration_minutes"])
        start_time = current_time - duration

        # ищем кондитера
        confectioner = next(
            (c for c in mock_db.MockDB.confectioners if c["is_active"]),
            None
        )

        if not confectioner:
            raise HTTPException(400, "Нет доступных кондитеров")

        # ищем оборудование (если нужно)
        equipment_id = None
        if op["equipment_type_id"]:
            eq = next(
                (e for e in mock_db.MockDB.equipment
                 if e["equipment_type_id"] == op["equipment_type_id"] and e["is_active"]),
                None
            )
            if not eq:
                raise HTTPException(400, "Нет оборудования")

            equipment_id = eq["equipment_id"]

        entry = {
            "schedule_entry_id": len(schedule_repo.get_all()) + 1,
            "order_id": order_id,
            "recipe_operation_id": op["recipe_operation_id"],
            "start_time": start_time,
            "end_time": current_time,
            "equipment_id": equipment_id,
            "confectioner_id": confectioner["confectioner_id"],
            "status": "planned"
        }

        schedule_repo.create(entry)

        current_time = start_time

    return {"status": "success", "order_id": order_id}