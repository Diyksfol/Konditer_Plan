from fastapi import FastAPI
from app.api import orders, schedule

app = FastAPI()

app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])