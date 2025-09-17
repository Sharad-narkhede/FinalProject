from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.models.enums import QuestionType, TargetType


class SurveyQuestionCreate(BaseModel):
    text: str
    type: QuestionType
    options: Optional[list] = None
    weight: Optional[int] = None


class SurveyTemplateCreate(BaseModel):
    name: str
    target_type: TargetType
    questions: List[SurveyQuestionCreate]


class SurveyTemplateOut(BaseModel):
    id: int
    name: str
    target_type: TargetType

    class Config:
        from_attributes = True


class SurveyQuestionOut(BaseModel):
    id: int
    text: str
    type: QuestionType
    options: list | None = None
    weight: int | None = None

    class Config:
        from_attributes = True


class SurveyTemplateDetailOut(SurveyTemplateOut):
    questions: list[SurveyQuestionOut]


class SurveyAssignmentCreate(BaseModel):
    template_id: int
    target_id: int
    target_type: TargetType
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    anonymity_min_responses: int = 5


class SurveyAssignmentOut(BaseModel):
    id: int
    template_id: int
    target_id: int
    target_type: TargetType
    anonymity_min_responses: int

    class Config:
        from_attributes = True

class SurveyAssignmentWithTemplateOut(BaseModel):
    id: int
    template_id: int
    target_id: int
    target_type: TargetType
    anonymity_min_responses: int
    template: SurveyTemplateOut

    class Config:
        from_attributes = True

