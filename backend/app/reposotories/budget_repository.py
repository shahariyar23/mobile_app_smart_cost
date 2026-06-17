from datetime import date, datetime
from typing import Optional

from sqlalchemy import and_, desc, func
from sqlalchemy.orm import Session

from app.models.budget import Budget, BudgetAlert, BudgetHistory


class BudgetRepository:
    """Repository for Budget operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, budget: Budget) -> Budget:
        """Create a new budget."""
        self.db.add(budget)
        self.db.commit()
        self.db.refresh(budget)
        return budget

    def get_by_id(self, budget_id: int, user_id: int | None = None) -> Optional[Budget]:
        """Get budget by ID."""
        query = self.db.query(Budget).filter(Budget.id == budget_id)
        if user_id:
            query = query.filter(Budget.user_id == user_id)
        return query.first()

    def get_current_month(self, user_id: int, category_id: int | None = None) -> Optional[Budget]:
        """Get current month budget for user."""
        today = date.today()
        period = f"{today.year}-{today.month:02d}"
        
        query = self.db.query(Budget).filter(
            and_(Budget.user_id == user_id, Budget.period == period)
        )
        if category_id:
            query = query.filter(Budget.category_id == category_id)
        return query.first()

    def get_by_period(self, user_id: int, period: str) -> Optional[Budget]:
        """Get budget by period (YYYY-MM)."""
        return self.db.query(Budget).filter(
            and_(Budget.user_id == user_id, Budget.period == period)
        ).first()

    def get_by_period_and_category(
        self, user_id: int, period: str, category_id: int
    ) -> Optional[Budget]:
        """Get category budget by period."""
        return self.db.query(Budget).filter(
            and_(
                Budget.user_id == user_id,
                Budget.period == period,
                Budget.category_id == category_id,
            )
        ).first()

    def list_by_user(
        self, user_id: int, limit: int = 100, offset: int = 0
    ) -> list[Budget]:
        """List budgets for user."""
        return (
            self.db.query(Budget)
            .filter(Budget.user_id == user_id)
            .order_by(desc(Budget.created_at))
            .limit(limit)
            .offset(offset)
            .all()
        )

    def list_by_user_and_period(self, user_id: int, period: str) -> list[Budget]:
        """List all budgets (general + category-specific) for a period."""
        return (
            self.db.query(Budget)
            .filter(and_(Budget.user_id == user_id, Budget.period == period))
            .all()
        )

    def update(self, budget: Budget) -> Budget:
        """Update budget."""
        self.db.merge(budget)
        self.db.commit()
        self.db.refresh(budget)
        return budget

    def delete(self, budget_id: int, user_id: int) -> bool:
        """Delete budget."""
        budget = self.get_by_id(budget_id, user_id)
        if not budget:
            return False
        self.db.delete(budget)
        self.db.commit()
        return True

    def count_by_user(self, user_id: int) -> int:
        """Count budgets for user."""
        return self.db.query(func.count(Budget.id)).filter(
            Budget.user_id == user_id
        ).scalar()


class BudgetAlertRepository:
    """Repository for BudgetAlert operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, alert: BudgetAlert) -> BudgetAlert:
        """Create a new budget alert."""
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def get_by_id(self, alert_id: int) -> Optional[BudgetAlert]:
        """Get alert by ID."""
        return self.db.query(BudgetAlert).filter(BudgetAlert.id == alert_id).first()

    def list_by_user(
        self, user_id: int, is_read: bool | None = None, limit: int = 100, offset: int = 0
    ) -> list[BudgetAlert]:
        """List alerts for user."""
        query = self.db.query(BudgetAlert).filter(BudgetAlert.user_id == user_id)
        if is_read is not None:
            query = query.filter(BudgetAlert.is_read == is_read)
        return query.order_by(desc(BudgetAlert.created_at)).limit(limit).offset(offset).all()

    def list_by_budget(self, budget_id: int) -> list[BudgetAlert]:
        """List alerts for a specific budget."""
        return (
            self.db.query(BudgetAlert)
            .filter(BudgetAlert.budget_id == budget_id)
            .order_by(desc(BudgetAlert.created_at))
            .all()
        )

    def update(self, alert: BudgetAlert) -> BudgetAlert:
        """Update alert."""
        self.db.merge(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def mark_as_read(self, alert_id: int) -> bool:
        """Mark alert as read."""
        alert = self.get_by_id(alert_id)
        if not alert:
            return False
        alert.is_read = True
        self.update(alert)
        return True

    def delete(self, alert_id: int) -> bool:
        """Delete alert."""
        alert = self.get_by_id(alert_id)
        if not alert:
            return False
        self.db.delete(alert)
        self.db.commit()
        return True

    def count_unread_by_user(self, user_id: int) -> int:
        """Count unread alerts for user."""
        return self.db.query(func.count(BudgetAlert.id)).filter(
            and_(BudgetAlert.user_id == user_id, BudgetAlert.is_read == False)
        ).scalar()


class BudgetHistoryRepository:
    """Repository for BudgetHistory operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, history: BudgetHistory) -> BudgetHistory:
        """Create a new budget history record."""
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history

    def get_by_id(self, history_id: int) -> Optional[BudgetHistory]:
        """Get history record by ID."""
        return (
            self.db.query(BudgetHistory)
            .filter(BudgetHistory.id == history_id)
            .first()
        )

    def get_by_month_year(
        self, user_id: int, month: int, year: int
    ) -> Optional[BudgetHistory]:
        """Get history for specific month/year."""
        return (
            self.db.query(BudgetHistory)
            .filter(
                and_(
                    BudgetHistory.user_id == user_id,
                    BudgetHistory.month == month,
                    BudgetHistory.year == year,
                )
            )
            .first()
        )

    def list_by_user(
        self, user_id: int, limit: int = 100, offset: int = 0
    ) -> list[BudgetHistory]:
        """List history for user."""
        return (
            self.db.query(BudgetHistory)
            .filter(BudgetHistory.user_id == user_id)
            .order_by(desc(BudgetHistory.created_at))
            .limit(limit)
            .offset(offset)
            .all()
        )

    def list_last_months(self, user_id: int, months: int) -> list[BudgetHistory]:
        """List history for last N months."""
        return (
            self.db.query(BudgetHistory)
            .filter(BudgetHistory.user_id == user_id)
            .order_by(desc(BudgetHistory.year), desc(BudgetHistory.month))
            .limit(months)
            .all()
        )

    def update(self, history: BudgetHistory) -> BudgetHistory:
        """Update history record."""
        self.db.merge(history)
        self.db.commit()
        self.db.refresh(history)
        return history

    def delete(self, history_id: int) -> bool:
        """Delete history record."""
        history = self.get_by_id(history_id)
        if not history:
            return False
        self.db.delete(history)
        self.db.commit()
        return True
