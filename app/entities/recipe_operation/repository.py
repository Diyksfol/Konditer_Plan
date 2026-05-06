from sqlalchemy.orm import Session
from app.repositories.base_repository import BaseRepository
from .model import RecipeOperation


class RecipeOperationRepository(BaseRepository):

    def __init__(self):
        super().__init__(RecipeOperation)

    # чтение по рецепту (с сортировкой по sequence_number)
    def get_by_recipe_id(self, db: Session, recipe_id: int):
        return db.query(RecipeOperation).filter(RecipeOperation.recipe_id == recipe_id).order_by(RecipeOperation.sequence_number).all()

    # чтение по типу оборудования
    def get_by_equipment_type(self, db: Session, equipment_type_id: int):
        return db.query(RecipeOperation).filter(RecipeOperation.equipment_type_id == equipment_type_id).all()

    # проверка существования
    def exists(self, db: Session, recipe_operation_id: int):
        return db.query(RecipeOperation).filter(RecipeOperation.recipe_operation_id == recipe_operation_id).first() is not None

    # безопасное создание
    def safe_create(self, db: Session, data: dict):
        recipe_operation = RecipeOperation(**data)
        db.add(recipe_operation)
        db.commit()
        db.refresh(recipe_operation)
        return recipe_operation
