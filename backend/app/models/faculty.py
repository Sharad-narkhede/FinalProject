from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base


class Faculty(Base):
    __tablename__ = "faculties"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    user = relationship("User")
    department = relationship("Department", back_populates="faculties")

