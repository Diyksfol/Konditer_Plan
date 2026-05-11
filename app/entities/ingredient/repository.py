from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import Ingredient


class IngredientRepository(BaseRepository):

    def __init__(self):
        super().__init__(Ingredient)

    # чтение по имени
    def get_by_ingredient_name(self, db: Session, ingredient_name: str):
        return db.query(Ingredient).filter(Ingredient.ingredient_name == ingredient_name).first()

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
