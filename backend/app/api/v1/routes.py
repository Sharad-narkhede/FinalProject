from fastapi import APIRouter
from app.api.v1 import auth, crud, feedback


router = APIRouter()


@router.get("/health", tags=["health"]) 
def health() -> dict:
    return {"status": "ok"}

router.include_router(auth.router)
router.include_router(crud.router)
router.include_router(feedback.router)

