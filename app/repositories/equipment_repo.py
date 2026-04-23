from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from app.models import Equipment


class EquipmentRepository(BaseRepository):

    def __init__(self):
        super().__init__(Equipment)

    # чтение по типу оборудования
    def get_by_equipment_type(self, db: Session, equipment_type_id: int):
        return db.query(Equipment).filter(Equipment.equipment_type_id == equipment_type_id).all()

    # чтение активного оборудования
    def get_active(self, db: Session):
        return db.query(Equipment).filter(Equipment.is_active == True).all()

    # проверка существования
    def exists(self, db: Session, equipment_id: int):
        return db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        equipment = Equipment(**data)
        db.add(equipment)
        db.commit()
        db.refresh(equipment)
        return equipment