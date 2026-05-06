from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Ingredient


class IngredientRepository(BaseRepository):

    def __init__(self):
        super().__init__(Ingredient)

    # чтение по имени
    def get_by_name(self, db: Session, name: str):
        return db.query(Ingredient).filter(Ingredient.name == name).first()

    # чтение с низким остатком
    def get_low_stock(self, db: Session):
        return db.query(Ingredient).filter(Ingredient.current_quantity <= Ingredient.min_quantity).all()

    # проверка существования
    def exists(self, db: Session, ingredient_id: int):
        return db.query(Ingredient).filter(Ingredient.ingredient_id == ingredient_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        ingredient = Ingredient(**data)
        db.add(ingredient)
        db.commit()
        db.refresh(ingredient)
        return ingredient
