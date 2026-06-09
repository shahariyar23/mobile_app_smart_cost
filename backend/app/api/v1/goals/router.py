from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalRead

router = APIRouter(prefix="/goals", tags=["goals"])


@router.post("/", response_model=GoalRead)
def create_goal(*, payload: GoalCreate, db: Session = Depends(get_db)) -> GoalRead:
    goal = Goal(
        user_id=payload.user_id,
        title=payload.title,
        target_amount=payload.target_amount,
        current_amount=payload.current_amount,
        due_date=payload.due_date,
        status=payload.status,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/", response_model=list[GoalRead])
def list_goals(db: Session = Depends(get_db)) -> list[GoalRead]:
    return db.query(Goal).all()
