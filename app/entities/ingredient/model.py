from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from app.repositories.database import Base


class Ingredient(Base):
    __tablename__ = "ingredients"

    ingredient_id = Column(Integer, primary_key=True, index=True)
    ingredient_name = Column(String(100))
    unit = Column(String(20))