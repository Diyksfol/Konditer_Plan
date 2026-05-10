from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import *

from app.repositories.database import Base, engine

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Confectionery Management API", description="API для управления кондитерским производством")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение всех роутеров
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
app.include_router(recipes.router, prefix="/recipes", tags=["Recipes"])
app.include_router(confectioners.router, prefix="/confectioners", tags=["Confectioners"])
app.include_router(equipment_types.router, prefix="/equipment-types", tags=["Equipment Types"])
app.include_router(equipments.router, prefix="/equipments", tags=["Equipment"])
app.include_router(ingredients.router, prefix="/ingredients", tags=["Ingredients"])
app.include_router(inventories.router, prefix="/inventories", tags=["Inventories"])
app.include_router(qualifications.router, prefix="/qualifications", tags=["Qualifications"])
app.include_router(recipe_ingredients.router, prefix="/recipe-ingredients", tags=["Recipe Ingredients"])
app.include_router(recipe_operations.router, prefix="/recipe-operations", tags=["Recipe Operations"])
app.include_router(planning.router, prefix="/planning", tags=["Planning"])

@app.get("/")
def root():
    return {
        "message": "Confectionery Management API",
        "endpoints": {
            "orders": "/orders",
            "schedule": "/schedule",
            "recipes": "/recipes",
            "confectioners": "/confectioners",
            "equipment_types": "/equipment-types",
            "equipments": "/equipments",
            "ingredients": "/ingredients",
            "inventories": "/inventories",
            "qualifications": "/qualifications",
            "recipe_ingredients": "/recipe-ingredients",
            "recipe_operations": "/recipe-operations",
            "planning": "/planning/run"
        }
    }