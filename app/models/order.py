from sqlalchemy import Column, Integer, Date, String, TIMESTAMP
from app.repositories.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer)
    quantity = Column(Integer)
    delivery_date = Column(Date)
    status = Column(String)
    created_at = Column(TIMESTAMP)