from pydantic import BaseModel
from datetime import date

class OrderCreate(BaseModel):
    recipe_id: int
    quantity: int
    delivery_date: date

class OrderResponse(BaseModel):
    order_id: int
    recipe_id: int
    quantity: int
    delivery_date: date
    status: str