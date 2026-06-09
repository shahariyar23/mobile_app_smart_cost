from datetime import date, datetime

from pydantic import BaseModel


class GoalBase(BaseModel):
    user_id: int
    title: str
    target_amount: float
    current_amount: float = 0
    due_date: date | None = None
    status: str = "active"


class GoalCreate(GoalBase):
    pass


class GoalRead(GoalBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
