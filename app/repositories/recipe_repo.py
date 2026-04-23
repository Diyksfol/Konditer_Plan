from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from app.models import Recipe


class RecipeRepository(BaseRepository):

    def __init__(self):
        super().__init__(Recipe)

    # чтение по имени
    def get_by_name(self, db: Session, name: str):
        return db.query(Recipe).filter(Recipe.name == name).first()

    # поиск по сроку хранения
    def get_by_shelf_life(self, db: Session, max_days: int):
        return db.query(Recipe).filter(Recipe.shelf_life_days <= max_days).all()

    # проверка существования
    def exists(self, db: Session, recipe_id: int):
        return db.query(Recipe).filter(Recipe.recipe_id == recipe_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        recipe = Recipe(**data)
        db.add(recipe)
        db.commit()
        db.refresh(recipe)
        return recipe