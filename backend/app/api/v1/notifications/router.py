from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationRead

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/", response_model=NotificationRead)
def create_notification(*, payload: NotificationCreate, db: Session = Depends(get_db)) -> NotificationRead:
    notification = Notification(
        user_id=payload.user_id,
        type=payload.type,
        message=payload.message,
        read=payload.read,
        delivered_at=payload.delivered_at,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.get("/", response_model=list[NotificationRead])
def list_notifications(db: Session = Depends(get_db)) -> list[NotificationRead]:
    return db.query(Notification).all()
