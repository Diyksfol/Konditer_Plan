from app.repositories.mock_db import MockDB


def get_all():
    return MockDB.schedule


def get_by_id(schedule_id: int):
    return next((s for s in MockDB.schedule if s["schedule_entry_id"] == schedule_id), None)


def create(schedule: dict):
    new_schedule = {
        "schedule_entry_id": len(MockDB.schedule) + 1,
        **schedule
    }
    MockDB.schedule.append(new_schedule)
    return new_schedule


def update(schedule_id: int, data: dict):
    schedule = get_by_id(schedule_id)
    if schedule:
        schedule.update(data)
    return schedule


def delete(schedule_id: int):
    schedule = get_by_id(schedule_id)
    if schedule:
        MockDB.schedule.remove(schedule)
        return True
    return False