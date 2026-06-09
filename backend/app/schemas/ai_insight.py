from datetime import datetime

from pydantic import BaseModel


class AIInsightBase(BaseModel):
    user_id: int
    insight_type: str
    summary: str
    metadata: dict | None = None


class AIInsightCreate(AIInsightBase):
    pass


class AIInsightRead(AIInsightBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
