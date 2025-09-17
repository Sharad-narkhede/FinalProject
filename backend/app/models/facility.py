from sqlalchemy import Column, Enum, Integer, String
from app.models.base import Base
from app.models.enums import FacilityType


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(Enum(FacilityType), nullable=False)
    location = Column(String(255), nullable=True)

