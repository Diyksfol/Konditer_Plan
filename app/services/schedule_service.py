from datetime import datetime, timedelta

from app.repositories import schedule_repo
from app.repositories.mock_db import MockDB


def get_all_schedule():
    return schedule_repo.get_all()


def get_schedule(schedule_id: int):
    return schedule_repo.get_by_id(schedule_id)


def create_schedule(schedule_data):
    # если приходит Pydantic → превращаем в dict
    if hasattr(schedule_data, "dict"):
        schedule_data = schedule_data.dict()

    return schedule_repo.create(schedule_data)


def update_schedule(schedule_id: int, data: dict):
    return schedule_repo.update(schedule_id, data)


def delete_schedule(schedule_id: int):
    return schedule_repo.delete(schedule_id)



def generate_schedule(order):

    operations = [
        op for op in MockDB.recipe_operations
        if op["recipe_id"] == order["recipe_id"]
    ]

    operations.sort(key=lambda x: x["sequence_number"])

    # последнее время в расписании
    if MockDB.schedule:
        last_end_time = max(s["end_time"] for s in MockDB.schedule)
        current_time = last_end_time
    else:
        current_time = datetime.now()

    for op in operations:
        start_time = current_time
        end_time = start_time + timedelta(minutes=op["duration_minutes"])

        schedule_entry = {
            "order_id": order["order_id"],
            "recipe_operation_id": op["recipe_operation_id"],
            "start_time": start_time,
            "end_time": end_time,
            "equipment_id": None,
            "confectioner_id": 1,
            "status": "planned"
        }

        schedule_repo.create(schedule_entry)

        current_time = end_time