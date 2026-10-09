from sqlalchemy import (
    Column, Integer, String, DateTime,
    Float, Text, ForeignKey
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    resumes = relationship(
    "Resume",
    back_populates="user",
    cascade="all, delete-orphan"
)

    profile = relationship(
        "StudentProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete",
    )


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id      = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # ── SECTION 1: Personal Info ──────────────────────────────
    bio          = Column(Text,         nullable=True)   # short intro / summary
    phone        = Column(String(20),   nullable=True)
    date_of_birth= Column(String(20),   nullable=True)   # stored as string "YYYY-MM-DD"
    gender       = Column(String(20),   nullable=True)
    location     = Column(String(150),  nullable=True)   # city, state
    website      = Column(String(300),  nullable=True)
    linkedin     = Column(String(300),  nullable=True)
    github       = Column(String(300),  nullable=True)

    # ── SECTION 2: Education ──────────────────────────────────
    education        = Column(String(200), nullable=True)   # degree level
    college          = Column(String(300), nullable=True)   # institution name
    branch           = Column(String(150), nullable=True)   # department / major
    specialization   = Column(String(150), nullable=True)   # optional sub-specialization
    graduation_year  = Column(Integer,     nullable=True)
    cgpa             = Column(Float,       nullable=True)   # 0.0 – 10.0
    backlogs         = Column(Integer,     nullable=True)   # number of active backlogs

    # ── SECTION 3: Career Goals ──────────────────────────────
    preferred_role       = Column(String(150), nullable=True)
    experience_level     = Column(String(50),  nullable=True)   # fresher/intern/1-2yr/3+yr
    job_type             = Column(String(100), nullable=True)   # full-time/part-time/internship/remote
    preferred_locations  = Column(Text,        nullable=True)   # comma-sep cities
    availability         = Column(String(50),  nullable=True)   # immediate/1 month/2 months/3 months
    expected_salary      = Column(String(100), nullable=True)   # e.g. "6-8 LPA"

    # ── SECTION 4: Skills & Tech ─────────────────────────────
    skills           = Column(Text, nullable=True)   # comma-sep skill tags
    certifications   = Column(Text, nullable=True)   # comma-sep cert names
    languages        = Column(Text, nullable=True)   # comma-sep programming languages
    tools            = Column(Text, nullable=True)   # comma-sep tools/software

    # ── SECTION 5: Achievements & Extras ─────────────────────
    achievements       = Column(Text, nullable=True)   # free text
    extracurriculars   = Column(Text, nullable=True)   # free text
    projects_count     = Column(Integer, nullable=True)
    internships_count  = Column(Integer, nullable=True)

    # ── META ─────────────────────────────────────────────────
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="profile")
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    file_type = Column(String(50), nullable=False)

    file_size = Column(Integer, nullable=False)

    extracted_text = Column(Text, nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="Pending Analysis"
    )

    resume_score = Column(Integer, nullable=True)

    analysis = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="resumes")