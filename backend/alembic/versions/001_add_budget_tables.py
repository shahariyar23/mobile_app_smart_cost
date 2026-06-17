"""Add BudgetAlert and BudgetHistory tables

Revision ID: 001_add_budget_tables
Revises: 
Create Date: 2026-06-18 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_add_budget_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create budget_alerts table
    op.create_table(
        'budget_alerts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('budget_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.String(255), nullable=False),
        sa.Column('alert_type', sa.String(50), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='False'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['budget_id'], ['budgets.id'], ),
    )

    # Create budget_history table
    op.create_table(
        'budget_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('budget_id', sa.Integer(), nullable=False),
        sa.Column('month', sa.Integer(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('total_budget', sa.Numeric(12, 2), nullable=False),
        sa.Column('total_spent', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('remaining_budget', sa.Numeric(12, 2), nullable=False),
        sa.Column('utilization_percentage', sa.Numeric(5, 2), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['budget_id'], ['budgets.id'], ),
    )

    # Create indices
    op.create_index(op.f('ix_budget_alerts_user_id'), 'budget_alerts', ['user_id'])
    op.create_index(op.f('ix_budget_alerts_budget_id'), 'budget_alerts', ['budget_id'])
    op.create_index(op.f('ix_budget_history_user_id'), 'budget_history', ['user_id'])
    op.create_index(op.f('ix_budget_history_budget_id'), 'budget_history', ['budget_id'])


def downgrade() -> None:
    op.drop_index(op.f('ix_budget_history_budget_id'), table_name='budget_history')
    op.drop_index(op.f('ix_budget_history_user_id'), table_name='budget_history')
    op.drop_index(op.f('ix_budget_alerts_budget_id'), table_name='budget_alerts')
    op.drop_index(op.f('ix_budget_alerts_user_id'), table_name='budget_alerts')
    op.drop_table('budget_history')
    op.drop_table('budget_alerts')
