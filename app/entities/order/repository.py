from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Order


class OrderRepository(BaseRepository):

    def __init__(self):
        super().__init__(Order)

    # чтение по статусу
    def get_by_status(self, db: Session, status: str):
        return db.query(Order).filter(Order.status == status).all()

    # проверка существования
    def exists(self, db: Session, order_id: int):
        return db.query(Order).filter(Order.order_id == order_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        order = Order(**data)
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    # чтение по списку статусов
    def get_by_statuses(self, db: Session, statuses: list[str]):
        return db.query(Order).filter(Order.status.in_(statuses)).all()

    # обновление статуса
    def update_status(self, db: Session, order_id: int, status: str):
        order = db.query(Order).filter(Order.order_id == order_id).first()
        if order:
            order.status = status
            db.commit()
            db.refresh(order)
            return order
        return None