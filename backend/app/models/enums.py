import enum


class UserRole(str, enum.Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"


class FacilityType(str, enum.Enum):
    classroom = "classroom"
    laboratory = "laboratory"
    library = "library"
    hostel = "hostel"


class QuestionType(str, enum.Enum):
    likert = "likert"
    text = "text"
    mcq = "mcq"


class TargetType(str, enum.Enum):
    faculty = "faculty"
    facility = "facility"

