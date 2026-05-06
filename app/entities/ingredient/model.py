from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from app.repositories.database import Base


class Ingredient(Base):
    __tablename__ = "ingredients"

    ingredient_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    unit = Column(String(20))
    current_quantity = Column(Numeric(10, 3))
    min_quantity = Column(Numeric(10, 3))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)