from fastapi import APIRouter, HTTPException
from app.models.order import OrderCreate
from app.services import order_service


router = APIRouter()

@router.get("/")
def get_orders():
    return order_service.get_all_orders()

@router.get("/{order_id}")
def get_order(order_id: int):
    order = order_service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/")
def create_order(order: OrderCreate):
    return order_service.create_order(order)

@router.put("/{order_id}")
def update_order(order_id: int, data: dict):
    order = order_service.update_order(order_id, data)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.delete("/{order_id}")
def delete_order(order_id: int):
    success = order_service.delete_order(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}