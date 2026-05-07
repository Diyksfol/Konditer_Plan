from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.repositories.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    equipment_id = Column(Integer, primary_key=True, index=True)
    equipment_name = Column(String(100))
    equipment_type_id = Column(Integer, ForeignKey("equipment_types.equipment_type_id"))
    is_active = Column(Boolean, default=True)