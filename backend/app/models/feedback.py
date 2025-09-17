from datetime import datetime
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.enums import TargetType


class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("survey_templates.id"), nullable=False, index=True)
    assignment_id = Column(Integer, ForeignKey("survey_assignments.id"), nullable=False, index=True)
    target_id = Column(Integer, nullable=False, index=True)
    target_type = Column(Enum(TargetType), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    sentiment_score = Column(Numeric(5, 4), nullable=True)

    template = relationship("SurveyTemplate")
    assignment = relationship("SurveyAssignment")
    answers = relationship("FeedbackAnswer", back_populates="response", cascade="all, delete-orphan")


class FeedbackAnswer(Base):
    __tablename__ = "feedback_answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("feedback_responses.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("survey_questions.id"), nullable=False)
    numeric_value = Column(Integer, nullable=True)
    text_value = Column(String(5000), nullable=True)

    response = relationship("FeedbackResponse", back_populates="answers")

