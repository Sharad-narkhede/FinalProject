from sqlalchemy.orm import Session
from app.models.department import Department
from app.models.enums import FacilityType, UserRole
from app.models.facility import Facility
from app.models.user import User
from app.core.security import hash_password
from app.models.survey import SurveyTemplate, SurveyQuestion, SurveyAssignment


def seed(db: Session) -> None:
    if not db.query(Department).count():
        db.add_all([Department(name="Computer Science"), Department(name="Mechanical"), Department(name="Electrical")])
    if not db.query(Facility).count():
        db.add_all([
            Facility(name="Main Library", type=FacilityType.library, location="Building A"),
            Facility(name="Lab 101", type=FacilityType.laboratory, location="Block C"),
        ])
    if not db.query(User).filter(User.email == "admin@example.com").first():
        db.add(User(email="admin@example.com", full_name="Admin User", hashed_password=hash_password("admin123"), role=UserRole.admin))
    db.commit()

    # Seed a template and an active assignment for quick testing
    tpl = db.query(SurveyTemplate).filter(SurveyTemplate.name == "Quick Faculty Feedback").first()
    if not tpl:
        tpl = SurveyTemplate(name="Quick Faculty Feedback", target_type="faculty")
        db.add(tpl)
        db.flush()
        db.add_all([
            SurveyQuestion(template_id=tpl.id, text="Clarity of instruction", type="likert"),
            SurveyQuestion(template_id=tpl.id, text="Comments", type="text"),
        ])
        db.commit()

    if not db.query(SurveyAssignment).filter(SurveyAssignment.template_id == tpl.id).first():
        db.add(SurveyAssignment(template_id=tpl.id, target_id=1, target_type="faculty", anonymity_min_responses=1, is_active=True))
        db.commit()

