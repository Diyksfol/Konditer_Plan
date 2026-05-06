from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Qualification


class QualificationRepository(BaseRepository):

    def __init__(self):
        super().__init__(Qualification)

    # чтение по имени
    def get_by_name(self, db: Session, name: str):
        return db.query(Qualification).filter(Qualification.name == name).first()

    # проверка существования
    def exists(self, db: Session, qualification_id: int):
        return db.query(Qualification).filter(Qualification.qualification_id == qualification_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        qualification = Qualification(**data)
        db.add(qualification)
        db.commit()
        db.refresh(qualification)
        return qualification
