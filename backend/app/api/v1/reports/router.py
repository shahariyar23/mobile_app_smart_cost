from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
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
        category_breakdown.setdefault(str(t.category_id), 0.0)
        category_breakdown[str(t.category_id)] += float(t.amount)

    return ReportResponse(
        total_expense=total_expense,
        total_income=total_income,
        category_breakdown=category_breakdown,
    )
