from pydantic import BaseModel, EmailStr
from typing import Optional


# ─────────────────────────────────────
#  AUTH
# ─────────────────────────────────────

class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str


# ─────────────────────────────────────
#  PROFILE
# ─────────────────────────────────────

class ProfileRequest(BaseModel):

    # Section 1 – Personal Info
    bio:           Optional[str]   = None
    phone:         Optional[str]   = None
    date_of_birth: Optional[str]   = None
    gender:        Optional[str]   = None
    location:      Optional[str]   = None
    website:       Optional[str]   = None
    linkedin:      Optional[str]   = None
    github:        Optional[str]   = None

    # Section 2 – Education
    education:       Optional[str]   = None
    college:         Optional[str]   = None
    branch:          Optional[str]   = None
    specialization:  Optional[str]   = None
    graduation_year: Optional[int]   = None
    cgpa:            Optional[float] = None
    backlogs:        Optional[int]   = None

    # Section 3 – Career Goals
    preferred_role:      Optional[str] = None
    experience_level:    Optional[str] = None
    job_type:            Optional[str] = None
    preferred_locations: Optional[str] = None
    availability:        Optional[str] = None
    expected_salary:     Optional[str] = None

    # Section 4 – Skills & Tech
    skills:         Optional[str] = None
    certifications: Optional[str] = None
    languages:      Optional[str] = None
    tools:          Optional[str] = None

    # Section 5 – Achievements & Extras
    achievements:       Optional[str] = None
    extracurriculars:   Optional[str] = None
    projects_count:     Optional[int] = None
    internships_count:  Optional[int] = None


class ProfileResponse(ProfileRequest):
    id:      int
    user_id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────
#  AI ASSISTANT
# ─────────────────────────────────────

class ChatMessage(BaseModel):
    """Single turn in a conversation (role: 'user' | 'assistant')."""
    role:    str
    content: str


class AIChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = []


class AISource(BaseModel):
    label: str
    url:   str


class AIChatResponse(BaseModel):
    answer:            str
    topic:             str
    confidence:        float
    sources:           list[AISource]
    is_career_related: bool
    ai_powered:        bool
    model:             Optional[str] = None
