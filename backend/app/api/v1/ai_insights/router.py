from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.ai_insight import AIInsight
from app.schemas.ai_insight import AIInsightCreate, AIInsightRead

router = APIRouter(prefix="/ai-insights", tags=["ai_insights"])


@router.post("/", response_model=AIInsightRead)
def create_ai_insight(*, payload: AIInsightCreate, db: Session = Depends(get_db)) -> AIInsightRead:
    insight = AIInsight(
        user_id=payload.user_id,
        insight_type=payload.insight_type,
        summary=payload.summary,
        metadata=payload.metadata,
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight


@router.get("/", response_model=list[AIInsightRead])
def list_ai_insights(db: Session = Depends(get_db)) -> list[AIInsightRead]:
    return db.query(AIInsight).all()
