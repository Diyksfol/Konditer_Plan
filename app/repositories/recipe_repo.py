from app.repositories.mock_db import MockDB

def get_recipe(recipe_id):
    return next(r for r in MockDB.recipes if r["recipe_id"] == recipe_id)

def get_ingredients(recipe_id):
    return [ri for ri in MockDB.recipe_ingredients if ri["recipe_id"] == recipe_id]

def get_operations(recipe_id):
    return sorted(
        [op for op in MockDB.recipe_operations if op["recipe_id"] == recipe_id],
        key=lambda x: x["sequence_number"]
    )