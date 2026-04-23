from sqlalchemy import Column, Integer, String
from app.repositories.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    recipe_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    shelf_life_days = Column(Integer)