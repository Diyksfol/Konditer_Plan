from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, ForeignKey, CheckConstraint
from app.repositories.database import Base


class Inventory(Base):
    __tablename__ = "inventories"

    inventory_id = Column(Integer, primary_key=True, index=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.ingredient_id", ondelete="CASCADE", onupdate="CASCADE"))
    current_quantity = Column(Numeric(10, 3), default=0.000)
    min_stock = Column(Numeric(10, 3), default=0.000)
    last_check = Column(TIMESTAMP, default="CURRENT_TIMESTAMP")

    __table_args__ = (
        CheckConstraint('current_quantity >= 0', name='check_current_quantity_non_negative'),
        CheckConstraint('min_stock >= 0', name='check_min_stock_non_negative'),
    )