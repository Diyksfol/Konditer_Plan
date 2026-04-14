from app.repositories import order_repo
from app.services.validation_service import validate_order
from app.services.schedule_service import generate_schedule

def get_all_orders():
    return order_repo.get_all()

def get_order(order_id: int):
    return order_repo.get_by_id(order_id)

def create_order(order_data):
    validate_order(order_data)

    new_order = {
        "order_id": len(order_repo.get_all()) + 1,
        "recipe_id": order_data.recipe_id,
        "quantity": order_data.quantity,
        "delivery_date": order_data.delivery_date,
        "status": "planned"
    }

    created_order = order_repo.create(new_order)

    # генерация расписания
    generate_schedule(created_order)

    return created_order

def update_order(order_id: int, data: dict):
    return order_repo.update(order_id, data)

def delete_order(order_id: int):
    return order_repo.delete(order_id)