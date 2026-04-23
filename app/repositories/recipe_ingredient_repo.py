from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from app.models import RecipeIngredient


class RecipeIngredientRepository(BaseRepository):

    def __init__(self):
        super().__init__(RecipeIngredient)

    # чтение по рецепту
    def get_by_recipe_id(self, db: Session, recipe_id: int):
        return db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).all()

    # чтение по ингредиенту
    def get_by_ingredient_id(self, db: Session, ingredient_id: int):
        return db.query(RecipeIngredient).filter(RecipeIngredient.ingredient_id == ingredient_id).all()

    # проверка существования
    def exists(self, db: Session, recipe_ingredient_id: int):
        return db.query(RecipeIngredient).filter(RecipeIngredient.recipe_ingredient_id == recipe_ingredient_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        recipe_ingredient = RecipeIngredient(**data)
        db.add(recipe_ingredient)
        db.commit()
        db.refresh(recipe_ingredient)
        return recipe_ingredient