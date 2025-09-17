from pydantic import BaseModel
from app.models.enums import FacilityType


class FacilityCreate(BaseModel):
    name: str
    type: FacilityType
    location: str | None = None


class FacilityOut(BaseModel):
    id: int
    name: str
    type: FacilityType
    location: str | None = None

    class Config:
        from_attributes = True

