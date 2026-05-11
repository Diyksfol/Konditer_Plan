from sqlalchemy import Column, Integer, String
from app.repositories.database import Base


class EquipmentType(Base):
    __tablename__ = "equipment_types"

    equipment_type_id = Column(Integer, primary_key=True, index=True)
    equipment_name = Column(String(100))