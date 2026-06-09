from datetime import date, datetime

from pydantic import BaseModel


class BudgetBase(BaseModel):
    user_id: int
    category_id: int | None = None
    amount: float
    period: str
    start_date: date
    end_date: date


class BudgetCreate(BudgetBase):
    pass


class BudgetRead(BudgetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
