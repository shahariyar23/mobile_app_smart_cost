from datetime import datetime

from pydantic import BaseModel


class VoiceLogBase(BaseModel):
    user_id: int
    transcript: str
    intent: str | None = None
    raw_payload: dict | None = None


class VoiceLogCreate(VoiceLogBase):
    pass


class VoiceLogRead(VoiceLogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
