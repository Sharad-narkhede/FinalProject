from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy import JSON
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.enums import QuestionType, TargetType


class SurveyTemplate(Base):
    __tablename__ = "survey_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    target_type = Column(Enum(TargetType), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    questions = relationship("SurveyQuestion", back_populates="template", cascade="all, delete-orphan")


class SurveyQuestion(Base):
    __tablename__ = "survey_questions"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("survey_templates.id"), nullable=False, index=True)
    text = Column(String(1000), nullable=False)
    type = Column(Enum(QuestionType), nullable=False)
    options = Column(JSON, nullable=True)
    weight = Column(Integer, nullable=True)

    template = relationship("SurveyTemplate", back_populates="questions")


class SurveyAssignment(Base):
    __tablename__ = "survey_assignments"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("survey_templates.id"), nullable=False, index=True)
    target_id = Column(Integer, nullable=False, index=True)
    target_type = Column(Enum(TargetType), nullable=False)
    start_at = Column(DateTime, nullable=True)
    end_at = Column(DateTime, nullable=True)
    anonymity_min_responses = Column(Integer, nullable=False, default=5)
    is_active = Column(Boolean, nullable=False, default=True)

    template = relationship("SurveyTemplate")

