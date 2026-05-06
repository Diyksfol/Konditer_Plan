from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.planning_service import PlanningService

router = APIRouter()


class PlanningRequest(BaseModel):
    order_id: Optional[int] = None


@router.post("/run")
def run_planning(request: PlanningRequest, db: Session = Depends(get_db)):
    """Запуск алгоритма планирования.

    Если order_id передан в теле запроса, планирование выполняется только для одного заказа.
    Если order_id отсутствует, запускается планирование для всех заказов со статусом "planned".
    """
    service = PlanningService()
    return service.run(db, request.order_id)
