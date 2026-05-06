from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import EquipmentType


class EquipmentTypeRepository(BaseRepository):

    def __init__(self):
        super().__init__(EquipmentType)

    # чтение по имени
    def get_by_name(self, db: Session, name: str):
        return db.query(EquipmentType).filter(EquipmentType.name == name).first()

    # проверка существования
    def exists(self, db: Session, equipment_type_id: int):
        return db.query(EquipmentType).filter(EquipmentType.equipment_type_id == equipment_type_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        equipment_type = EquipmentType(**data)
        db.add(equipment_type)
        db.commit()
        db.refresh(equipment_type)
        return equipment_type
