import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.db.session import get_db
from app.models.feedback import FeedbackAnswer, FeedbackResponse
from app.models.survey import SurveyAssignment, SurveyQuestion


router = APIRouter(prefix="/analytics", tags=["analytics"]) 


@router.get("/per_question/{assignment_id}")
def per_question(assignment_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    assignment = db.get(SurveyAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    # Aggregate numeric answers by question
    rows = (
        db.query(
            FeedbackAnswer.question_id,
            func.avg(FeedbackAnswer.numeric_value).label("avg"),
            func.count(FeedbackAnswer.id).label("count"),
        )
        .join(FeedbackResponse, FeedbackResponse.id == FeedbackAnswer.response_id)
        .filter(FeedbackResponse.assignment_id == assignment_id)
        .group_by(FeedbackAnswer.question_id)
        .all()
    )
    out = []
    for qid, avg, count in rows:
        q = db.get(SurveyQuestion, qid)
        out.append({"question_id": qid, "text": q.text if q else None, "avg": float(avg) if avg is not None else None, "count": int(count)})
    return out


@router.get("/export/{assignment_id}")
def export_csv(assignment_id: int, db: Session = Depends(get_db), user=Depends(require_admin)):
    assignment = db.get(SurveyAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    # Flatten answers per response
    rows = (
        db.query(
            FeedbackResponse.id.label("response_id"),
            FeedbackResponse.user_id,
            FeedbackAnswer.question_id,
            FeedbackAnswer.numeric_value,
            FeedbackAnswer.text_value,
        )
        .join(FeedbackAnswer, FeedbackAnswer.response_id == FeedbackResponse.id)
        .filter(FeedbackResponse.assignment_id == assignment_id)
        .order_by(FeedbackResponse.id.asc())
        .all()
    )
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["response_id", "user_id", "question_id", "numeric_value", "text_value"])
    for r in rows:
        writer.writerow([r.response_id, r.user_id, r.question_id, r.numeric_value or "", (r.text_value or "").replace("\n", " ")])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=assignment_{assignment_id}.csv"})

