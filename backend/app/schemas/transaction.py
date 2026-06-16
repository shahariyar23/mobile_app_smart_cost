from datetime import date, datetime

from pydantic import BaseModel


class TransactionBase(BaseModel):
    user_id: int
    category_id: int | None = None
    category: str | None = None
    amount: float
    type: str
    note: str | None = None
    transaction_date: date


class TransactionCreate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
