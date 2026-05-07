from fastapi import HTTPException
from datetime import date
from sqlalchemy.orm import Session
from app.entities.recipe import RecipeRepository
from app.entities.inventory import InventoryRepository
from app.entities.recipe_ingredient import RecipeIngredientRepository


def validate_order(order_data, db: Session):
    # Получаем данные из словаря
    recipe_id = order_data.get("recipe_id")
    quantity = order_data.get("quantity")
    delivery_date = order_data.get("delivery_date")

    # 1. Проверяем существование рецепта
    if recipe_id is None:
        raise HTTPException(status_code=400, detail="recipe_id is required")
    if quantity is None or quantity <= 0:
        raise HTTPException(status_code=400, detail="quantity must be greater than zero")
    if delivery_date is None:
        raise HTTPException(status_code=400, detail="delivery_date is required")

    recipe_repo = RecipeRepository()
    recipe = recipe_repo.get_by_id(db, recipe_id)

    if not recipe:
        raise HTTPException(status_code=404, detail=f"Рецепт с id {recipe_id} не найден")

    # 2. Проверка даты доставки
    min_date = date.today()
    if delivery_date < min_date:
        raise HTTPException(status_code=400, detail="Дата доставки не может быть меньше текущей")

    # 3. Проверка ингредиентов
    recipe_ingredients_repo = RecipeIngredientRepository()
    ingredients = recipe_ingredients_repo.get_by_recipe_id(db, recipe_id)

    if not ingredients:
        raise HTTPException(status_code=400, detail=f"Для рецепта {recipe.name} не указаны ингредиенты")

    inventory_repo = InventoryRepository()

    for ing in ingredients:
        # Получаем остаток ингредиента на складе
        inventory = inventory_repo.get_by_ingredient_id(db, ing.ingredient_id)

        if not inventory:
            raise HTTPException(
                status_code=400,
                detail=f"Ингредиент с id {ing.ingredient_id} не найден на складе"
            )

        # Рассчитываем требуемое количество
        required = ing.quantity_per_unit * quantity

        if inventory.current_quantity < required:
            # Получаем название ингредиента
            from app.entities.ingredient.model import Ingredient
            ingredient = db.query(Ingredient).filter(Ingredient.ingredient_id == ing.ingredient_id).first()
            ingredient_name = ingredient.name if ingredient else f"id={ing.ingredient_id}"

            raise HTTPException(
                status_code=400,
                detail=f"Недостаточно ингредиента '{ingredient_name}'. "
                       f"Нужно: {required} {inventory.unit}, "
                       f"в наличии: {inventory.current_quantity} {inventory.unit}"
            )

    return True