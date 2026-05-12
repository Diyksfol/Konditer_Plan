from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.planning_service import PlanningService

router = APIRouter()


class PlanningRequest(BaseModel):
    order_id: Optional[int] = None


@router.post("/update-statuses")
def update_order_statuses(db: Session = Depends(get_db)):
    """Обновляет статусы заказов и операций на основе текущего времени."""
    service = PlanningService()
    service.update_order_statuses(db)
    return {"message": "Statuses updated successfully"}
