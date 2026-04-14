from app.repositories.mock_db import MockDB


# получить все заказы
def get_all():
    return MockDB.orders

# получить заказ по id
def get_by_id(order_id: int):
    return next((o for o in MockDB.orders if o["order_id"] == order_id), None)

def create(order: dict):
    new_order = {
        "order_id": len(MockDB.orders) + 1,
        "recipe_id": order["recipe_id"],
        "quantity": order["quantity"],
        "delivery_date": order["delivery_date"],
        "status": "planned"
    }
    MockDB.orders.append(new_order)
    return new_order

def update(order_id: int, data: dict):
    order = get_by_id(order_id)
    if order is None:
        return None

    order.update(data)
    return order

def delete(order_id: int):
    order = get_by_id(order_id)
    if order is None:
        return False

    MockDB.orders.remove(order)
    return True