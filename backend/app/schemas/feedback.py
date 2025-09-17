from typing import List, Optional
from pydantic import BaseModel


class FeedbackAnswerIn(BaseModel):
    question_id: int
    numeric_value: Optional[int] = None
    text_value: Optional[str] = None


class FeedbackSubmit(BaseModel):
    assignment_id: int
    template_id: int
    target_id: int
    answers: List[FeedbackAnswerIn]


class FeedbackResponseOut(BaseModel):
    id: int
    sentiment_score: float | None = None

    class Config:
        from_attributes = True

