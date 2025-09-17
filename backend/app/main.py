from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import router as api_v1_router
from app.core.config import get_settings
from app.db.session import engine, SessionLocal
from app.models import Base  # noqa: F401
from app.seed import seed


settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/")
def root() -> dict:
    return {"message": "Smart Feedback API", "version": "v1"}


@app.on_event("startup")
def on_startup() -> None:
    # Ensure tables exist for a smooth first run (use Alembic for production)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed(db)

