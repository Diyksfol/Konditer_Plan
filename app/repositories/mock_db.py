# repositories/mock_db.py

class MockDB:
    orders = []
    schedule = []

    recipes = [
        {"recipe_id": 1, "name": "Наполеон", "shelf_life_days": 3}
    ]

    recipe_ingredients = [
        {"recipe_id": 1, "ingredient_id": 1, "quantity_per_unit": 0.5}
    ]

    ingredients = [
        {"ingredient_id": 1, "name": "Мука", "current_quantity": 100}
    ]

    recipe_operations = [
        {
            "recipe_operation_id": 1,
            "recipe_id": 1,
            "sequence_number": 1,
            "duration_minutes": 60
        }
    ]

    equipment = [
        {"equipment_id": 1, "equipment_type_id": 1, "is_active": True}
    ]

    confectioners = [
        {"confectioner_id": 1, "qualification_id": 1, "is_active": True}
    ]