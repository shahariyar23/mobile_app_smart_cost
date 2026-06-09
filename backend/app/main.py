from fastapi import FastAPI

from app.api.v1 import router as api_v1_router
from app.database import Base, engine

app = FastAPI(
    title="Smart Cost API",
    version="1.0.0",
    description="Backend API for Smart Cost"
)

app.include_router(api_v1_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def health_check() -> dict:
    return {"message": "Smart Cost backend is running"}