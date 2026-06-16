from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.report import ReportQuery, ReportResponse

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/summary", response_model=ReportResponse)
def generate_report(*, payload: ReportQuery, db: Session = Depends(get_db)) -> ReportResponse:
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == payload.user_id,
            Transaction.transaction_date >= payload.start_date,
            Transaction.transaction_date <= payload.end_date,
        )
        .all()
    )

    total_income = sum(float(t.amount) for t in transactions if t.type == "income")
    total_expense = sum(float(t.amount) for t in transactions if t.type == "expense")
    category_breakdown: dict[str, float] = {}
    for t in transactions:
        category = None
        if t.category_id is not None:
            category_row = db.query(Category).filter(Category.id == t.category_id).first()
            category = category_row.name if category_row else None
        category_key = category or "other"
        category_breakdown.setdefault(category_key, 0.0)
        category_breakdown[category_key] += float(t.amount)

    return ReportResponse(
        total_expense=total_expense,
        total_income=total_income,
        category_breakdown=category_breakdown,
    )
