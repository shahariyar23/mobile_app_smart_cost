from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class AlertType(str, Enum):
    """Budget alert types."""
    WARNING = "warning"
    EXCEEDED = "exceeded"
    OVERSPENT = "overspent"


# ============ Budget Schemas ============

class BudgetBase(BaseModel):
    user_id: int
    category_id: int | None = None
    amount: float = Field(..., gt=0, description="Budget amount in BDT")
    period: str = Field(..., description="Period in YYYY-MM format")
    start_date: date
    end_date: date


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    amount: float | None = Field(None, gt=0)
    category_id: int | None = None


class BudgetRead(BudgetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============ Budget Analytics & Summary Schemas ============

class BudgetAnalyticsDTO(BaseModel):
    """Budget analytics data."""
    total_budget: float = Field(..., description="Total allocated budget")
    total_spent: float = Field(..., description="Total spent amount")
    remaining_budget: float = Field(..., description="Remaining budget")
    utilization_percentage: float = Field(..., description="Percentage of budget used")
    most_spent_category: str | None = Field(None, description="Category with highest spending")
    least_spent_category: str | None = Field(None, description="Category with lowest spending")

    model_config = ConfigDict(from_attributes=True)


class BudgetRecommendationDTO(BaseModel):
    """Daily spending recommendation."""
    remaining_budget: float
    remaining_days: int
    daily_recommendation: float = Field(..., description="Recommended daily spending")


class BudgetScoreDTO(BaseModel):
    """Budget score and status."""
    score: int = Field(..., ge=0, le=100)
    status: str = Field(..., description="Score status: Excellent, Good, Fair, Poor")
    message: str = Field(..., description="Detailed score message")


class BudgetSummaryDTO(BaseModel):
    """Complete budget summary."""
    budget: BudgetRead
    spent_amount: float
    remaining_amount: float
    utilization_percentage: float
    status: str  # "on-track", "warning", "exceeded"
    daily_recommendation: float


# ============ Budget Alert Schemas ============

class BudgetAlertBase(BaseModel):
    user_id: int
    budget_id: int
    message: str
    alert_type: AlertType


class BudgetAlertCreate(BudgetAlertBase):
    pass


class BudgetAlertRead(BudgetAlertBase):
    id: int
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetAlertUpdate(BaseModel):
    is_read: bool | None = None


# ============ Budget History Schemas ============

class BudgetHistoryBase(BaseModel):
    user_id: int
    budget_id: int
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2000)
    total_budget: float
    total_spent: float
    remaining_budget: float
    utilization_percentage: float


class BudgetHistoryCreate(BudgetHistoryBase):
    pass


class BudgetHistoryRead(BudgetHistoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
