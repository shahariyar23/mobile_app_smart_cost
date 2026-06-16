from fastapi import APIRouter

from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as users_router
from app.api.v1.categories.router import router as categories_router
from app.api.v1.transactions.router import router as transactions_router
from app.api.v1.budgets.router import router as budgets_router
from app.api.v1.goals.router import router as goals_router
from app.api.v1.notifications.router import router as notifications_router
from app.api.v1.reports.router import router as reports_router
from app.api.v1.voice.router import router as voice_router
from app.api.v1.ai_insights.router import router as ai_insights_router

router = APIRouter(prefix="/api/v1")
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(categories_router)
router.include_router(transactions_router)
router.include_router(budgets_router)
router.include_router(goals_router)
router.include_router(notifications_router)
router.include_router(reports_router)
router.include_router(voice_router)
router.include_router(ai_insights_router)
