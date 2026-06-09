from datetime import datetime

from pydantic import BaseModel


class NotificationBase(BaseModel):
    user_id: int
    type: str
    message: str
    read: bool = False
    delivered_at: datetime | None = None


class NotificationCreate(NotificationBase):
    pass


class NotificationRead(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
