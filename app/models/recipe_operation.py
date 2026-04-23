from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.repositories.database import Base


class RecipeOperation(Base):
    __tablename__ = "recipe_operations"

    recipe_operation_id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id"))
    sequence_number = Column(Integer)
    duration_minutes = Column(Integer)
    equipment_type_id = Column(Integer, ForeignKey("equipment_types.equipment_type_id"))
    required_qualification_id = Column(Integer, ForeignKey("qualifications.qualification_id"))

    __table_args__ = (
        UniqueConstraint('recipe_id', 'sequence_number', name='unique_recipe_sequence'),
    )