from fastapi import FastAPI
from app.api import orders, schedule
from app.repositories.database import Base, engine


Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])