from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ScheduleEntry(BaseModel):
    schedule_entry_id: int
    order_id: int
    recipe_operation_id: int
    start_time: datetime
    end_time: datetime
    equipment_id: Optional[int]
    confectioner_id: int
    status: str