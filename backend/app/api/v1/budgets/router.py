from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.budget import Budget
from app.schemas.budget import (
    BudgetCreate,
    BudgetRead,
    BudgetUpdate,
    BudgetAlertRead,
    BudgetAnalyticsDTO,
    BudgetRecommendationDTO,
    BudgetScoreDTO,
    BudgetSummaryDTO,
)
from app.services.budget_service import BudgetService

router = APIRouter(prefix="/budgets", tags=["budgets"])


# ============ Static Paths (Must be defined before /{budget_id}) ============

@router.post("/", response_model=BudgetRead, status_code=status.HTTP_201_CREATED)
def create_budget(
    *, payload: BudgetCreate, db: Session = Depends(get_db)
) -> BudgetRead:
    """Create a new monthly or category budget."""
    service = BudgetService(db)
    return service.create_budget(payload)


@router.get("/", response_model=list[BudgetRead])
def list_budgets(
    user_id: int = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[BudgetRead]:
    """List user's budgets."""
    service = BudgetService(db)
    return service.list_budgets(user_id, limit, offset)


@router.get("/current", response_model=Optional[BudgetRead])
def get_current_month_budget(
    user_id: int = Query(...),
    category_id: int | None = Query(None),
    db: Session = Depends(get_db),
) -> Optional[BudgetRead]:
    """Get current month's budget for user."""
    service = BudgetService(db)
    return service.get_current_month_budget(user_id, category_id)


@router.get("/alerts", response_model=list[BudgetAlertRead])
def get_alerts(
    user_id: int = Query(...),
    is_read: bool | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[BudgetAlertRead]:
    """Get user's budget alerts."""
    service = BudgetService(db)
    alerts = service.get_alerts(user_id, is_read, limit, offset)
    return [BudgetAlertRead.model_validate(a) for a in alerts]


@router.get("/analytics", response_model=BudgetAnalyticsDTO)
def get_budget_analytics(
    user_id: int = Query(...),
    period: str | None = Query(None, description="Period in YYYY-MM format"),
    db: Session = Depends(get_db),
) -> BudgetAnalyticsDTO:
    """Get budget analytics: total, spent, remaining, most/least spent categories."""
    service = BudgetService(db)
    return service.get_analytics(user_id, period)


@router.get("/score", response_model=BudgetScoreDTO)
def get_budget_score(
    user_id: int = Query(...),
    period: str | None = Query(None, description="Period in YYYY-MM format"),
    db: Session = Depends(get_db),
) -> BudgetScoreDTO:
    """Get budget score (0-100) and status."""
    service = BudgetService(db)
    return service.calculate_budget_score(user_id, period)


@router.get("/history", response_model=list)
def get_budget_history(
    user_id: int = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Get budget history for user."""
    service = BudgetService(db)
    return service.get_history(user_id, limit, offset)


@router.get("/history/last-months", response_model=list)
def get_history_last_months(
    user_id: int = Query(...),
    months: int = Query(3, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """Get budget history for last N months."""
    service = BudgetService(db)
    return service.get_history_last_months(user_id, months)


@router.patch("/alerts/{alert_id}/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_alert_as_read(alert_id: int, db: Session = Depends(get_db)) -> None:
    """Mark alert as read."""
    service = BudgetService(db)
    if not service.mark_alert_as_read(alert_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")


# ============ Dynamic Paths (Must be defined after static ones) ============

@router.get("/{budget_id}", response_model=BudgetRead)
def get_budget(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
) -> BudgetRead:
    """Get budget by ID."""
    service = BudgetService(db)
    budget = service.get_budget(budget_id, user_id)
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return budget


@router.patch("/{budget_id}", response_model=BudgetRead)
def update_budget(
    budget_id: int,
    payload: BudgetUpdate,
    user_id: int = Query(...),
    db: Session = Depends(get_db),
) -> BudgetRead:
    """Update budget amount or category."""
    service = BudgetService(db)
    budget = service.update_budget(budget_id, user_id, payload)
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
) -> None:
    """Delete budget."""
    service = BudgetService(db)
    if not service.delete_budget(budget_id, user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")


@router.get("/{budget_id}/summary", response_model=BudgetSummaryDTO)
def get_budget_summary(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
) -> BudgetSummaryDTO:
    """Get complete budget summary with spent/remaining/utilization."""
    service = BudgetService(db)
    summary = service.get_budget_summary(budget_id, user_id)
    if not summary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return summary


@router.post("/{budget_id}/check-alerts", response_model=list[BudgetAlertRead])
def check_and_create_alerts(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
) -> list[BudgetAlertRead]:
    """Check budget thresholds and create alerts if needed."""
    service = BudgetService(db)
    alerts = service.check_and_create_alerts(budget_id, user_id)
    return [BudgetAlertRead.model_validate(a) for a in alerts]


@router.get("/{budget_id}/recommendation", response_model=BudgetRecommendationDTO)
def get_daily_recommendation(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
) -> BudgetRecommendationDTO:
    """Get daily spending recommendation based on remaining budget and days."""
    service = BudgetService(db)
    rec = service.get_daily_recommendation(budget_id, user_id)
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return rec


@router.post("/{budget_id}/history", status_code=status.HTTP_201_CREATED)
def create_budget_history(
    budget_id: int, user_id: int = Query(...), db: Session = Depends(get_db)
):
    """Create a budget history snapshot for current month."""
    service = BudgetService(db)
    try:
        history = service.create_history(user_id, budget_id)
        return {"id": history.id, "message": "History snapshot created"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
