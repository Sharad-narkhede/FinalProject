from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole

    class Config:
        from_attributes = True

