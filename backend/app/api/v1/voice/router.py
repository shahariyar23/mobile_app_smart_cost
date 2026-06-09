from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.voice_log import VoiceLog
from app.schemas.voice import VoiceLogCreate, VoiceLogRead

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/", response_model=VoiceLogRead)
def create_voice_log(*, payload: VoiceLogCreate, db: Session = Depends(get_db)) -> VoiceLogRead:
    voice_log = VoiceLog(
        user_id=payload.user_id,
        transcript=payload.transcript,
        intent=payload.intent,
        raw_payload=payload.raw_payload,
    )
    db.add(voice_log)
    db.commit()
    db.refresh(voice_log)
    return voice_log


@router.get("/", response_model=list[VoiceLogRead])
def list_voice_logs(db: Session = Depends(get_db)) -> list[VoiceLogRead]:
    return db.query(VoiceLog).all()
