from datetime import datetime

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    type: str
    icon: str | None = None
    color: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
