from sqlalchemy.orm import Session
from app.models.department import Department
from app.models.enums import FacilityType, UserRole
from app.models.facility import Facility
from app.models.user import User
from app.core.security import hash_password


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

