from sqlalchemy import Column, Integer, ForeignKey, Numeric
from app.repositories.database import Base


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    recipe_ingredient_id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"))
    ingredient_id = Column(Integer, ForeignKey("ingredients.ingredient_id"))
    quantity_per_unit = Column(Numeric)