from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetRead

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.post("/", response_model=BudgetRead)
def create_budget(*, payload: BudgetCreate, db: Session = Depends(get_db)) -> BudgetRead:
    budget = Budget(
        user_id=payload.user_id,
        category_id=payload.category_id,
        amount=payload.amount,
        period=payload.period,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/", response_model=list[BudgetRead])
def list_budgets(db: Session = Depends(get_db)) -> list[BudgetRead]:
    return db.query(Budget).all()
