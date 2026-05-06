from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from app.repositories.database import Base


class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"

    schedule_entry_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    recipe_operation_id = Column(Integer, ForeignKey("recipe_operations.recipe_operation_id"))
    start_time = Column(TIMESTAMP)
    end_time = Column(TIMESTAMP)
    equipment_id = Column(Integer, ForeignKey("equipment.equipment_id"))
    confectioner_id = Column(Integer, ForeignKey("confectioners.confectioner_id"))
    status = Column(String(20))