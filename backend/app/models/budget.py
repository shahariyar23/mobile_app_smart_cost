from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Budget(Base):
    """Monthly or category-specific budget for a user."""
    __tablename__ = "budgets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    period: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g., "2026-01"
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    alerts: Mapped[list["BudgetAlert"]] = relationship("BudgetAlert", back_populates="budget")
    history: Mapped[list["BudgetHistory"]] = relationship("BudgetHistory", back_populates="budget")


class BudgetAlert(Base):
    """Alerts for budget thresholds and overages."""
    __tablename__ = "budget_alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    budget_id: Mapped[int] = mapped_column(ForeignKey("budgets.id"), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "warning", "exceeded", "overspent"
    is_read: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    budget: Mapped["Budget"] = relationship("Budget", back_populates="alerts")


class BudgetHistory(Base):
    """Monthly snapshots of budget data for analytics."""
    __tablename__ = "budget_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    budget_id: Mapped[int] = mapped_column(ForeignKey("budgets.id"), nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-12
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    total_budget: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    total_spent: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    remaining_budget: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    utilization_percentage: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0)  # 0-100+
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    budget: Mapped["Budget"] = relationship("Budget", back_populates="history")
