import sys
from pathlib import Path

BACKEND_DIR = str(Path(__file__).resolve().parent)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from database import engine, get_db, Base
import os
import sys
import json
import shutil
from pathlib import Path

# Ensure local backend modules can be imported when Vercel loads backend/main.py.
BACKEND_DIR = str(Path(__file__).resolve().parent)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, StudentProfile, Resume
from resume_analyzer import analyze_resume
from schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    ProfileRequest,
    ProfileResponse,
    AIChatRequest,
    AIChatResponse,
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from ai_assistant import chat as ai_chat, KB, KB_CATEGORIES, KB_TOPICS
# Store uploads in Vercel's temporary writable directory
RESUME_UPLOAD_DIR = Path("/tmp/uploads/resumes")
RESUME_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {

    ".pdf",

    ".docx"

}

MAX_RESUME_SIZE = 10 * 1024 * 1024

# Create / migrate tables

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Career & Placement Assistant API")

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://aven-weg.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── HEALTH ────────────────────────────────────────────────────

@app.get("/")

def root():

    return {"message": "AI Career Assistant API is running"}

# ── REGISTER ──────────────────────────────────────────────────

@app.post("/register")

def register(request: RegisterRequest, db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == request.email).first():

        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(

        name=request.name,

        email=request.email,

        password_hash=hash_password(request.password),

    )

    db.add(user)

    db.commit()

    db.refresh(user)

    db.add(StudentProfile(user_id=user.id))

    db.commit()

    return {"message": "Account created successfully", "user_id": user.id}

# ── LOGIN ─────────────────────────────────────────────────────

@app.post("/login", response_model=TokenResponse)

def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.password_hash):

        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {

        "access_token": create_access_token({"sub": str(user.id)}),

        "token_type": "bearer",

    }

# ── CURRENT USER ──────────────────────────────────────────────

@app.get("/me")

def get_me(current_user: User = Depends(get_current_user)):

    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}

# ── GET PROFILE ───────────────────────────────────────────────

@app.get("/profile", response_model=ProfileResponse)

def get_profile(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db),

):

    profile = db.query(StudentProfile).filter(

        StudentProfile.user_id == current_user.id

    ).first()

    if not profile:

        raise HTTPException(status_code=404, detail="Profile not found")

    return profile

# ── UPDATE PROFILE ────────────────────────────────────────────

@app.put("/profile", response_model=ProfileResponse)

def update_profile(

    request: ProfileRequest,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db),

):

    profile = db.query(StudentProfile).filter(

        StudentProfile.user_id == current_user.id

    ).first()

    if not profile:

        profile = StudentProfile(user_id=current_user.id)

        db.add(profile)

    # Apply every field from the request

    for field, value in request.model_dump(exclude_unset=False).items():

        setattr(profile, field, value)

    db.commit()

    db.refresh(profile)

    return profile

def extract_pdf_text(file_path: str) -> str:

    import fitz

    text = []

    document = fitz.open(file_path)

    for page in document:

        text.append(page.get_text())

    document.close()

    return "\n".join(text).strip()

def extract_docx_text(file_path: str) -> str:

    from docx import Document

    document = Document(file_path)

    paragraphs = [

        paragraph.text

        for paragraph in document.paragraphs

        if paragraph.text.strip()

    ]

    return "\n".join(paragraphs).strip()

def extract_resume_text(

    file_path: str,

    extension: str

) -> str:

    if extension == ".pdf":

        return extract_pdf_text(file_path)

    if extension == ".docx":

        return extract_docx_text(file_path)

    raise ValueError("Unsupported resume format")

@app.post("/resume/upload")

async def upload_resume(

    file: UploadFile = File(...),

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # -----------------------------------------

    # Validate filename

    # -----------------------------------------

    if not file.filename:

        raise HTTPException(

            status_code=400,

            detail="Please select a resume."

        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(

            status_code=400,

            detail="Only PDF and DOCX resume files are allowed."

        )

    # -----------------------------------------

    # Read file

    # -----------------------------------------

    contents = await file.read()

    file_size = len(contents)

    if file_size > MAX_RESUME_SIZE:

        raise HTTPException(

            status_code=400,

            detail="Resume size must be less than 10 MB."

        )

    if file_size == 0:

        raise HTTPException(

            status_code=400,

            detail="The uploaded file is empty."

        )

    # -----------------------------------------

    # Create user directory

    # -----------------------------------------

    user_dir = RESUME_UPLOAD_DIR / str(current_user.id)

    user_dir.mkdir(

        parents=True,

        exist_ok=True

    )

    # -----------------------------------------

    # Safe filename

    # -----------------------------------------

    safe_filename = (

        f"resume_{current_user.id}{extension}"

    )

    file_path = user_dir / safe_filename

    # -----------------------------------------

    # Save file

    # -----------------------------------------

    with open(file_path, "wb") as buffer:

        buffer.write(contents)

    # -----------------------------------------

    # Extract text

    # -----------------------------------------

    try:

        extracted_text = extract_resume_text(

            str(file_path),

            extension

        )

    except Exception as e:

        if file_path.exists():

            file_path.unlink()

        raise HTTPException(

            status_code=400,

            detail=f"Could not read the resume: {str(e)}"

        )

    if len(extracted_text.strip()) < 50:

        if file_path.exists():

            file_path.unlink()

        raise HTTPException(

            status_code=400,

            detail=(

                "This file does not contain enough readable resume text. "

                "Please upload a text-based PDF or DOCX resume."

            )

        )

    # -----------------------------------------

    # Remove previous resume

    # -----------------------------------------

    old_resume = (

        db.query(Resume)

        .filter(

            Resume.user_id == current_user.id

        )

        .first()

    )

    if old_resume:

        if old_resume.file_path:

            old_file = Path(old_resume.file_path)

            if old_file.exists():

                old_file.unlink()

        db.delete(old_resume)

        db.commit()

    # -----------------------------------------

    # Create database record

    # -----------------------------------------

    resume = Resume(

        user_id=current_user.id,

        filename=file.filename,

        file_path=str(file_path),

        file_type=extension,

        file_size=file_size,

        extracted_text=extracted_text,

        status="Pending Analysis"

    )

    db.add(resume)

    db.commit()

    db.refresh(resume)

    return {

        "message": "Resume uploaded successfully",

        "resume_id": resume.id,

        "filename": resume.filename,

        "size": resume.file_size,

        "status": resume.status

    }

@app.post("/resume/{resume_id}/analyze")

def analyze_uploaded_resume(

    resume_id: int,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    resume = (

        db.query(Resume)

        .filter(

            Resume.id == resume_id,

            Resume.user_id == current_user.id

        )

        .first()

    )

    if not resume:

        raise HTTPException(

            status_code=404,

            detail="Resume not found."

        )

    if not resume.extracted_text:

        raise HTTPException(

            status_code=400,

            detail="No resume text available for analysis."

        )

    # Analyze resume

    result = analyze_resume(

        resume.extracted_text

    )

    resume.resume_score = result["score"]

    resume.status = "Analysis Complete"

    resume.analysis = json.dumps(

        result

    )

    db.commit()

    db.refresh(resume)

    return {

        "resume_id": resume.id,

        "filename": resume.filename,

        "status": resume.status,

        "analysis": result

    }

@app.get("/resume")

def get_current_resume(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    resume = (

        db.query(Resume)

        .filter(

            Resume.user_id == current_user.id

        )

        .first()

    )

    if not resume:

        return {

            "resume": None

        }

    analysis = None

    if resume.analysis:

        try:

            analysis = json.loads(

                resume.analysis

            )

        except Exception:

            analysis = None

    return {

        "resume": {

            "id": resume.id,

            "filename": resume.filename,

            "file_type": resume.file_type,

            "file_size": resume.file_size,

            "status": resume.status,

            "resume_score": resume.resume_score,

            "created_at": resume.created_at,

            "analysis": analysis

        }

    }

@app.delete("/resume/{resume_id}")

def delete_resume(

    resume_id: int,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    resume = (

        db.query(Resume)

        .filter(

            Resume.id == resume_id,

            Resume.user_id == current_user.id

        )

        .first()

    )

    if not resume:

        raise HTTPException(

            status_code=404,

            detail="Resume not found."

        )

    if resume.file_path:

        file_path = Path(

            resume.file_path

        )

        if file_path.exists():

            file_path.unlink()

    db.delete(resume)

    db.commit()

    return {

        "message": "Resume deleted successfully"

    }

# ── AI ASSISTANT — HEALTH ─────────────────────────────────────

@app.get("/ai/health")

def ai_health():

    """

    Check whether Ollama is reachable.

    Returns { "ollama_available": bool, "model": str }

    """

    import urllib.request, urllib.error, os

    ollama_url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")

    # Use the tags endpoint for a lightweight check

    tags_url = ollama_url.replace("/api/generate", "/api/tags")

    try:

        with urllib.request.urlopen(tags_url, timeout=3):

            return {

                "ollama_available": True,

                "model": os.getenv("OLLAMA_MODEL", "llama3.2"),

            }

    except Exception:

        return {

            "ollama_available": False,

            "model": os.getenv("OLLAMA_MODEL", "llama3.2"),

        }

# ── AI ASSISTANT — CHAT ───────────────────────────────────────

@app.post("/ai/chat", response_model=AIChatResponse)

def ai_chat_endpoint(

    request: AIChatRequest,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db),

):

    """

    Send a message to the career AI assistant.

    - Injects the user's profile as context.

    - Enforces career-domain guard (rejects off-topic questions).

    - Falls back to vector KB when Ollama is unavailable.

    """

    # Build user context from profile

    profile = (

        db.query(StudentProfile)

        .filter(StudentProfile.user_id == current_user.id)

        .first()

    )

    user_context = {"name": current_user.name}

    if profile:

        user_context.update({

            "education":        profile.education,

            "branch":           profile.branch,

            "graduation_year":  profile.graduation_year,

            "preferred_role":   profile.preferred_role,

            "experience_level": profile.experience_level,

            "skills":           profile.skills,

            "location":         profile.location,

        })

    # Convert history to plain dicts

    history = [

        {"role": m.role, "content": m.content}

        for m in (request.history or [])

    ]

    result = ai_chat(

        message=request.message,

        history=history,

        user_context=user_context,

    )

    return {

        "answer":            result["answer"],

        "topic":             result["topic"],

        "confidence":        result["confidence"],

        "sources":           result.get("sources", []),

        "is_career_related": result["is_career_related"],

        "ai_powered":        result["ai_powered"],

        "model":             result.get("model"),

    }

# ── AI KNOWLEDGE BASE — FULL EXPORT ──────────────────────────

@app.get("/ai/knowledge-base")

def get_knowledge_base():

    """

    Returns the complete AI knowledge base as structured JSON.

    Includes all 30 topics across 6 categories with answers and sources.

    This endpoint also powers the PDF export script.

    """

    return {

        "total_topics":    len(KB),

        "categories":      KB_CATEGORIES,

        "topics_index":    KB_TOPICS,

        "knowledge_base": [

            {

                "topic":    entry["topic"],

                "category": entry["category"],

                "keywords": entry["keywords"],

                "answer":   entry["answer"],

                "sources":  entry["sources"],

            }

            for entry in KB

        ],

    }
