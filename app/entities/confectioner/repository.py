from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Confectioner


class ConfectionerRepository(BaseRepository):

    def __init__(self):
        super().__init__(Confectioner)

    # чтение по квалификации
    def get_by_qualification(self, db: Session, qualification_id: int):
        return db.query(Confectioner).filter(Confectioner.qualification_id == qualification_id).all()

    # чтение активных кондитеров
    def get_active(self, db: Session):
        return db.query(Confectioner).filter(Confectioner.is_active == True).all()

    # проверка существования
    def exists(self, db: Session, confectioner_id: int):
        return db.query(Confectioner).filter(Confectioner.confectioner_id == confectioner_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        confectioner = Confectioner(**data)
        db.add(confectioner)
        db.commit()
        db.refresh(confectioner)
        return confectioner
