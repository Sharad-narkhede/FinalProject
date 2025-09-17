from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.department import Department
from app.models.facility import Facility
from app.models.survey import SurveyTemplate, SurveyQuestion, SurveyAssignment
from app.schemas.department import DepartmentCreate, DepartmentOut
from app.schemas.facility import FacilityCreate, FacilityOut
from app.schemas.survey import (
    SurveyTemplateCreate,
    SurveyTemplateOut,
    SurveyAssignmentCreate,
    SurveyAssignmentOut,
)
from app.schemas.survey import SurveyTemplateDetailOut, SurveyAssignmentWithTemplateOut


router = APIRouter(prefix="/crud", tags=["crud"])


@router.post("/departments", response_model=DepartmentOut)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    dep = Department(name=payload.name)
    db.add(dep)
    db.commit()
    db.refresh(dep)
    return dep


@router.get("/departments", response_model=List[DepartmentOut])
def list_departments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Department).order_by(Department.name.asc()).all()


@router.post("/facilities", response_model=FacilityOut)
def create_facility(payload: FacilityCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    fac = Facility(name=payload.name, type=payload.type, location=payload.location)
    db.add(fac)
    db.commit()
    db.refresh(fac)
    return fac


@router.get("/facilities", response_model=List[FacilityOut])
def list_facilities(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Facility).order_by(Facility.name.asc()).all()


@router.post("/templates", response_model=SurveyTemplateOut)
def create_template(payload: SurveyTemplateCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    exists = db.query(SurveyTemplate).filter(SurveyTemplate.name == payload.name).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Template name exists")
    tpl = SurveyTemplate(name=payload.name, target_type=payload.target_type)
    db.add(tpl)
    db.flush()
    for q in payload.questions:
        db.add(SurveyQuestion(template_id=tpl.id, text=q.text, type=q.type, options=q.options, weight=q.weight))
    db.commit()
    db.refresh(tpl)
    return tpl


@router.get("/templates", response_model=List[SurveyTemplateOut])
def list_templates(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(SurveyTemplate).all()


@router.post("/assignments", response_model=SurveyAssignmentOut)
def create_assignment(payload: SurveyAssignmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tpl = db.get(SurveyTemplate, payload.template_id)
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found")
    assign = SurveyAssignment(
        template_id=payload.template_id,
        target_id=payload.target_id,
        target_type=payload.target_type,
        start_at=payload.start_at,
        end_at=payload.end_at,
        anonymity_min_responses=payload.anonymity_min_responses,
    )
    db.add(assign)
    db.commit()
    db.refresh(assign)
    return assign


@router.get("/assignments", response_model=List[SurveyAssignmentOut])
def list_assignments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(SurveyAssignment).all()


@router.get("/templates/{template_id}", response_model=SurveyTemplateDetailOut)
def get_template(template_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    tpl = db.get(SurveyTemplate, template_id)
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found")
    # Eager load questions by accessing property
    tpl.questions  # noqa
    return tpl


@router.get("/assignments/active", response_model=List[SurveyAssignmentWithTemplateOut])
def list_active_assignments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    assigns = db.query(SurveyAssignment).filter(SurveyAssignment.is_active.is_(True)).all()
    for a in assigns:
        a.template  # ensure loaded
    return assigns

