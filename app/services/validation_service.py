from fastapi import HTTPException
from datetime import date
from app.repositories import mock_db, recipe_repo


def validate_order(order):
    recipe = recipe_repo.get_recipe(order.recipe_id)

    # проверка срока хранения
    min_date = date.today()
    if order.delivery_date < min_date:
        raise HTTPException(400, "Дата меньше текущей")

    # проверка ингредиентов
    ingredients = recipe_repo.get_ingredients(order.recipe_id)

    for ing in ingredients:
        stock = next(i for i in mock_db.MockDB.ingredients if i["ingredient_id"] == ing["ingredient_id"])
        required = ing["quantity_per_unit"] * order.quantity

        if stock["current_quantity"] < required:
            raise HTTPException(
                400,
                f"Недостаточно ингредиента {stock['name']}"
            )