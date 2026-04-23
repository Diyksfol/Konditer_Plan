from sqlalchemy.orm import Session
from datetime import datetime
from app.repositories.base_repository import BaseRepository
from app.models import ScheduleEntry


class ScheduleEntryRepository(BaseRepository):

    def __init__(self):
        super().__init__(ScheduleEntry)

    # чтение по заказу
    def get_by_order_id(self, db: Session, order_id: int):
        return db.query(ScheduleEntry).filter(ScheduleEntry.order_id == order_id).all()

    # чтение по оборудованию
    def get_by_equipment(self, db: Session, equipment_id: int):
        return db.query(ScheduleEntry).filter(ScheduleEntry.equipment_id == equipment_id).all()

    # чтение по кондитеру
    def get_by_confectioner(self, db: Session, confectioner_id: int):
        return db.query(ScheduleEntry).filter(ScheduleEntry.confectioner_id == confectioner_id).all()

    # чтение по временному диапазону
    def get_by_time_range(self, db: Session, start: datetime, end: datetime):
        return db.query(ScheduleEntry).filter(
            ScheduleEntry.start_time >= start,
            ScheduleEntry.end_time <= end
        ).all()

    # проверка существования
    def exists(self, db: Session, schedule_entry_id: int):
        return db.query(ScheduleEntry).filter(ScheduleEntry.schedule_entry_id == schedule_entry_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        schedule_entry = ScheduleEntry(**data)
        db.add(schedule_entry)
        db.commit()
        db.refresh(schedule_entry)
        return schedule_entry