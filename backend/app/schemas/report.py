from datetime import date

from pydantic import BaseModel


class ReportQuery(BaseModel):
    user_id: int
    start_date: date
    end_date: date


class ReportResponse(BaseModel):
    total_expense: float
    total_income: float
    category_breakdown: dict[str, float]
