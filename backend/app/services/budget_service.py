from datetime import date, datetime
from typing import Optional
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.budget import Budget, BudgetAlert, BudgetHistory
from app.models.transaction import Transaction
from app.reposotories.budget_repository import (
    BudgetRepository,
    BudgetAlertRepository,
    BudgetHistoryRepository,
)
from app.schemas.budget import (
    BudgetCreate,
    BudgetRead,
    BudgetUpdate,
    BudgetSummaryDTO,
    BudgetAnalyticsDTO,
    BudgetRecommendationDTO,
    BudgetScoreDTO,
    AlertType,
)
from sqlalchemy import and_, func


class BudgetService:
    """Service layer for budget operations."""

    def __init__(self, db: Session):
        self.db = db
        self.budget_repo = BudgetRepository(db)
        self.alert_repo = BudgetAlertRepository(db)
        self.history_repo = BudgetHistoryRepository(db)

    def create_budget(self, payload: BudgetCreate) -> BudgetRead:
        """Create a new budget."""
        budget = Budget(
            user_id=payload.user_id,
            category_id=payload.category_id,
            amount=payload.amount,
            period=payload.period,
            start_date=payload.start_date,
            end_date=payload.end_date,
        )
        created = self.budget_repo.create(budget)
        return BudgetRead.from_orm(created)

    def get_current_month_budget(
        self, user_id: int, category_id: int | None = None
    ) -> Optional[BudgetRead]:
        """Get current month budget."""
        budget = self.budget_repo.get_current_month(user_id, category_id)
        return BudgetRead.from_orm(budget) if budget else None

    def get_budget(self, budget_id: int, user_id: int) -> Optional[BudgetRead]:
        """Get budget by ID."""
        budget = self.budget_repo.get_by_id(budget_id, user_id)
        return BudgetRead.from_orm(budget) if budget else None

    def list_budgets(
        self, user_id: int, limit: int = 100, offset: int = 0
    ) -> list[BudgetRead]:
        """List user's budgets."""
        budgets = self.budget_repo.list_by_user(user_id, limit, offset)
        return [BudgetRead.from_orm(b) for b in budgets]

    def update_budget(
        self, budget_id: int, user_id: int, payload: BudgetUpdate
    ) -> Optional[BudgetRead]:
        """Update budget."""
        budget = self.budget_repo.get_by_id(budget_id, user_id)
        if not budget:
            return None

        if payload.amount is not None:
            budget.amount = payload.amount
        if payload.category_id is not None:
            budget.category_id = payload.category_id

        budget.updated_at = datetime.now()
        updated = self.budget_repo.update(budget)
        return BudgetRead.from_orm(updated)

    def delete_budget(self, budget_id: int, user_id: int) -> bool:
        """Delete budget."""
        return self.budget_repo.delete(budget_id, user_id)

    # ============ Budget Tracking ============

    def get_spent_amount(self, budget_id: int) -> float:
        """Calculate total spent for a budget."""
        budget = self.budget_repo.get_by_id(budget_id)
        if not budget:
            return 0

        # For category-specific budgets
        if budget.category_id:
            result = (
                self.db.query(func.sum(Transaction.amount))
                .filter(
                    and_(
                        Transaction.type == "expense",
                        Transaction.user_id == budget.user_id,
                        Transaction.category_id == budget.category_id,
                        Transaction.transaction_date >= budget.start_date,
                        Transaction.transaction_date <= budget.end_date,
                    )
                )
                .scalar()
            )
        else:
            # For overall budget - sum all expenses
            result = (
                self.db.query(func.sum(Transaction.amount))
                .filter(
                    and_(
                        Transaction.type == "expense",
                        Transaction.user_id == budget.user_id,
                        Transaction.transaction_date >= budget.start_date,
                        Transaction.transaction_date <= budget.end_date,
                    )
                )
                .scalar()
            )

        return float(result) if result else 0

    def get_budget_summary(self, budget_id: int, user_id: int) -> Optional[BudgetSummaryDTO]:
        """Get complete budget summary with calculations."""
        budget = self.budget_repo.get_by_id(budget_id, user_id)
        if not budget:
            return None

        spent = self.get_spent_amount(budget_id)
        remaining = float(budget.amount) - spent
        utilization = (spent / float(budget.amount) * 100) if budget.amount else 0

        # Determine status
        if utilization >= 100:
            status = "exceeded"
        elif utilization >= 80:
            status = "warning"
        else:
            status = "on-track"

        # Calculate daily recommendation
        daily_rec = self._calculate_daily_recommendation(budget, spent)

        return BudgetSummaryDTO(
            budget=BudgetRead.from_orm(budget),
            spent_amount=spent,
            remaining_amount=max(0, remaining),
            utilization_percentage=min(utilization, 100),
            status=status,
            daily_recommendation=daily_rec,
        )

    def _calculate_daily_recommendation(self, budget: Budget, spent: float) -> float:
        """Calculate recommended daily spending."""
        remaining_budget = max(0, float(budget.amount) - spent)
        remaining_days = max(1, (budget.end_date - date.today()).days)
        return remaining_budget / remaining_days if remaining_days > 0 else 0

    # ============ Budget Alerts ============

    def check_and_create_alerts(self, budget_id: int, user_id: int) -> list[BudgetAlert]:
        """Check budget thresholds and create alerts."""
        summary = self.get_budget_summary(budget_id, user_id)
        if not summary:
            return []

        alerts = []
        budget = self.budget_repo.get_by_id(budget_id, user_id)

        if summary.utilization_percentage >= 100:
            alert_type = AlertType.EXCEEDED if summary.utilization_percentage < 120 else AlertType.OVERSPENT
            message = f"Budget exceeded: {summary.utilization_percentage:.1f}%"
        elif summary.utilization_percentage >= 80:
            alert_type = AlertType.WARNING
            message = f"Budget is {summary.utilization_percentage:.1f}% used"
        else:
            return alerts

        # Check if alert already exists for this budget today
        existing = (
            self.db.query(BudgetAlert)
            .filter(
                and_(
                    BudgetAlert.budget_id == budget_id,
                    BudgetAlert.alert_type == alert_type,
                    func.date(BudgetAlert.created_at) == date.today(),
                )
            )
            .first()
        )

        if not existing:
            alert = BudgetAlert(
                user_id=user_id,
                budget_id=budget_id,
                message=message,
                alert_type=alert_type,
            )
            created = self.alert_repo.create(alert)
            alerts.append(created)

        return alerts

    def get_alerts(
        self, user_id: int, is_read: bool | None = None, limit: int = 100, offset: int = 0
    ) -> list[BudgetAlert]:
        """Get user's alerts."""
        return self.alert_repo.list_by_user(user_id, is_read, limit, offset)

    def mark_alert_as_read(self, alert_id: int) -> bool:
        """Mark alert as read."""
        return self.alert_repo.mark_as_read(alert_id)

    # ============ Budget Analytics ============

    def get_analytics(self, user_id: int, period: str | None = None) -> BudgetAnalyticsDTO:
        """Get budget analytics for user."""
        if period:
            budgets = self.budget_repo.list_by_user_and_period(user_id, period)
        else:
            today = date.today()
            period = f"{today.year}-{today.month:02d}"
            budgets = self.budget_repo.list_by_user_and_period(user_id, period)

        total_budget = sum(float(b.amount) for b in budgets)
        total_spent = sum(self.get_spent_amount(b.id) for b in budgets)
        remaining = max(0, total_budget - total_spent)
        utilization = (total_spent / total_budget * 100) if total_budget else 0

        # Find most/least spent categories
        category_spending = {}
        for budget in budgets:
            if budget.category_id:
                spent = self.get_spent_amount(budget.id)
                category_spending[budget.category_id] = spent

        most_spent = (
            max(category_spending, key=category_spending.get)
            if category_spending
            else None
        )
        least_spent = (
            min(category_spending, key=category_spending.get)
            if category_spending
            else None
        )

        return BudgetAnalyticsDTO(
            total_budget=total_budget,
            total_spent=total_spent,
            remaining_budget=remaining,
            utilization_percentage=min(utilization, 100),
            most_spent_category=str(most_spent) if most_spent else None,
            least_spent_category=str(least_spent) if least_spent else None,
        )

    def get_daily_recommendation(self, budget_id: int, user_id: int) -> Optional[BudgetRecommendationDTO]:
        """Get daily spending recommendation."""
        budget = self.budget_repo.get_by_id(budget_id, user_id)
        if not budget:
            return None

        spent = self.get_spent_amount(budget_id)
        remaining_budget = max(0, float(budget.amount) - spent)
        remaining_days = max(1, (budget.end_date - date.today()).days)

        daily_rec = self._calculate_daily_recommendation(budget, spent)

        return BudgetRecommendationDTO(
            remaining_budget=remaining_budget,
            remaining_days=remaining_days,
            daily_recommendation=daily_rec,
        )

    # ============ Budget Score ============

    def calculate_budget_score(self, user_id: int, period: str | None = None) -> BudgetScoreDTO:
        """Calculate budget score (0-100)."""
        analytics = self.get_analytics(user_id, period)

        # Score calculation logic
        if analytics.total_budget == 0:
            score = 50
            status = "Fair"
            message = "No budget set"
        elif analytics.utilization_percentage > 100:
            # Penalize overspending
            overage = analytics.utilization_percentage - 100
            score = max(0, 50 - int(overage))
            status = "Poor"
            message = f"Overspent by {overage:.1f}%"
        elif analytics.utilization_percentage >= 90:
            score = 70
            status = "Fair"
            message = "Nearly at budget limit"
        elif analytics.utilization_percentage >= 80:
            score = 80
            status = "Good"
            message = "Within acceptable range"
        elif analytics.utilization_percentage >= 60:
            score = 90
            status = "Excellent"
            message = "Good spending discipline"
        else:
            score = 100
            status = "Excellent"
            message = "Excellent budget management"

        return BudgetScoreDTO(
            score=score,
            status=status,
            message=message,
        )

    # ============ Budget History ============

    def create_history(self, user_id: int, budget_id: int) -> BudgetHistory:
        """Create a budget history snapshot."""
        budget = self.budget_repo.get_by_id(budget_id, user_id)
        if not budget:
            raise ValueError("Budget not found")

        today = date.today()
        month = today.month
        year = today.year

        # Check if history already exists for this month
        existing = self.history_repo.get_by_month_year(user_id, month, year)
        if existing:
            return existing

        spent = self.get_spent_amount(budget_id)
        remaining = max(0, float(budget.amount) - spent)
        utilization = (spent / float(budget.amount) * 100) if budget.amount else 0

        history = BudgetHistory(
            user_id=user_id,
            budget_id=budget_id,
            month=month,
            year=year,
            total_budget=float(budget.amount),
            total_spent=spent,
            remaining_budget=remaining,
            utilization_percentage=min(utilization, 100),
        )

        return self.history_repo.create(history)

    def get_history(
        self, user_id: int, limit: int = 100, offset: int = 0
    ) -> list[BudgetHistory]:
        """Get budget history for user."""
        return self.history_repo.list_by_user(user_id, limit, offset)

    def get_history_last_months(self, user_id: int, months: int = 3) -> list[BudgetHistory]:
        """Get history for last N months."""
        return self.history_repo.list_last_months(user_id, months)
