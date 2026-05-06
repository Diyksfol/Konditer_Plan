from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Inventory


class InventoryRepository(BaseRepository):

    def __init__(self):
        super().__init__(Inventory)

    # чтение по ингредиенту
    def get_by_ingredient_id(self, db: Session, ingredient_id: int):
        return db.query(Inventory).filter(Inventory.ingredient_id == ingredient_id).first()

    # чтение с низким запасом
    def get_low_stock(self, db: Session):
        return db.query(Inventory).filter(Inventory.current_quantity <= Inventory.min_stock).all()

    # проверка существования
    def exists(self, db: Session, inventory_id: int):
        return db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        inventory = Inventory(**data)
        db.add(inventory)
        db.commit()
        db.refresh(inventory)
        return inventory
