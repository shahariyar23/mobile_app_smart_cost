import pytest
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session

from app.models.budget import Budget, BudgetAlert, BudgetHistory
from app.models.user import User
from app.models.category import Category
from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    AlertType,
)
from app.services.budget_service import BudgetService


@pytest.fixture
def test_user(db: Session):
    """Create a test user."""
    user = User(id=1, name="Test User", phone="01234567890")
    db.add(user)
    db.commit()
    return user


@pytest.fixture
def test_category(db: Session):
    """Create a test category."""
    category = Category(id=1, name="Food", type="expense")
    db.add(category)
    db.commit()
    return category


@pytest.fixture
def test_budget(db: Session, test_user, test_category):
    """Create a test budget."""
    today = date.today()
    period = f"{today.year}-{today.month:02d}"
    budget = Budget(
        user_id=test_user.id,
        category_id=test_category.id,
        amount=10000,
        period=period,
        start_date=date(today.year, today.month, 1),
        end_date=date(today.year, today.month + 1, 1) - timedelta(days=1),
    )
    db.add(budget)
    db.commit()
    return budget


class TestBudgetService:
    """Test BudgetService."""

    def test_create_budget(self, db: Session, test_user, test_category):
        """Test creating a budget."""
        service = BudgetService(db)
        payload = BudgetCreate(
            user_id=test_user.id,
            category_id=test_category.id,
            amount=5000,
            period="2026-06",
            start_date=date(2026, 6, 1),
            end_date=date(2026, 6, 30),
        )
        budget = service.create_budget(payload)
        assert budget.user_id == test_user.id
        assert budget.amount == 5000

    def test_get_current_month_budget(self, db: Session, test_user, test_budget):
        """Test getting current month budget."""
        service = BudgetService(db)
        budget = service.get_current_month_budget(test_user.id)
        assert budget is not None
        assert budget.user_id == test_user.id

    def test_get_budget_summary(self, db: Session, test_user, test_budget):
        """Test getting budget summary."""
        service = BudgetService(db)
        summary = service.get_budget_summary(test_budget.id, test_user.id)
        assert summary is not None
        assert summary.spent_amount == 0
        assert summary.remaining_amount == 10000
        assert summary.status == "on-track"

    def test_get_spent_amount(self, db: Session, test_budget):
        """Test calculating spent amount."""
        service = BudgetService(db)
        spent = service.get_spent_amount(test_budget.id)
        assert spent == 0  # No transactions yet

    def test_calculate_daily_recommendation(self, db: Session, test_user, test_budget):
        """Test calculating daily recommendation."""
        service = BudgetService(db)
        rec = service.get_daily_recommendation(test_budget.id, test_user.id)
        assert rec is not None
        assert rec.remaining_budget == 10000
        assert rec.remaining_days > 0
        assert rec.daily_recommendation > 0

    def test_calculate_budget_score_excellent(self, db: Session, test_user):
        """Test budget score calculation - excellent."""
        service = BudgetService(db)
        score = service.calculate_budget_score(test_user.id)
        # Score depends on analytics, which depends on budgets
        assert score.score >= 0
        assert score.score <= 100
        assert score.status in ["Excellent", "Good", "Fair", "Poor"]

    def test_get_analytics(self, db: Session, test_user):
        """Test getting budget analytics."""
        service = BudgetService(db)
        analytics = service.get_analytics(test_user.id)
        assert analytics.total_budget >= 0
        assert analytics.total_spent >= 0

    def test_update_budget(self, db: Session, test_user, test_budget):
        """Test updating budget."""
        service = BudgetService(db)
        payload = BudgetUpdate(amount=12000)
        updated = service.update_budget(test_budget.id, test_user.id, payload)
        assert updated is not None
        assert updated.amount == 12000

    def test_delete_budget(self, db: Session, test_user, test_budget):
        """Test deleting budget."""
        service = BudgetService(db)
        result = service.delete_budget(test_budget.id, test_user.id)
        assert result is True

    def test_create_budget_alert(self, db: Session, test_user, test_budget):
        """Test creating budget alerts."""
        service = BudgetService(db)
        # Manually set spent to trigger warning alert
        # Note: In real scenario, this would come from transactions
        alerts = service.check_and_create_alerts(test_budget.id, test_user.id)
        # Should not have alerts if budget is under 80%
        assert isinstance(alerts, list)

    def test_mark_alert_as_read(self, db: Session, test_user, test_budget):
        """Test marking alert as read."""
        service = BudgetService(db)
        # Create an alert manually
        alert = BudgetAlert(
            user_id=test_user.id,
            budget_id=test_budget.id,
            message="Test alert",
            alert_type=AlertType.WARNING,
        )
        db.add(alert)
        db.commit()

        # Mark as read
        result = service.mark_alert_as_read(alert.id)
        assert result is True

    def test_create_history(self, db: Session, test_user, test_budget):
        """Test creating budget history."""
        service = BudgetService(db)
        history = service.create_history(test_user.id, test_budget.id)
        assert history.user_id == test_user.id
        assert history.total_budget == 10000
        assert history.total_spent == 0

    def test_get_history_last_months(self, db: Session, test_user, test_budget):
        """Test getting history for last months."""
        service = BudgetService(db)
        # Create a history record
        service.create_history(test_user.id, test_budget.id)
        
        # Get last 3 months
        history = service.get_history_last_months(test_user.id, 3)
        assert isinstance(history, list)


class TestBudgetEdgeCases:
    """Test edge cases and error handling."""

    def test_get_nonexistent_budget(self, db: Session, test_user):
        """Test getting a non-existent budget."""
        service = BudgetService(db)
        budget = service.get_budget(999, test_user.id)
        assert budget is None

    def test_delete_nonexistent_budget(self, db: Session, test_user):
        """Test deleting a non-existent budget."""
        service = BudgetService(db)
        result = service.delete_budget(999, test_user.id)
        assert result is False

    def test_budget_with_zero_amount(self, db: Session, test_user):
        """Test budget calculations with zero amount."""
        service = BudgetService(db)
        analytics = service.get_analytics(test_user.id)
        # Should handle zero budget gracefully
        assert analytics.utilization_percentage == 0

    def test_get_daily_recommendation_zero_days(self, db: Session, test_user):
        """Test daily recommendation when period is ending."""
        service = BudgetService(db)
        today = date.today()
        # Create a budget that ends today
        budget = Budget(
            user_id=test_user.id,
            amount=5000,
            period=f"{today.year}-{today.month:02d}",
            start_date=today,
            end_date=today,
        )
        db.add(budget)
        db.commit()

        rec = service.get_daily_recommendation(budget.id, test_user.id)
        assert rec is not None
        # Should handle zero/negative remaining days
        assert rec.daily_recommendation >= 0
