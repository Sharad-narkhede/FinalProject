from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.feedback import FeedbackAnswer, FeedbackResponse
from app.models.survey import SurveyAssignment, SurveyQuestion, SurveyTemplate
from app.schemas.feedback import FeedbackResponseOut, FeedbackSubmit


router = APIRouter(prefix="/feedback", tags=["feedback"])

analyzer = SentimentIntensityAnalyzer()


@router.post("/submit", response_model=FeedbackResponseOut)
def submit_feedback(payload: FeedbackSubmit, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tpl = db.get(SurveyTemplate, payload.template_id)
    assign = db.get(SurveyAssignment, payload.assignment_id)
    if not tpl or not assign:
        raise HTTPException(status_code=404, detail="Template or assignment not found")

    response = FeedbackResponse(
        template_id=payload.template_id,
        assignment_id=payload.assignment_id,
        target_id=payload.target_id,
        target_type=assign.target_type,
        user_id=user.id,
    )
    db.add(response)
    db.flush()

    text_corpus = []
    q_map = {q.id: q for q in db.query(SurveyQuestion).filter(SurveyQuestion.template_id == tpl.id).all()}
    for a in payload.answers:
        db.add(FeedbackAnswer(response_id=response.id, question_id=a.question_id, numeric_value=a.numeric_value, text_value=a.text_value))
        if a.text_value:
            text_corpus.append(a.text_value)

    sentiment_score = None
    if text_corpus:
        combined = "\n".join(text_corpus)
        sentiment_score = float(analyzer.polarity_scores(combined)["compound"])
        response.sentiment_score = sentiment_score

    db.commit()
    db.refresh(response)
    return response


@router.get("/summary/{assignment_id}")
def feedback_summary(assignment_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    assignment = db.get(SurveyAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    total = db.query(FeedbackResponse).filter(FeedbackResponse.assignment_id == assignment_id).count()
    if total < assignment.anonymity_min_responses:
        return {"responses": total, "message": "Not enough responses to display analytics"}

    avg_sentiment = db.query(FeedbackResponse).filter(FeedbackResponse.assignment_id == assignment_id).with_entities(
        FeedbackResponse.sentiment_score
    ).all()
    sentiments = [float(s[0]) for s in avg_sentiment if s[0] is not None]
    sentiment_avg = sum(sentiments) / len(sentiments) if sentiments else None

    return {"responses": total, "sentiment_avg": sentiment_avg}

