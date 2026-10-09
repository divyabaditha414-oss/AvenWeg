import json
import os
import re
import urllib.request
import urllib.error
from typing import Dict, List, Any
from dotenv import load_dotenv

load_dotenv()


# ============================================================
# CONFIGURATION
# ============================================================

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://127.0.0.1:11434/api/generate"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "llama3.2"
)


# ============================================================
# BASIC FALLBACK ANALYZER
# ============================================================

def basic_analyzer(text: str) -> Dict[str, Any]:
    """
    Fallback analyzer used only when the local AI model
    is unavailable or returns invalid data.

    This is not the primary AI analyzer.
    """

    text = text.strip()

    if not text:
        return {
            "score": 0,
            "ats_score": 0,
            "summary": "No readable text was found in the resume.",
            "strengths": [],
            "weaknesses": [
                "The uploaded document does not contain readable text."
            ],
            "recommendations": [
                "Upload a text-based PDF or DOCX resume."
            ],
            "missing_sections": [],
            "ats_suggestions": [
                "Use a text-based resume rather than a scanned image."
            ],
            "bullet_suggestions": [],
            "keyword_suggestions": [],
            "section_suggestions": {},
            "tips": [
                "Upload a text-based PDF or DOCX resume."
            ],
            "sections": {},
            "word_count": 0,
            "ai_powered": False
        }

    text_lower = text.lower()

    word_count = len(text.split())

    # --------------------------------------------------------
    # Detect sections
    # --------------------------------------------------------

    sections_detected = {
        "contact": any(
            word in text_lower
            for word in [
                "@",
                "phone",
                "mobile",
                "linkedin",
                "github"
            ]
        ),

        "education": any(
            word in text_lower
            for word in [
                "education",
                "b.tech",
                "bachelor",
                "degree",
                "college",
                "university",
                "school"
            ]
        ),

        "skills": any(
            word in text_lower
            for word in [
                "skills",
                "technical skills",
                "technologies"
            ]
        ),

        "projects": any(
            word in text_lower
            for word in [
                "projects",
                "project"
            ]
        ),

        "experience": any(
            word in text_lower
            for word in [
                "experience",
                "internship",
                "intern",
                "work experience"
            ]
        ),

        "certifications": any(
            word in text_lower
            for word in [
                "certifications",
                "certification",
                "certificate"
            ]
        ),

        "achievements": any(
            word in text_lower
            for word in [
                "achievements",
                "achievement",
                "awards"
            ]
        ),

        "summary": any(
            word in text_lower
            for word in [
                "summary",
                "objective",
                "profile"
            ]
        )
    }

    # --------------------------------------------------------
    # Resume score
    # --------------------------------------------------------

    score = 0

    if sections_detected["contact"]:
        score += 10

    if sections_detected["education"]:
        score += 15

    if sections_detected["skills"]:
        score += 15

    if sections_detected["projects"]:
        score += 20

    if sections_detected["experience"]:
        score += 15

    if sections_detected["certifications"]:
        score += 10

    if sections_detected["achievements"]:
        score += 10

    if 250 <= word_count <= 900:
        score += 5

    score = min(score, 100)

    # --------------------------------------------------------
    # ATS score
    # --------------------------------------------------------

    ats_score = 0

    if sections_detected["contact"]:
        ats_score += 15

    if sections_detected["education"]:
        ats_score += 15

    if sections_detected["skills"]:
        ats_score += 15

    if sections_detected["projects"]:
        ats_score += 15

    if sections_detected["experience"]:
        ats_score += 15

    if sections_detected["certifications"]:
        ats_score += 10

    if word_count >= 250:
        ats_score += 5

    if word_count <= 1000:
        ats_score += 5

    if not re.search(
        r"[^\x00-\x7F]{20,}",
        text
    ):
        ats_score += 5

    ats_score = min(ats_score, 100)

    # --------------------------------------------------------
    # Strengths
    # --------------------------------------------------------

    strengths = []

    if sections_detected["skills"]:
        strengths.append(
            "A dedicated technical skills section is present."
        )

    if sections_detected["projects"]:
        strengths.append(
            "Projects are included to demonstrate practical experience."
        )

    if sections_detected["experience"]:
        strengths.append(
            "Experience or internship information is included."
        )

    if sections_detected["education"]:
        strengths.append(
            "Educational background is clearly represented."
        )

    if sections_detected["certifications"]:
        strengths.append(
            "Certifications are included."
        )

    # --------------------------------------------------------
    # Weaknesses
    # --------------------------------------------------------

    weaknesses = []

    missing_sections = []

    section_names = {
        "contact": "Contact Information",
        "education": "Education",
        "skills": "Technical Skills",
        "projects": "Projects",
        "experience": "Experience",
        "certifications": "Certifications",
        "achievements": "Achievements"
    }

    for key, name in section_names.items():
        if not sections_detected[key]:
            missing_sections.append(name)

    if not sections_detected["contact"]:
        weaknesses.append(
            "Contact information is incomplete or difficult to detect."
        )

    if not sections_detected["skills"]:
        weaknesses.append(
            "A dedicated technical skills section was not detected."
        )

    if not sections_detected["projects"]:
        weaknesses.append(
            "Projects section was not detected."
        )

    if not sections_detected["experience"]:
        weaknesses.append(
            "Experience or internship section was not detected."
        )

    if not sections_detected["achievements"]:
        weaknesses.append(
            "Achievements section was not detected."
        )

    # --------------------------------------------------------
    # Tips
    # --------------------------------------------------------

    tips = []

    if not sections_detected["skills"]:
        tips.append(
            "Add a dedicated Technical Skills section and group skills by category."
        )

    if not sections_detected["projects"]:
        tips.append(
            "Add 2–3 relevant projects and describe the technology, implementation and result."
        )

    if not sections_detected["experience"]:
        tips.append(
            "Add internships, training, freelance work or relevant practical experience."
        )

    if not sections_detected["certifications"]:
        tips.append(
            "Add relevant technical certifications and courses."
        )

    if not sections_detected["achievements"]:
        tips.append(
            "Add measurable achievements such as rankings, awards, competitions or project results."
        )

    weak_words = [
        "responsible for",
        "worked on",
        "helped",
        "participated"
    ]

    found_weak_words = [
        word
        for word in weak_words
        if word in text_lower
    ]

    if found_weak_words:
        tips.append(
            "Replace generic phrases such as 'worked on' or "
            "'responsible for' with strong action verbs and measurable results."
        )

    numbers = re.findall(
        r"\b\d+(?:\.\d+)?%?\b",
        text
    )

    if len(numbers) < 3:
        tips.append(
            "Quantify achievements using numbers, percentages, users, "
            "performance improvements or other measurable results."
        )

    if word_count < 250:
        tips.append(
            "The resume appears short. Add relevant project, internship, "
            "skills and achievement details."
        )

    if word_count > 1000:
        tips.append(
            "The resume is quite long. Remove repetitive or less relevant content."
        )

    # --------------------------------------------------------
    # Section scores
    # --------------------------------------------------------

    section_scores = {
        "Contact Information":
            10 if sections_detected["contact"] else 0,

        "Education":
            15 if sections_detected["education"] else 0,

        "Technical Skills":
            15 if sections_detected["skills"] else 0,

        "Projects":
            20 if sections_detected["projects"] else 0,

        "Experience":
            15 if sections_detected["experience"] else 0,

        "Certifications":
            10 if sections_detected["certifications"] else 0,

        "Achievements":
            10 if sections_detected["achievements"] else 0
    }

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    if score >= 85:
        summary = (
            "The resume contains most of the major sections and "
            "has a strong foundation. Focus on measurable achievements, "
            "stronger bullet points and ATS optimization."
        )

    elif score >= 70:
        summary = (
            "The resume has a good foundation, but several areas "
            "can be strengthened to improve clarity, impact and ATS compatibility."
        )

    elif score >= 50:
        summary = (
            "The resume contains some important information, "
            "but needs improvement in structure, content and measurable achievements."
        )

    else:
        summary = (
            "The resume needs significant improvement in structure and content. "
            "Add missing sections and strengthen project and achievement descriptions."
        )

    return {
        "score": score,
        "ats_score": ats_score,
        "summary": summary,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": tips,
        "missing_sections": missing_sections,
        "ats_suggestions": [
            "Use standard section headings.",
            "Avoid tables, graphics and complex multi-column layouts.",
            "Keep important information in selectable text.",
            "Use consistent formatting throughout the document."
        ],
        "bullet_suggestions": [
            "Start bullet points with strong action verbs.",
            "Explain what you built or improved.",
            "Add measurable results wherever possible."
        ],
        "keyword_suggestions": [
            "Include relevant programming languages.",
            "Include frameworks, databases and development tools.",
            "Use standard technical terminology."
        ],
        "section_suggestions": {},
        "tips": tips,
        "sections": section_scores,
        "word_count": word_count,
        "ai_powered": False
    }


# ============================================================
# AI PROMPT
# ============================================================

def build_ai_prompt(text: str) -> str:

    return f"""
You are an expert resume reviewer, ATS specialist and career coach.

Analyze the following resume GENERICALLY.

IMPORTANT:
- Do NOT assume a specific target job.
- Do NOT tailor the analysis to a specific company.
- Evaluate the resume for general professional quality.
- Focus on clarity, structure, impact, technical skills,
  projects, experience, achievements and ATS compatibility.
- Do not invent information that is not present.
- If something is missing, explicitly say it is missing.
- Give practical suggestions that the candidate can actually apply.
- Be specific rather than giving generic advice.

You must evaluate:

1. Overall resume quality
2. ATS compatibility
3. Contact information
4. Professional summary/objective
5. Education
6. Technical skills
7. Projects
8. Experience/internships
9. Certifications
10. Achievements
11. Writing quality
12. Quantification of achievements
13. Action verbs
14. Formatting and ATS readability
15. Keyword/skill presentation
16. Resume length and information density

SCORING:

Give category scores from 0 to 100.

Resume quality categories:
- content_quality
- technical_skills
- projects
- experience
- achievements
- education
- certifications
- writing_quality

ATS categories:
- section_structure
- ats_readability
- standard_headings
- keyword_structure
- formatting_compatibility
- contact_parsing

The backend will calculate the final scores from these category scores.

RETURN ONLY VALID JSON.

Use exactly this structure:

{{
    "category_scores": {{
        "content_quality": 0,
        "technical_skills": 0,
        "projects": 0,
        "experience": 0,
        "achievements": 0,
        "education": 0,
        "certifications": 0,
        "writing_quality": 0
    }},

    "ats_category_scores": {{
        "section_structure": 0,
        "ats_readability": 0,
        "standard_headings": 0,
        "keyword_structure": 0,
        "formatting_compatibility": 0,
        "contact_parsing": 0
    }},

    "summary": "",

    "strengths": [
        ""
    ],

    "weaknesses": [
        ""
    ],

    "missing_sections": [
        ""
    ],

    "recommendations": [
        ""
    ],

    "ats_suggestions": [
        ""
    ],

    "bullet_suggestions": [
        ""
    ],

    "keyword_suggestions": [
        ""
    ],

    "section_suggestions": {{
        "Professional Summary": [
            ""
        ],
        "Technical Skills": [
            ""
        ],
        "Projects": [
            ""
        ],
        "Experience": [
            ""
        ],
        "Education": [
            ""
        ],
        "Certifications": [
            ""
        ],
        "Achievements": [
            ""
        ]
    }},

    "tips": [
        ""
    ]
}}

RESUME TEXT:

---------------- START RESUME ----------------

{text}

----------------- END RESUME -----------------
"""


# ============================================================
# CALL OLLAMA
# ============================================================

def call_ollama(prompt: str) -> Dict[str, Any]:

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.2
        }
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        OLLAMA_URL,
        data=data,
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=120
        ) as response:

            raw_response = response.read().decode(
                "utf-8"
            )

            result = json.loads(raw_response)

            ai_text = result.get(
                "response",
                ""
            )

            if not ai_text:
                raise ValueError(
                    "Ollama returned an empty response."
                )

            return parse_ai_json(ai_text)

    except urllib.error.URLError as error:
        raise RuntimeError(
            f"Could not connect to Ollama: {error}"
        )

    except Exception as error:
        raise RuntimeError(
            f"Ollama analysis failed: {error}"
        )


# ============================================================
# PARSE AI JSON
# ============================================================

def parse_ai_json(ai_text: str) -> Dict[str, Any]:

    ai_text = ai_text.strip()

    # Remove markdown code fences if model adds them
    ai_text = re.sub(
        r"^```json\s*",
        "",
        ai_text,
        flags=re.IGNORECASE
    )

    ai_text = re.sub(
        r"\s*```$",
        "",
        ai_text
    )

    try:
        return json.loads(ai_text)

    except json.JSONDecodeError:

        # Try to find JSON object
        start = ai_text.find("{")
        end = ai_text.rfind("}")

        if start != -1 and end != -1:
            json_text = ai_text[
                start:end + 1
            ]

            return json.loads(json_text)

        raise ValueError(
            "AI returned invalid JSON."
        )


# ============================================================
# SAFE SCORE
# ============================================================

def safe_score(value: Any) -> float:

    try:
        value = float(value)
    except (TypeError, ValueError):
        return 0

    return max(
        0,
        min(100, value)
    )


# ============================================================
# CALCULATE RESUME SCORE
# ============================================================

def calculate_resume_score(
    category_scores: Dict[str, Any]
) -> int:

    weights = {
        "content_quality": 20,
        "technical_skills": 15,
        "projects": 20,
        "experience": 15,
        "achievements": 10,
        "education": 10,
        "certifications": 5,
        "writing_quality": 5
    }

    total = 0

    for category, weight in weights.items():

        value = safe_score(
            category_scores.get(
                category,
                0
            )
        )

        total += (
            value * weight / 100
        )

    return round(
        max(0, min(100, total))
    )


# ============================================================
# CALCULATE ATS SCORE
# ============================================================

def calculate_ats_score(
    ats_scores: Dict[str, Any]
) -> int:

    weights = {
        "section_structure": 20,
        "ats_readability": 20,
        "standard_headings": 15,
        "keyword_structure": 15,
        "formatting_compatibility": 20,
        "contact_parsing": 10
    }

    total = 0

    for category, weight in weights.items():

        value = safe_score(
            ats_scores.get(
                category,
                0
            )
        )

        total += (
            value * weight / 100
        )

    return round(
        max(0, min(100, total))
    )


# ============================================================
# CONVERT CATEGORY SCORES TO UI SECTION SCORES
# ============================================================

def build_section_scores(
    category_scores: Dict[str, Any]
) -> Dict[str, int]:

    return {
        "Contact Information":
            round(
                safe_score(
                    category_scores.get(
                        "content_quality",
                        0
                    )
                ) * 0.10
            ),

        "Education":
            round(
                safe_score(
                    category_scores.get(
                        "education",
                        0
                    )
                ) * 0.15
            ),

        "Technical Skills":
            round(
                safe_score(
                    category_scores.get(
                        "technical_skills",
                        0
                    )
                ) * 0.15
            ),

        "Projects":
            round(
                safe_score(
                    category_scores.get(
                        "projects",
                        0
                    )
                ) * 0.20
            ),

        "Experience":
            round(
                safe_score(
                    category_scores.get(
                        "experience",
                        0
                    )
                ) * 0.15
            ),

        "Certifications":
            round(
                safe_score(
                    category_scores.get(
                        "certifications",
                        0
                    )
                ) * 0.10
            ),

        "Achievements":
            round(
                safe_score(
                    category_scores.get(
                        "achievements",
                        0
                    )
                ) * 0.10
            )
    }


# ============================================================
# NORMALIZE AI RESPONSE
# ============================================================

def normalize_ai_result(
    ai_result: Dict[str, Any],
    text: str
) -> Dict[str, Any]:

    category_scores = ai_result.get(
        "category_scores",
        {}
    )

    ats_category_scores = ai_result.get(
        "ats_category_scores",
        {}
    )

    resume_score = calculate_resume_score(
        category_scores
    )

    ats_score = calculate_ats_score(
        ats_category_scores
    )

    word_count = len(
        text.split()
    )

    strengths = ai_result.get(
        "strengths",
        []
    )

    weaknesses = ai_result.get(
        "weaknesses",
        []
    )

    missing_sections = ai_result.get(
        "missing_sections",
        []
    )

    recommendations = ai_result.get(
        "recommendations",
        []
    )

    ats_suggestions = ai_result.get(
        "ats_suggestions",
        []
    )

    bullet_suggestions = ai_result.get(
        "bullet_suggestions",
        []
    )

    keyword_suggestions = ai_result.get(
        "keyword_suggestions",
        []
    )

    section_suggestions = ai_result.get(
        "section_suggestions",
        {}
    )

    tips = ai_result.get(
        "tips",
        []
    )

    # Make sure arrays are actually arrays
    if not isinstance(strengths, list):
        strengths = [str(strengths)]

    if not isinstance(weaknesses, list):
        weaknesses = [str(weaknesses)]

    if not isinstance(missing_sections, list):
        missing_sections = [
            str(missing_sections)
        ]

    if not isinstance(recommendations, list):
        recommendations = [
            str(recommendations)
        ]

    if not isinstance(ats_suggestions, list):
        ats_suggestions = [
            str(ats_suggestions)
        ]

    if not isinstance(bullet_suggestions, list):
        bullet_suggestions = [
            str(bullet_suggestions)
        ]

    if not isinstance(keyword_suggestions, list):
        keyword_suggestions = [
            str(keyword_suggestions)
        ]

    if not isinstance(tips, list):
        tips = [str(tips)]

    if not isinstance(
        section_suggestions,
        dict
    ):
        section_suggestions = {}

    return {
        "score": resume_score,

        "ats_score": ats_score,

        "summary": str(
            ai_result.get(
                "summary",
                "AI analysis completed."
            )
        ),

        "strengths": strengths,

        "weaknesses": weaknesses,

        "missing_sections":
            missing_sections,

        "recommendations":
            recommendations,

        "ats_suggestions":
            ats_suggestions,

        "bullet_suggestions":
            bullet_suggestions,

        "keyword_suggestions":
            keyword_suggestions,

        "section_suggestions":
            section_suggestions,

        "tips":
            tips,

        "sections":
            build_section_scores(
                category_scores
            ),

        "category_scores":
            category_scores,

        "ats_category_scores":
            ats_category_scores,

        "word_count":
            word_count,

        "ai_powered":
            True,

        "ai_model":
            OLLAMA_MODEL
    }


# ============================================================
# MAIN ANALYZER
# ============================================================

def analyze_resume(text: str) -> Dict[str, Any]:

    text = text.strip()

    if not text:

        return basic_analyzer(
            text
        )

    try:

        prompt = build_ai_prompt(
            text
        )

        ai_result = call_ollama(
            prompt
        )

        return normalize_ai_result(
            ai_result,
            text
        )

    except Exception as error:

        print(
            "AI resume analysis unavailable:",
            error
        )

        print(
            "Using fallback resume analyzer."
        )

        result = basic_analyzer(
            text
        )

        result["ai_error"] = str(
            error
        )

        return result