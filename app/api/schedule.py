from fastapi import APIRouter, HTTPException
from app.services import schedule_service
from app.models.schedule import ScheduleEntry


router = APIRouter()

@router.get("/")
def get_schedule():
    return schedule_service.get_all_schedule()

@router.get("/{schedule_id}")
def get_schedule_by_id(schedule_id: int):
    schedule = schedule_service.get_schedule(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.post("/")
def create_schedule(schedule: ScheduleEntry):
    return schedule_service.create_schedule(schedule)

@router.put("/{schedule_id}")
def update_schedule(schedule_id: int, data: dict):
    schedule = schedule_service.update_schedule(schedule_id, data)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int):
    success = schedule_service.delete_schedule(schedule_id)
    if not success:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"message": "Schedule deleted"}