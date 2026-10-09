"""
ai_assistant.py
───────────────
Career-domain AI assistant powered by Ollama (llama3.2 by default).

Knowledge Base covers 30 topics across 6 categories:
  1. Interview Preparation
  2. Resume Building
  3. Backend Technologies
  4. Project Tech Stack (React, FastAPI, PostgreSQL, JWT, etc.)
  5. Foundational CS (DSA, System Design, OS, Networking, OOP)
  6. Career Strategy (Placement, Salary, Switch, LinkedIn, etc.)
"""

import json
import os
import re
import urllib.request
import urllib.error
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL   = os.getenv("OLLAMA_URL",   "http://127.0.0.1:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# ─────────────────────────────────────────────────────────────
# DOMAIN KEYWORDS  (expanded)
# ─────────────────────────────────────────────────────────────
CAREER_KEYWORDS = [
    # job search
    "job", "jobs", "role", "roles", "career", "placement", "hire",
    "hiring", "recruiter", "recruitment", "opportunity", "apply",
    "application", "offer", "interview", "internship", "fresher",
    "salary", "ctc", "lpa", "stipend", "package", "hike",
    # resume
    "resume", "cv", "curriculum", "ats", "cover letter", "linkedin",
    "portfolio", "github", "profile", "summary", "objective",
    "bullet point", "action verb", "quantify", "one page",
    # DSA / CS fundamentals
    "dsa", "data structure", "algorithm", "leetcode", "coding", "neetcode",
    "competitive", "array", "linked list", "tree", "graph", "dp",
    "dynamic programming", "recursion", "backtracking", "sorting",
    "binary search", "heap", "stack", "queue", "hash map", "trie",
    # system design
    "system design", "scalability", "distributed", "architecture",
    "hld", "lld", "microservices", "monolith", "load balancer",
    "cdn", "cache", "redis", "message queue", "kafka", "cap theorem",
    # languages & frameworks
    "python", "java", "javascript", "typescript", "c++", "c#", "go",
    "rust", "kotlin", "swift", "php", "ruby", "scala",
    "react", "vue", "angular", "next.js", "node", "express", "django",
    "flask", "fastapi", "spring", "laravel",
    # backend
    "backend", "api", "rest", "graphql", "websocket", "http",
    "authentication", "authorization", "jwt", "oauth", "session",
    "database", "sql", "nosql", "postgresql", "mysql", "mongodb",
    "redis", "orm", "sqlalchemy", "migration", "query", "index",
    # cloud / devops
    "cloud", "aws", "gcp", "azure", "docker", "kubernetes", "k8s",
    "ci/cd", "jenkins", "github actions", "terraform", "ansible",
    "linux", "bash", "shell", "nginx", "deployment", "devops", "sre",
    # tools
    "git", "version control", "github", "gitlab", "bitbucket",
    "postman", "swagger", "vscode", "jira", "agile", "scrum",
    # interview types
    "technical round", "hr round", "aptitude", "online assessment",
    "oa", "hackerrank", "codechef", "codeforces", "gfg",
    "mock", "star method", "behavioural", "behavioral", "soft skill",
    # testing
    "testing", "unit test", "integration test", "pytest", "jest",
    "tdd", "bdd", "selenium", "cypress",
    # ML / AI
    "machine learning", "ml", "deep learning", "ai", "nlp",
    "computer vision", "tensorflow", "pytorch", "pandas", "numpy",
    "scikit-learn", "data science", "feature engineering",
    # skills / learning
    "skill", "skills", "learn", "learning", "course", "certification",
    "certify", "practice", "upskill", "roadmap", "study", "preparation",
    "prepare", "project", "portfolio", "open source", "contribute",
    "freelance", "freelancing", "remote work",
    # placement / companies
    "placement", "campus", "off-campus", "on-campus", "company",
    "product company", "service company", "startup", "faang", "maang",
    "google", "microsoft", "amazon", "flipkart", "infosys", "tcs",
    "wipro", "accenture", "cognizant", "capgemini",
    # career
    "advice", "tip", "tips", "guide", "path", "transition", "switch",
    "growth", "promote", "promotion", "manager", "lead", "architect",
    "negotiate", "negotiation", "linkedin", "networking",
    "cover letter", "referral",
]

OFF_TOPIC_SIGNALS = [
    "recipe", "cook", "food", "movie", "film", "sport", "cricket",
    "football", "weather", "news", "politics", "religion", "joke",
    "game", "dating", "relationship", "stock market", "crypto",
    "bitcoin", "forex", "medical", "doctor", "hospital", "medicine",
    "law", "legal", "insurance", "astrology", "horoscope",
]

# ─────────────────────────────────────────────────────────────
# KNOWLEDGE BASE  (30 topics across 6 categories)
# ─────────────────────────────────────────────────────────────
KB: List[Dict[str, Any]] = [

    # ══════════════════════════════════════════════════════════
    # CATEGORY 1 — INTERVIEW PREPARATION
    # ══════════════════════════════════════════════════════════

    {
        "topic": "Interview Preparation",
        "category": "Interview",
        "keywords": ["interview", "preparation", "prepare", "round", "how to crack", "interview tips"],
        "answer": (
            "Complete interview preparation roadmap:\n\n"
            "Phase 1 — Technical Foundation (8 weeks)\n"
            "• Week 1–3: DSA — arrays, strings, hash maps, two pointer, sliding window\n"
            "• Week 4–5: Trees, graphs, BFS/DFS, heaps\n"
            "• Week 6–7: Dynamic programming, backtracking, greedy\n"
            "• Week 8:   System design basics (for SDE-2+ roles)\n\n"
            "Phase 2 — Practice (4 weeks)\n"
            "• Solve 2–3 LeetCode problems daily\n"
            "• Do at least 2 full mock interviews per week\n"
            "• Review every wrong answer within 24 hours\n"
            "• Practice explaining your solution out loud (interviewers assess communication)\n\n"
            "Phase 3 — Interview Week\n"
            "• Day before: Revise your resume line by line\n"
            "• Prepare 3 STAR stories for HR round\n"
            "• Research the company: product, tech stack, recent news\n"
            "• Sleep 8 hours — performance matters more than last-minute revision\n\n"
            "On the day:\n"
            "• Read every problem fully before writing code\n"
            "• Clarify constraints and edge cases first\n"
            "• Start with a brute force, then optimise\n"
            "• Explain your thought process as you code"
        ),
        "sources": [
            {"label": "NeetCode — Interview Roadmap",    "url": "https://neetcode.io/roadmap"},
            {"label": "Pramp — Free Mock Interviews",     "url": "https://pramp.com"},
            {"label": "InterviewBit",                    "url": "https://interviewbit.com"},
            {"label": "GeeksforGeeks Interview Prep",    "url": "https://geeksforgeeks.org/company-interview-corner"},
        ],
    },

    {
        "topic": "Technical Interview",
        "category": "Interview",
        "keywords": ["technical interview", "coding interview", "coding round", "technical round", "online assessment", "oa"],
        "answer": (
            "Technical interview / coding round guide:\n\n"
            "Online Assessment (OA):\n"
            "• Typically 2–3 problems in 60–90 minutes\n"
            "• Focus on: arrays, strings, hash maps, two pointer, basic graphs\n"
            "• Practice on HackerRank, Codechef, LeetCode contest mode\n"
            "• Read problem constraints first — they hint at the expected approach\n\n"
            "Technical Interview (Live Coding):\n"
            "• Step 1 — Understand: restate the problem in your own words\n"
            "• Step 2 — Examples: walk through 2–3 test cases including edge cases\n"
            "• Step 3 — Brute force first: state TC/SC, then say 'can we do better?'\n"
            "• Step 4 — Optimise: think aloud about patterns\n"
            "• Step 5 — Code cleanly with meaningful variable names\n"
            "• Step 6 — Test: trace through your code with an example\n\n"
            "Most common patterns asked:\n"
            "1. Two pointer / sliding window\n"
            "2. Hash map for frequency counting\n"
            "3. BFS/DFS on trees and graphs\n"
            "4. Binary search on answer\n"
            "5. DP (longest subsequence, knapsack variants)\n\n"
            "Companies to practice by: Google (graphs, DP), Amazon (trees, arrays), "
            "Microsoft (trees, recursion), Infosys/TCS (basic arrays, strings)"
        ),
        "sources": [
            {"label": "LeetCode — Company Tag Problems", "url": "https://leetcode.com/problemset"},
            {"label": "HackerRank Practice",             "url": "https://hackerrank.com/domains/algorithms"},
            {"label": "Striver's SDE Sheet",             "url": "https://takeuforward.org/strivers-a2z-dsa-course"},
        ],
    },

    {
        "topic": "HR Interview",
        "category": "Interview",
        "keywords": ["hr interview", "hr round", "behavioural", "behavioral", "soft skills", "star method", "tell me about yourself", "weakness", "strength"],
        "answer": (
            "HR / Behavioural interview preparation:\n\n"
            "Tell Me About Yourself (2-minute formula):\n"
            "  Present: 'I am a final year B.Tech CSE student at [college].'\n"
            "  Past:    'I have interned at X and built Y project.'\n"
            "  Future:  'I'm looking for a role where I can work on Z.'\n\n"
            "STAR Method for behavioural questions:\n"
            "  S — Situation: Set the scene\n"
            "  T — Task:      Your specific responsibility\n"
            "  A — Action:    What YOU did (not your team)\n"
            "  R — Result:    Quantify the outcome\n\n"
            "Top 10 HR questions + how to approach them:\n"
            "1. Tell me about yourself → 2-min structured pitch\n"
            "2. Greatest strength → Pick relevant, give a STAR example\n"
            "3. Biggest weakness → Real weakness + what you're doing about it\n"
            "4. Why this company? → Research their product and tech stack\n"
            "5. Where do you see yourself in 5 years? → Aligns with role growth\n"
            "6. Describe a challenge you overcame → STAR story\n"
            "7. Describe a team conflict → Focus on resolution\n"
            "8. Why should we hire you? → Skills + culture fit + enthusiasm\n"
            "9. Do you have any questions? → Always ask 2–3 thoughtful questions\n"
            "10. Salary expectations? → Research market, give a range, not a fixed number\n\n"
            "Prepare at least 5 STAR stories that can cover: failure, success, teamwork, leadership, and a difficult technical problem."
        ),
        "sources": [
            {"label": "STAR Method Explained — Indeed",  "url": "https://indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique"},
            {"label": "Top HR Questions — Glassdoor",    "url": "https://glassdoor.com/blog/common-interview-questions"},
        ],
    },

    {
        "topic": "System Design Interview",
        "category": "Interview",
        "keywords": ["system design interview", "hld", "lld", "design interview", "design question", "scalability", "distributed system"],
        "answer": (
            "System Design interview framework (for SDE-2 and above):\n\n"
            "The 5-step approach:\n"
            "1. Clarify requirements (5 min)\n"
            "   • Functional: what must the system do?\n"
            "   • Non-functional: scale, latency, consistency, availability\n\n"
            "2. Estimate scale (3 min)\n"
            "   • DAU, QPS (queries per second), storage needed\n"
            "   • Example: 10M users × 5 requests/day = ~580 QPS peak\n\n"
            "3. High-level design (10 min)\n"
            "   • Draw: client → API gateway → services → DB → cache → CDN\n"
            "   • Choose SQL vs NoSQL and justify\n\n"
            "4. Deep dive into critical components (15 min)\n"
            "   • DB schema, indexing strategy, sharding\n"
            "   • Caching layer (Redis), TTL, eviction policy\n"
            "   • Async processing (message queue, Kafka)\n\n"
            "5. Address bottlenecks & trade-offs (5 min)\n"
            "   • Single points of failure, CAP trade-offs\n\n"
            "Must-practice designs:\n"
            "• URL Shortener (bit.ly)\n"
            "• Twitter / News Feed\n"
            "• Rate Limiter\n"
            "• Notification System (push, email, SMS)\n"
            "• File Storage (Google Drive / S3)\n"
            "• Ride Sharing (Uber/Ola)\n"
            "• Search Autocomplete\n"
            "• Distributed Cache"
        ),
        "sources": [
            {"label": "System Design Primer",            "url": "https://github.com/donnemartin/system-design-primer"},
            {"label": "Grokking System Design",          "url": "https://educative.io/courses/grokking-the-system-design-interview"},
            {"label": "ByteByteGo Blog",                 "url": "https://blog.bytebytego.com"},
        ],
    },

    {
        "topic": "Aptitude & Logical Reasoning",
        "category": "Interview",
        "keywords": ["aptitude", "logical reasoning", "verbal", "quantitative", "maths", "number series", "puzzles", "campus test"],
        "answer": (
            "Aptitude test preparation for campus placements:\n\n"
            "Key sections and topics:\n\n"
            "Quantitative Aptitude:\n"
            "• Number system, HCF/LCM\n"
            "• Percentages, profit & loss, simple/compound interest\n"
            "• Time, speed & distance; time & work\n"
            "• Permutations, combinations, probability\n"
            "• Averages, mixtures, ratios\n\n"
            "Logical Reasoning:\n"
            "• Series completion (number, alphabet, figure)\n"
            "• Blood relations, seating arrangements\n"
            "• Coding-decoding, direction sense\n"
            "• Syllogisms, statement-conclusion, Venn diagrams\n\n"
            "Verbal Ability:\n"
            "• Reading comprehension\n"
            "• Para jumbles, fill in the blanks\n"
            "• Error correction, vocabulary\n\n"
            "Study plan:\n"
            "• Practise 30 questions daily for 4 weeks\n"
            "• Time yourself strictly — 1 min per question target\n"
            "• Review wrong answers the same day\n"
            "• Do 3 full mock tests in the last week"
        ),
        "sources": [
            {"label": "IndiaBix Aptitude",               "url": "https://indiabix.com"},
            {"label": "Prepinsta Campus Prep",           "url": "https://prepinsta.com"},
            {"label": "Freshersworld Tests",             "url": "https://freshersworld.com/aptitude-questions"},
        ],
    },

    # ══════════════════════════════════════════════════════════
    # CATEGORY 2 — RESUME BUILDING
    # ══════════════════════════════════════════════════════════

    {
        "topic": "Resume Building",
        "category": "Resume",
        "keywords": ["resume", "cv", "build resume", "write resume", "resume format", "ats", "one page"],
        "answer": (
            "How to build a strong placement resume:\n\n"
            "Format rules:\n"
            "• Single column, clean font (Calibri / Arial / Roboto 10–11pt)\n"
            "• 1 page for freshers / under 3 years of experience\n"
            "• No photos, borders, tables, or coloured backgrounds — ATS unfriendly\n"
            "• Save and submit as PDF\n\n"
            "Recommended sections (in order):\n"
            "1. Name + Contact (email, phone, LinkedIn, GitHub, portfolio)\n"
            "2. Professional Summary (3 lines: who you are, what you do, what you want)\n"
            "3. Technical Skills (group by: Languages | Frameworks | Databases | Tools | Cloud)\n"
            "4. Projects (2–3 projects with Tech stack | Problem | Your contribution | Result)\n"
            "5. Experience / Internships (reverse chronological)\n"
            "6. Education (degree, college, CGPA, year)\n"
            "7. Certifications\n"
            "8. Achievements (hackathons, ranks, publications)\n\n"
            "Writing strong bullet points:\n"
            "• Formula: [Action verb] + [What you did] + [Result/Impact]\n"
            "• Bad:  'Worked on a web app'\n"
            "• Good: 'Built a React + FastAPI web app that reduced manual reporting time by 60%'\n\n"
            "ATS optimisation:\n"
            "• Mirror keywords from the job description\n"
            "• Use standard section headings (not 'My Achievements' — use 'Achievements')\n"
            "• Avoid headers/footers — ATS may skip them"
        ),
        "sources": [
            {"label": "Jobscan — ATS Resume Checker",    "url": "https://jobscan.co"},
            {"label": "Resume Worded",                   "url": "https://resumeworded.com"},
            {"label": "Canva Resume Templates",          "url": "https://canva.com/resumes"},
        ],
    },

    {
        "topic": "Resume Projects Section",
        "category": "Resume",
        "keywords": ["projects", "project section", "project resume", "how to write project", "project description"],
        "answer": (
            "How to write a strong Projects section on your resume:\n\n"
            "Each project entry should have:\n"
            "• Project Name (bold) | Tech Stack | GitHub link | Live demo (if available)\n"
            "• 3–4 bullet points describing what you built, how you built it, and the impact\n\n"
            "Template:\n"
            "[Project Name] | React, FastAPI, PostgreSQL, Docker | github.com/you/project\n"
            "• Built a [what] that [does what] for [who]\n"
            "• Implemented [specific feature] using [technology] to achieve [result]\n"
            "• Deployed on [AWS / Heroku / Vercel] with CI/CD pipeline via GitHub Actions\n"
            "• Achieved [metric] — e.g. 100+ users, 95% uptime, 40% faster load time\n\n"
            "Project ideas by role:\n"
            "SDE:  Full-stack CRUD app, URL shortener, real-time chat, REST API service\n"
            "Data: Data dashboard (Streamlit/Plotly), ML model deployment, ETL pipeline\n"
            "DevOps: Dockerised app with CI/CD, Kubernetes cluster, infra with Terraform\n"
            "ML:   Image classifier, chatbot, recommendation engine, NLP text classifier\n\n"
            "Golden rule: Never put a project you cannot explain in depth. Interviewers will ask you every line of your tech stack."
        ),
        "sources": [
            {"label": "GitHub — Open Source Projects",  "url": "https://github.com/explore"},
            {"label": "Frontend Mentor — Project Ideas","url": "https://frontendmentor.io"},
            {"label": "ML Projects — Papers With Code", "url": "https://paperswithcode.com"},
        ],
    },

    {
        "topic": "LinkedIn Profile",
        "category": "Resume",
        "keywords": ["linkedin", "linkedin profile", "linkedin tips", "linkedin headline", "networking linkedin", "recruiter"],
        "answer": (
            "How to optimise your LinkedIn profile for placement:\n\n"
            "Profile photo: Professional headshot, plain background, good lighting\n\n"
            "Headline (most important field):\n"
            "• Do NOT use 'Student at XYZ College'\n"
            "• Use: 'Final Year CSE Student | Full Stack Developer | React · Python · FastAPI'\n"
            "• Or: 'Aspiring Software Engineer | DSA | Open to Opportunities 2026'\n\n"
            "About section:\n"
            "• 3–4 lines: who you are, tech stack, what you're building, what you want\n"
            "• End with: 'Open to full-time SDE roles | Email: you@email.com'\n\n"
            "Featured section: Pin your best GitHub project, resume PDF, or portfolio\n\n"
            "Experience & Projects: Mirror your resume exactly\n\n"
            "Skills: Add 10–20 relevant skills and get endorsements from peers\n\n"
            "Activity for visibility:\n"
            "• Post your project launches, learnings, internship experiences\n"
            "• Comment thoughtfully on posts by engineers at target companies\n"
            "• Connect with 2–3 people per day in your target role/company\n\n"
            "Open to Work: Enable it (visible to recruiters only) when actively searching"
        ),
        "sources": [
            {"label": "LinkedIn Profile Tips",          "url": "https://linkedin.com/help/linkedin/answer/a549370"},
            {"label": "LinkedIn Learning — Free",       "url": "https://linkedin.com/learning"},
        ],
    },

    {
        "topic": "Cover Letter",
        "category": "Resume",
        "keywords": ["cover letter", "covering letter", "job application letter", "motivation letter"],
        "answer": (
            "How to write a strong cover letter:\n\n"
            "Structure (keep it to 3–4 paragraphs, under 350 words):\n\n"
            "Paragraph 1 — Opening:\n"
            "  State the role you're applying for and where you found it.\n"
            "  Show genuine enthusiasm with 1 specific thing about the company.\n"
            "  Example: 'I'm excited to apply for the SDE role at Razorpay. Your work on\n"
            "  building India's payments infrastructure is something I've followed closely.'\n\n"
            "Paragraph 2 — Why you:\n"
            "  Pick 2 specific achievements from your resume and connect them to the JD.\n"
            "  Use numbers: 'I built a React app serving 200+ users with a 95% uptime.'\n\n"
            "Paragraph 3 — Why them:\n"
            "  Mention 1–2 specific things about the company (product, culture, tech stack).\n"
            "  Show you've done research — don't just say 'reputed company'.\n\n"
            "Paragraph 4 — Closing:\n"
            "  Express interest in discussing further and provide contact details.\n\n"
            "Mistakes to avoid:\n"
            "• Don't repeat your entire resume — add colour to 2 points\n"
            "• Don't use generic openers like 'I am writing to apply for...'\n"
            "• Don't exaggerate — everything must be verifiable"
        ),
        "sources": [
            {"label": "Cover Letter Examples — Indeed",  "url": "https://indeed.com/career-advice/cover-letter-samples"},
            {"label": "Zety Cover Letter Builder",       "url": "https://zety.com/cover-letter-builder"},
        ],
    },

    # ══════════════════════════════════════════════════════════
    # CATEGORY 3 — BACKEND TECHNOLOGIES
    # ══════════════════════════════════════════════════════════

    {
        "topic": "Python Backend Development",
        "category": "Backend",
        "keywords": ["python", "python backend", "python developer", "django", "flask", "fastapi", "python web"],
        "answer": (
            "Python backend development roadmap:\n\n"
            "Core Python (must know):\n"
            "• Data types, collections (list, dict, set, tuple)\n"
            "• OOP — classes, inheritance, dunder methods\n"
            "• Decorators, context managers, generators\n"
            "• Error handling (try/except/finally)\n"
            "• Virtual environments, pip, requirements.txt\n\n"
            "Web frameworks comparison:\n"
            "• FastAPI — modern, async, auto Swagger docs, best for APIs (use this for new projects)\n"
            "• Django   — batteries-included, ORM, admin panel (best for full apps)\n"
            "• Flask    — minimal, flexible (best for small services)\n\n"
            "FastAPI essentials:\n"
            "• Define routes with @app.get / @app.post\n"
            "• Use Pydantic models for request/response validation\n"
            "• Dependency injection with Depends()\n"
            "• Middleware for CORS, auth headers\n"
            "• SQLAlchemy ORM for database\n"
            "• JWT auth with python-jose + passlib\n\n"
            "Database skills:\n"
            "• PostgreSQL — primary relational DB\n"
            "• SQLAlchemy — ORM with models, sessions, relationships\n"
            "• Alembic — database migrations\n"
            "• Redis — caching, rate limiting, sessions\n\n"
            "Production checklist:\n"
            "• Uvicorn / Gunicorn as ASGI server\n"
            "• Environment variables via .env + python-dotenv\n"
            "• Docker container for deployment\n"
            "• Logging + structured error handling"
        ),
        "sources": [
            {"label": "FastAPI Official Docs",           "url": "https://fastapi.tiangolo.com"},
            {"label": "Real Python",                     "url": "https://realpython.com"},
            {"label": "Django Official Tutorial",        "url": "https://docs.djangoproject.com/en/stable/intro/tutorial01"},
        ],
    },

    {
        "topic": "REST APIs",
        "category": "Backend",
        "keywords": ["rest api", "api design", "http", "endpoint", "request", "response", "status code", "postman", "swagger"],
        "answer": (
            "REST API design essentials:\n\n"
            "HTTP methods and when to use them:\n"
            "• GET    — retrieve data (no body)\n"
            "• POST   — create a new resource\n"
            "• PUT    — replace a resource completely\n"
            "• PATCH  — partial update\n"
            "• DELETE — remove a resource\n\n"
            "URL naming conventions:\n"
            "• Use nouns, not verbs: /users not /getUsers\n"
            "• Plural for collections: /posts not /post\n"
            "• Nest for relations: /users/{id}/posts\n"
            "• Use query params for filtering: /jobs?location=Hyderabad&type=full-time\n\n"
            "HTTP status codes:\n"
            "• 200 OK, 201 Created, 204 No Content\n"
            "• 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error\n"
            "• 500 Internal Server Error\n\n"
            "Request / Response structure:\n"
            "• Always use JSON\n"
            "• Consistent error format: { 'detail': 'Error message' }\n"
            "• Add pagination for list endpoints: { data, total, page, page_size }\n\n"
            "Security:\n"
            "• Bearer token in Authorization header\n"
            "• Validate all inputs — never trust client data\n"
            "• Rate limiting to prevent abuse\n"
            "• HTTPS in production — never HTTP"
        ),
        "sources": [
            {"label": "RESTful API Design Best Practices", "url": "https://restfulapi.net"},
            {"label": "Postman Learning Center",           "url": "https://learning.postman.com"},
            {"label": "HTTP Status Codes",                 "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"},
        ],
    },

    {
        "topic": "Databases & SQL",
        "category": "Backend",
        "keywords": ["database", "sql", "postgresql", "mysql", "mongodb", "nosql", "query", "join", "index", "normalisation", "acid"],
        "answer": (
            "Database essentials for backend developers:\n\n"
            "SQL fundamentals:\n"
            "• SELECT, INSERT, UPDATE, DELETE\n"
            "• JOINs: INNER, LEFT, RIGHT, FULL OUTER\n"
            "• GROUP BY, HAVING, ORDER BY, LIMIT\n"
            "• Subqueries and CTEs (WITH clause)\n"
            "• Window functions: ROW_NUMBER(), RANK(), LAG(), LEAD()\n\n"
            "Database design:\n"
            "• Normalisation: 1NF (atomic values), 2NF (remove partial deps), 3NF (remove transitive deps)\n"
            "• Primary key, foreign key, unique, not null constraints\n"
            "• Indexes: B-tree (default), hash, partial — use on frequently queried columns\n\n"
            "ACID properties:\n"
            "• Atomicity:   All or nothing\n"
            "• Consistency: Data stays valid\n"
            "• Isolation:   Concurrent transactions don't interfere\n"
            "• Durability:  Committed data persists\n\n"
            "SQL vs NoSQL — when to choose:\n"
            "• SQL (PostgreSQL, MySQL): structured data, relationships, transactions\n"
            "• NoSQL (MongoDB): unstructured/flexible schema, horizontal scaling\n"
            "• Redis: caching, sessions, pub/sub, leaderboards\n\n"
            "PostgreSQL-specific:\n"
            "• JSONB column for semi-structured data\n"
            "• EXPLAIN ANALYZE to debug slow queries\n"
            "• psql CLI and pgAdmin for management\n"
            "• Connection pooling with PgBouncer"
        ),
        "sources": [
            {"label": "SQLZoo — Practice",               "url": "https://sqlzoo.net"},
            {"label": "PostgreSQL Official Docs",        "url": "https://postgresql.org/docs"},
            {"label": "Use The Index, Luke",             "url": "https://use-the-index-luke.com"},
        ],
    },

    {
        "topic": "Authentication & Authorization",
        "category": "Backend",
        "keywords": ["authentication", "authorization", "jwt", "token", "session", "oauth", "auth", "login", "password", "bcrypt", "hashing"],
        "answer": (
            "Authentication and Authorization guide:\n\n"
            "Core concepts:\n"
            "• Authentication: Who are you? (login with email + password)\n"
            "• Authorization:  What can you do? (role-based access control)\n\n"
            "JWT (JSON Web Token):\n"
            "• Three parts: Header.Payload.Signature (base64 encoded)\n"
            "• Header: algorithm (HS256), type\n"
            "• Payload: user ID (sub), expiry (exp), any custom claims\n"
            "• Signature: HMAC-SHA256(header + payload + secret)\n"
            "• Store in localStorage (simple) or httpOnly cookie (more secure)\n"
            "• Short expiry (15 min to 24 hr) + refresh token pattern\n\n"
            "Password hashing:\n"
            "• NEVER store plain text passwords\n"
            "• Use bcrypt (passlib in Python) — it is slow by design\n"
            "• passlib.hash.bcrypt.hash(password)\n"
            "• passlib.hash.bcrypt.verify(plain, hashed)\n\n"
            "OAuth 2.0 (third-party login):\n"
            "• User clicks 'Login with Google'\n"
            "• Redirect to Google's auth server → user consents\n"
            "• Google returns an authorization code\n"
            "• Your server exchanges code for access token\n"
            "• Get user profile from Google API\n\n"
            "FastAPI auth pattern (this project):\n"
            "• POST /login → verify password → return JWT\n"
            "• Axios interceptor attaches Bearer token to every request\n"
            "• Depends(get_current_user) in FastAPI to protect endpoints"
        ),
        "sources": [
            {"label": "JWT.io — Debugger",               "url": "https://jwt.io"},
            {"label": "OWASP Auth Cheatsheet",           "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"},
            {"label": "Passlib Docs",                    "url": "https://passlib.readthedocs.io"},
        ],
    },

    {
        "topic": "Docker & Containerisation",
        "category": "Backend",
        "keywords": ["docker", "container", "dockerfile", "docker-compose", "image", "containerise", "deployment"],
        "answer": (
            "Docker essentials for developers:\n\n"
            "Core concepts:\n"
            "• Image:     A blueprint (built from a Dockerfile)\n"
            "• Container: A running instance of an image\n"
            "• Registry:  Where images are stored (Docker Hub, ECR)\n\n"
            "Essential Dockerfile for a Python FastAPI app:\n"
            "  FROM python:3.11-slim\n"
            "  WORKDIR /app\n"
            "  COPY requirements.txt .\n"
            "  RUN pip install -r requirements.txt\n"
            "  COPY . .\n"
            "  CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\n"
            "Common commands:\n"
            "  docker build -t myapp .          # Build image\n"
            "  docker run -p 8000:8000 myapp    # Run container\n"
            "  docker ps                        # List running containers\n"
            "  docker exec -it <id> bash        # Shell into container\n"
            "  docker logs <id>                 # View logs\n\n"
            "Docker Compose (multi-container):\n"
            "  services:\n"
            "    app:\n"
            "      build: .\n"
            "      ports: ['8000:8000']\n"
            "      depends_on: [db]\n"
            "    db:\n"
            "      image: postgres:15\n"
            "      environment:\n"
            "        POSTGRES_DB: mydb\n"
            "        POSTGRES_PASSWORD: secret\n\n"
            "Best practices:\n"
            "• Use .dockerignore to exclude node_modules, .env, __pycache__\n"
            "• Use multi-stage builds to keep images small\n"
            "• Never copy .env into the image — use environment variables"
        ),
        "sources": [
            {"label": "Docker Official Docs",            "url": "https://docs.docker.com/get-started"},
            {"label": "Play with Docker (free)",         "url": "https://labs.play-with-docker.com"},
            {"label": "Docker Compose Reference",        "url": "https://docs.docker.com/compose/compose-file"},
        ],
    },

    {
        "topic": "Git & Version Control",
        "category": "Backend",
        "keywords": ["git", "github", "version control", "branch", "merge", "rebase", "commit", "pull request", "conflict"],
        "answer": (
            "Git essentials every developer must know:\n\n"
            "Daily workflow commands:\n"
            "  git status                    # See changes\n"
            "  git add <file>                # Stage a file\n"
            "  git commit -m 'feat: add login API'\n"
            "  git push origin main\n"
            "  git pull origin main          # Sync with remote\n\n"
            "Branching strategy:\n"
            "  git checkout -b feature/login-page   # Create + switch\n"
            "  git merge feature/login-page         # Merge into main\n"
            "  git branch -d feature/login-page     # Delete after merge\n\n"
            "Undoing mistakes:\n"
            "  git restore <file>            # Discard unstaged changes\n"
            "  git reset HEAD~1              # Undo last commit (keep changes)\n"
            "  git revert <hash>             # Safe undo (creates new commit)\n"
            "  git stash                     # Temporarily save work\n"
            "  git stash pop                 # Restore stashed work\n\n"
            "Commit message convention (Conventional Commits):\n"
            "  feat:     New feature\n"
            "  fix:      Bug fix\n"
            "  docs:     Documentation\n"
            "  refactor: Code improvement without feature change\n"
            "  test:     Add/update tests\n"
            "  chore:    Build process, dependencies\n\n"
            "GitHub best practices:\n"
            "• Use Pull Requests (PRs) even when working alone — review your own code\n"
            "• Write meaningful PR descriptions\n"
            "• Never commit to main directly on shared repos\n"
            "• Use .gitignore for .env, node_modules, __pycache__, *.pyc"
        ),
        "sources": [
            {"label": "Pro Git Book (free)",             "url": "https://git-scm.com/book/en/v2"},
            {"label": "GitHub Skills",                   "url": "https://skills.github.com"},
            {"label": "Conventional Commits Spec",       "url": "https://conventionalcommits.org"},
        ],
    },

    {
        "topic": "Linux & Command Line",
        "category": "Backend",
        "keywords": ["linux", "bash", "terminal", "command line", "shell", "unix", "cli", "server", "chmod", "ssh"],
        "answer": (
            "Linux / Bash essentials for developers:\n\n"
            "Navigation:\n"
            "  ls -la          # List files with permissions\n"
            "  cd /path        # Change directory\n"
            "  pwd             # Print working directory\n"
            "  find . -name '*.py'  # Find files\n"
            "  grep -r 'error' .    # Search inside files\n\n"
            "File operations:\n"
            "  cp src dst      # Copy\n"
            "  mv src dst      # Move / rename\n"
            "  rm -rf dir      # Delete recursively (careful!)\n"
            "  chmod +x file   # Make executable\n"
            "  chown user file # Change owner\n\n"
            "Process management:\n"
            "  ps aux          # List all processes\n"
            "  kill -9 <pid>   # Force kill process\n"
            "  top / htop      # Real-time resource usage\n"
            "  nohup cmd &     # Run in background\n\n"
            "Network:\n"
            "  curl -X GET http://localhost:8000\n"
            "  wget <url>      # Download file\n"
            "  netstat -tlnp   # Ports in use\n"
            "  ssh user@host   # Connect to remote server\n\n"
            "Shell scripting basics:\n"
            "  #!/bin/bash\n"
            "  for f in *.py; do python $f; done\n"
            "  if [ -f file ]; then echo 'exists'; fi\n\n"
            "Useful for DevOps: journalctl (logs), systemctl (services), crontab (schedules)"
        ),
        "sources": [
            {"label": "Linux Command Cheat Sheet",       "url": "https://linuxcommand.org/lc3_learning_the_shell.php"},
            {"label": "OverTheWire Bandit (practice)",   "url": "https://overthewire.org/wargames/bandit"},
        ],
    },

    # ══════════════════════════════════════════════════════════
    # CATEGORY 4 — PROJECT TECH STACK
    # ══════════════════════════════════════════════════════════

    {
        "topic": "React & Frontend Development",
        "category": "Frontend",
        "keywords": ["react", "jsx", "hooks", "useState", "useEffect", "component", "vite", "frontend", "typescript"],
        "answer": (
            "React essentials for frontend development:\n\n"
            "Core concepts:\n"
            "• Components: function-based, return JSX\n"
            "• Props: data passed parent → child\n"
            "• State: local data that triggers re-render (useState)\n"
            "• useEffect: side effects (API calls, subscriptions, timers)\n"
            "• useRef: persist values / access DOM without re-render\n"
            "• useMemo / useCallback: performance optimisation\n\n"
            "Project setup (this project uses Vite + React 19):\n"
            "  npm create vite@latest my-app -- --template react\n"
            "  cd my-app && npm install && npm run dev\n\n"
            "React Router (v7):\n"
            "  <BrowserRouter> wraps the app\n"
            "  <Routes> contains all <Route path='/...' element={<Comp />} />\n"
            "  useNavigate() for programmatic navigation\n"
            "  useLocation() to read current route\n\n"
            "Axios (HTTP client):\n"
            "  axios.create({ baseURL }) — create instance\n"
            "  interceptors.request.use — attach auth header automatically\n"
            "  API.get('/profile') — call backend\n\n"
            "Folder structure (this project):\n"
            "  src/pages/     — full page components\n"
            "  src/components/— shared components (Sidebar, AppLayout)\n"
            "  src/api.js     — Axios instance with JWT interceptor\n"
            "  src/App.jsx    — routing + auth guards\n\n"
            "State management pattern used:\n"
            "• Local useState for page-level state\n"
            "• localStorage for persistence (prep plan, settings)\n"
            "• No Redux needed at this scale"
        ),
        "sources": [
            {"label": "React Official Docs",             "url": "https://react.dev"},
            {"label": "Vite Docs",                       "url": "https://vitejs.dev"},
            {"label": "React Router Docs",               "url": "https://reactrouter.com"},
        ],
    },

    {
        "topic": "FastAPI & SQLAlchemy",
        "category": "Backend",
        "keywords": ["fastapi", "sqlalchemy", "pydantic", "orm", "model", "schema", "dependency injection", "alembic"],
        "answer": (
            "FastAPI + SQLAlchemy pattern used in this project:\n\n"
            "Project structure:\n"
            "  main.py         — FastAPI app, all route handlers\n"
            "  models.py       — SQLAlchemy ORM models (DB tables)\n"
            "  schemas.py      — Pydantic request/response models\n"
            "  database.py     — Engine, SessionLocal, Base, get_db()\n"
            "  auth.py         — JWT creation, password hashing, get_current_user()\n\n"
            "Model → Schema → Route pattern:\n"
            "  # 1. SQLAlchemy model (database table)\n"
            "  class User(Base):\n"
            "      __tablename__ = 'users'\n"
            "      id = Column(Integer, primary_key=True)\n"
            "      email = Column(String, unique=True)\n\n"
            "  # 2. Pydantic schema (API contract)\n"
            "  class UserResponse(BaseModel):\n"
            "      id: int\n"
            "      email: str\n"
            "      class Config: from_attributes = True\n\n"
            "  # 3. Route handler\n"
            "  @app.get('/me', response_model=UserResponse)\n"
            "  def get_me(current_user = Depends(get_current_user)):\n"
            "      return current_user\n\n"
            "Database session dependency:\n"
            "  def get_db():\n"
            "      db = SessionLocal()\n"
            "      try: yield db\n"
            "      finally: db.close()\n\n"
            "Key SQLAlchemy operations:\n"
            "  db.query(User).filter(User.email == email).first()  # SELECT\n"
            "  db.add(obj); db.commit(); db.refresh(obj)           # INSERT\n"
            "  setattr(obj, 'field', value); db.commit()           # UPDATE\n"
            "  db.delete(obj); db.commit()                         # DELETE"
        ),
        "sources": [
            {"label": "FastAPI Tutorial",                "url": "https://fastapi.tiangolo.com/tutorial"},
            {"label": "SQLAlchemy ORM Docs",             "url": "https://docs.sqlalchemy.org/en/20/orm"},
            {"label": "Pydantic v2 Docs",                "url": "https://docs.pydantic.dev/latest"},
        ],
    },

    {
        "topic": "PostgreSQL & Database Management",
        "category": "Backend",
        "keywords": ["postgresql", "postgres", "psql", "pg", "database schema", "migration", "alembic", "column", "table"],
        "answer": (
            "PostgreSQL setup and management for this project:\n\n"
            "Connection (in .env):\n"
            "  DATABASE_URL=postgresql://user:password@localhost:5432/dbname\n\n"
            "psql CLI commands:\n"
            "  psql -U postgres                    # Connect\n"
            "  \\l                                  # List databases\n"
            "  \\c career_assistant                 # Switch DB\n"
            "  \\dt                                 # List tables\n"
            "  \\d student_profiles                 # Describe table\n"
            "  SELECT * FROM users LIMIT 10;       # Query\n"
            "  \\q                                  # Quit\n\n"
            "Adding missing columns (the migration pattern used in this project):\n"
            "  ALTER TABLE student_profiles\n"
            "    ADD COLUMN IF NOT EXISTS bio TEXT NULL;\n"
            "  -- IF NOT EXISTS makes it safe to re-run\n\n"
            "Useful queries for this project:\n"
            "  -- Check user and profile\n"
            "  SELECT u.id, u.email, p.education, p.skills\n"
            "  FROM users u LEFT JOIN student_profiles p ON u.id = p.user_id;\n\n"
            "  -- Check resume data\n"
            "  SELECT id, filename, status, resume_score FROM resumes;\n\n"
            "pgAdmin: GUI tool for managing PostgreSQL — recommended for beginners\n\n"
            "Backup and restore:\n"
            "  pg_dump career_assistant > backup.sql\n"
            "  psql career_assistant < backup.sql"
        ),
        "sources": [
            {"label": "PostgreSQL Docs",                 "url": "https://postgresql.org/docs/current"},
            {"label": "pgAdmin (GUI)",                   "url": "https://pgadmin.org"},
            {"label": "SQLAlchemy + Alembic Migrations", "url": "https://alembic.sqlalchemy.org/en/latest/tutorial.html"},
        ],
    },

    # ══════════════════════════════════════════════════════════
    # CATEGORY 5 — FOUNDATIONAL CS
    # ══════════════════════════════════════════════════════════

    {
        "topic": "DSA — Data Structures",
        "category": "CS Fundamentals",
        "keywords": ["dsa", "data structure", "array", "linked list", "tree", "graph", "heap", "hash", "stack", "queue", "trie"],
        "answer": (
            "Complete Data Structures reference:\n\n"
            "Linear:\n"
            "• Array:        O(1) access, O(n) insert/delete; use for indexed data\n"
            "• Linked List:  O(1) insert/delete at head, O(n) access; use for frequent insert/delete\n"
            "• Stack:        LIFO — push/pop O(1); use for parenthesis, undo, DFS\n"
            "• Queue:        FIFO — enqueue/dequeue O(1); use for BFS, scheduling\n"
            "• Deque:        Double-ended queue; use for sliding window problems\n\n"
            "Non-linear:\n"
            "• Binary Tree:  Each node has at most 2 children; use for hierarchy data\n"
            "• BST:          Left < root < right; O(log n) average search\n"
            "• Heap (Min/Max): Complete binary tree; O(1) min/max, O(log n) insert\n"
            "• Hash Map:     O(1) average insert/search/delete; use for frequency, caching\n"
            "• Graph:        Nodes + edges; directed/undirected, weighted/unweighted\n"
            "• Trie:         Tree for strings; O(L) search where L = word length; use for autocomplete\n\n"
            "Interview pattern → data structure mapping:\n"
            "• 'Find duplicates'          → Hash Set\n"
            "• 'Find k-th largest'        → Min Heap\n"
            "• 'Shortest path (unweighted)' → BFS (queue)\n"
            "• 'Balanced parentheses'     → Stack\n"
            "• 'Autocomplete / prefix'    → Trie\n"
            "• 'Range queries on sorted'  → Binary Search"
        ),
        "sources": [
            {"label": "Visualgo — Algorithm Visualiser",  "url": "https://visualgo.net"},
            {"label": "NeetCode — Structured Practice",   "url": "https://neetcode.io"},
            {"label": "GeeksforGeeks — DS",              "url": "https://geeksforgeeks.org/data-structures"},
        ],
    },

    {
        "topic": "DSA — Algorithms",
        "category": "CS Fundamentals",
        "keywords": ["algorithm", "sorting", "binary search", "two pointer", "sliding window", "dynamic programming", "greedy", "dp", "recursion", "backtracking"],
        "answer": (
            "Algorithm patterns every developer must know:\n\n"
            "Sorting (know TC for all):\n"
            "• Merge Sort:  O(n log n) time, O(n) space — stable, divide & conquer\n"
            "• Quick Sort:  O(n log n) avg, O(n²) worst — in-place\n"
            "• Heap Sort:   O(n log n) always — in-place, not stable\n"
            "• Counting Sort: O(n+k) — use when range is small\n\n"
            "Key patterns:\n"
            "• Two Pointer: Use on sorted arrays — find pair with sum, remove duplicates\n"
            "• Sliding Window: Subarray/substring problems — fixed or variable window\n"
            "• Binary Search: O(log n) on sorted arrays; also 'search on answer' pattern\n"
            "• BFS: Shortest path in unweighted graphs, level-order tree traversal\n"
            "• DFS: Path finding, cycle detection, topological sort\n"
            "• Greedy: Make locally optimal choice at each step — activity selection, coin change (specific)\n"
            "• Dynamic Programming: Overlapping subproblems + optimal substructure\n"
            "  Start with memoisation (top-down), convert to tabulation (bottom-up)\n\n"
            "Top DP problems to master:\n"
            "1. Fibonacci (memoised)\n"
            "2. 0/1 Knapsack\n"
            "3. Longest Common Subsequence\n"
            "4. Longest Increasing Subsequence\n"
            "5. Coin Change\n"
            "6. Edit Distance\n"
            "7. Matrix Chain Multiplication"
        ),
        "sources": [
            {"label": "NeetCode 150 — Algorithm Practice", "url": "https://neetcode.io/practice"},
            {"label": "CP Algorithms",                     "url": "https://cp-algorithms.com"},
            {"label": "CLRS Algorithms Textbook",          "url": "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms"},
        ],
    },

    {
        "topic": "Object Oriented Programming",
        "category": "CS Fundamentals",
        "keywords": ["oop", "object oriented", "class", "inheritance", "polymorphism", "encapsulation", "abstraction", "solid", "design pattern"],
        "answer": (
            "OOP concepts for interviews:\n\n"
            "The 4 Pillars:\n"
            "1. Encapsulation:  Bundle data + methods in a class; hide internal state\n"
            "   → Use private attributes + getter/setter methods\n\n"
            "2. Abstraction:    Expose only what the user needs; hide implementation\n"
            "   → Abstract classes, interfaces (Java), ABC (Python)\n\n"
            "3. Inheritance:    Child class inherits parent's properties/methods\n"
            "   → Promotes code reuse; supports 'is-a' relationships\n"
            "   → Prefer composition over inheritance for flexibility\n\n"
            "4. Polymorphism:   Same method name, different behaviour\n"
            "   → Method overriding (runtime), method overloading (compile-time in Java)\n\n"
            "SOLID Principles:\n"
            "S — Single Responsibility: One class, one reason to change\n"
            "O — Open/Closed:           Open for extension, closed for modification\n"
            "L — Liskov Substitution:   Subclass can replace its parent without breaking code\n"
            "I — Interface Segregation: Many specific interfaces > one general interface\n"
            "D — Dependency Inversion:  Depend on abstractions, not concrete classes\n\n"
            "Common Design Patterns:\n"
            "• Singleton:   Only one instance (e.g., DB connection)\n"
            "• Factory:     Create objects without specifying exact class\n"
            "• Observer:    Subscribe to events (e.g., React state, webhooks)\n"
            "• Strategy:    Swap algorithm at runtime (e.g., sort strategy)\n"
            "• Decorator:   Add behaviour without modifying class (e.g., Python @decorator)"
        ),
        "sources": [
            {"label": "Refactoring Guru — Design Patterns", "url": "https://refactoring.guru/design-patterns"},
            {"label": "SOLID Explained Simply",             "url": "https://digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design"},
        ],
    },

    {
        "topic": "OS & System Concepts",
        "category": "CS Fundamentals",
        "keywords": ["operating system", "os", "process", "thread", "deadlock", "memory", "virtual memory", "scheduling", "concurrency", "mutex", "semaphore"],
        "answer": (
            "Operating Systems concepts for interviews:\n\n"
            "Process vs Thread:\n"
            "• Process: Independent execution unit with its own memory space\n"
            "• Thread:  Lightweight unit within a process; shares memory\n"
            "• Context switch: OS saves/restores state when switching between processes\n\n"
            "Concurrency issues:\n"
            "• Race condition:  Two threads access shared data simultaneously → undefined result\n"
            "• Deadlock:        Two processes each waiting for the other to release a resource\n"
            "  → Prevent with: lock ordering, timeouts, banker's algorithm\n"
            "• Mutex:           Only one thread at a time (mutual exclusion)\n"
            "• Semaphore:       Counter-based; allows N threads simultaneously\n\n"
            "Memory management:\n"
            "• Stack:  Function call frames, local variables (LIFO, auto-managed)\n"
            "• Heap:   Dynamic memory allocation (manual in C, GC in Python/Java)\n"
            "• Virtual memory: Illusion of large memory using disk paging\n"
            "• Page fault:     Requested page not in RAM → load from disk\n\n"
            "CPU scheduling algorithms:\n"
            "• FCFS, SJF, Round Robin, Priority Scheduling\n\n"
            "Common interview questions:\n"
            "• What happens when you run a program?\n"
            "• Explain paging and segmentation\n"
            "• How does Python manage memory? (reference counting + GC)\n"
            "• What is a context switch overhead?"
        ),
        "sources": [
            {"label": "OS Concepts — OSTEP (free book)", "url": "https://pages.cs.wisc.edu/~remzi/OSTEP"},
            {"label": "GeeksforGeeks — OS",             "url": "https://geeksforgeeks.org/operating-systems"},
        ],
    },

    {
        "topic": "Computer Networking",
        "category": "CS Fundamentals",
        "keywords": ["networking", "tcp", "udp", "http", "https", "dns", "osi", "ip", "socket", "network", "protocol", "latency", "bandwidth"],
        "answer": (
            "Computer Networking essentials for interviews:\n\n"
            "OSI Model (7 layers — remember top-down):\n"
            "7. Application  — HTTP, FTP, DNS, SMTP (what users interact with)\n"
            "6. Presentation — Encryption, compression (SSL/TLS)\n"
            "5. Session      — Session management\n"
            "4. Transport    — TCP (reliable), UDP (fast), ports\n"
            "3. Network      — IP addressing, routing\n"
            "2. Data Link    — MAC addresses, switches\n"
            "1. Physical     — Cables, radio waves\n\n"
            "TCP vs UDP:\n"
            "• TCP: Connection-oriented, reliable, ordered, slower — use for HTTP, email, file transfer\n"
            "• UDP: Connectionless, unreliable, faster — use for video streaming, gaming, DNS\n\n"
            "HTTP/HTTPS:\n"
            "• HTTP: Stateless application protocol; request/response model\n"
            "• HTTPS: HTTP + TLS encryption — protects data in transit\n"
            "• HTTP/2: Multiplexing, header compression, server push\n"
            "• HTTP/3: Built on QUIC (UDP-based) — lower latency\n\n"
            "DNS (Domain Name System):\n"
            "• Translates domain names → IP addresses\n"
            "• Resolution order: browser cache → OS cache → recursive resolver → root nameserver\n\n"
            "What happens when you type a URL:\n"
            "1. DNS lookup → IP address\n"
            "2. TCP handshake (SYN → SYN-ACK → ACK)\n"
            "3. TLS handshake (for HTTPS)\n"
            "4. HTTP GET request\n"
            "5. Server returns HTML\n"
            "6. Browser parses HTML, fetches CSS/JS, renders page"
        ),
        "sources": [
            {"label": "Computer Networking — Top-Down (free slides)", "url": "https://gaia.cs.umass.edu/kurose_ross/index.php"},
            {"label": "How DNS works — Cloudflare",                   "url": "https://cloudflare.com/en-gb/learning/dns/what-is-dns"},
        ],
    },

    # ══════════════════════════════════════════════════════════
    # CATEGORY 6 — CAREER STRATEGY
    # ══════════════════════════════════════════════════════════

    {
        "topic": "Resume",
        "category": "Resume",
        "keywords": ["resume", "cv", "ats", "format", "bullet", "action verb", "one page", "resume tips"],
        "answer": (
            "Building an ATS-friendly placement resume:\n\n"
            "Format rules:\n"
            "• Single column, no tables or graphics\n"
            "• Font: Calibri / Arial / Roboto, 10–11pt\n"
            "• 1 page for freshers\n"
            "• Save as PDF\n\n"
            "Sections (in order):\n"
            "1. Name + Contact (email, phone, LinkedIn, GitHub)\n"
            "2. Professional Summary (3 lines)\n"
            "3. Technical Skills (Languages | Frameworks | Databases | Tools)\n"
            "4. Projects (2–3 projects with tech stack + impact)\n"
            "5. Experience / Internships\n"
            "6. Education\n"
            "7. Certifications\n"
            "8. Achievements\n\n"
            "Bullet formula:\n"
            "[Action verb] + [What you built] + [Measurable result]\n"
            "Example: 'Reduced API response time by 40% through Redis caching'\n\n"
            "ATS tips:\n"
            "• Mirror keywords from job description\n"
            "• Use standard headings\n"
            "• No headers/footers — ATS may skip them"
        ),
        "sources": [
            {"label": "ATS Resume Checker — Jobscan",    "url": "https://jobscan.co"},
            {"label": "Resume Worded — Feedback",        "url": "https://resumeworded.com"},
        ],
    },

    {
        "topic": "DSA",
        "category": "CS Fundamentals",
        "keywords": ["dsa", "data structure", "algorithm", "leetcode", "coding", "neetcode", "competitive"],
        "answer": (
            "DSA preparation strategy:\n"
            "• Start with NeetCode 150 — best curated problem set\n"
            "• Master first: Arrays, Hash Maps, Two Pointer, Sliding Window, Binary Search\n"
            "• Then: Trees, Graphs (BFS/DFS), Heap, DP\n"
            "• Practice timed: 20 min easy / 30 min medium / 45 min hard\n"
            "• Analyse TC/SC after every problem\n"
            "• Review wrong answers within 24 hours\n"
            "• Re-do failed problems after 1 week"
        ),
        "sources": [
            {"label": "NeetCode 150",           "url": "https://neetcode.io"},
            {"label": "Striver's DSA Sheet",    "url": "https://takeuforward.org/strivers-a2z-dsa-course"},
            {"label": "LeetCode",               "url": "https://leetcode.com"},
        ],
    },

    {
        "topic": "System Design",
        "category": "CS Fundamentals",
        "keywords": ["system design", "scalability", "distributed", "architecture", "hld", "lld"],
        "answer": (
            "System Design interview in 5 steps:\n"
            "1. Clarify requirements (functional + non-functional)\n"
            "2. Estimate scale (DAU, QPS, storage)\n"
            "3. High-level architecture (client → API → DB → cache → CDN)\n"
            "4. Deep dive into components\n"
            "5. Address bottlenecks and trade-offs\n\n"
            "Must-practice: URL shortener, Twitter feed, rate limiter, notification system, ride-share\n"
            "Key concepts: horizontal scaling, consistent hashing, SQL vs NoSQL, CAP theorem, message queues"
        ),
        "sources": [
            {"label": "System Design Primer",   "url": "https://github.com/donnemartin/system-design-primer"},
            {"label": "ByteByteGo Blog",        "url": "https://blog.bytebytego.com"},
        ],
    },

    {
        "topic": "Interview",
        "category": "Interview",
        "keywords": ["interview", "mock", "hr", "behavioural", "behavioral", "star", "round"],
        "answer": (
            "Complete interview strategy:\n\n"
            "Technical Round:\n"
            "• Solve 2 LeetCode problems daily for 6 weeks\n"
            "• Practice coding out loud — interviewers assess communication\n"
            "• Always state TC/SC for every solution\n\n"
            "HR Round (STAR Method):\n"
            "• S — Situation, T — Task, A — Action, R — Result\n"
            "• Prepare 8–10 STAR stories: failure, conflict, leadership, tight deadline\n\n"
            "Day of interview:\n"
            "• Clarify constraints before coding\n"
            "• Start with brute force, then optimise\n"
            "• Test with examples before submitting"
        ),
        "sources": [
            {"label": "Pramp — Free Mock Interviews",   "url": "https://pramp.com"},
            {"label": "STAR Method — Indeed",           "url": "https://indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique"},
        ],
    },

    {
        "topic": "Salary",
        "category": "Career",
        "keywords": ["salary", "negotiate", "negotiation", "ctc", "lpa", "offer", "package", "hike", "stipend"],
        "answer": (
            "Salary negotiation guide:\n"
            "• Research: Glassdoor, Levels.fyi, AmbitionBox, LinkedIn Salary\n"
            "• Never give the first number\n"
            "• Counter 10–20% above their offer\n"
            "• Negotiate the full package: base, bonus, ESOPs, joining bonus, WFH policy\n"
            "• Get everything in writing before accepting\n"
            "• Ask for 2–3 days to decide — perfectly normal\n"
            "• Companies expect negotiation — asking never costs you the offer"
        ),
        "sources": [
            {"label": "Levels.fyi",      "url": "https://levels.fyi"},
            {"label": "AmbitionBox",     "url": "https://ambitionbox.com"},
            {"label": "Glassdoor India", "url": "https://glassdoor.co.in/Salaries"},
        ],
    },

    {
        "topic": "Skills",
        "category": "Career",
        "keywords": ["skill", "learn", "upskill", "roadmap", "python", "react", "cloud", "devops"],
        "answer": (
            "High-demand skills for software roles in 2026:\n\n"
            "Core (all developers):\n"
            "• DSA + System Design\n"
            "• SQL + one NoSQL DB\n"
            "• Git + REST API design\n\n"
            "Frontend: React, TypeScript, CSS, Web Performance\n"
            "Backend:  Python/Node.js, FastAPI/Express, PostgreSQL, Redis, Docker\n"
            "Cloud:    AWS fundamentals (EC2, S3, RDS, Lambda)\n"
            "AI/ML:    Python, Pandas, Scikit-learn, PyTorch, LLM APIs\n\n"
            "Fastest growing in 2026: TypeScript, Rust, LLM prompt engineering, Kubernetes"
        ),
        "sources": [
            {"label": "roadmap.sh",              "url": "https://roadmap.sh"},
            {"label": "The Odin Project (free)", "url": "https://theodinproject.com"},
        ],
    },

    {
        "topic": "Placement",
        "category": "Career",
        "keywords": ["placement", "campus", "off-campus", "job search", "fresher", "2025", "2026"],
        "answer": (
            "Placement strategy for freshers (2025–2026):\n\n"
            "6 months before:\n"
            "1. Finalise target role (SDE / DA / DevOps)\n"
            "2. Resume: 1 page, ATS-friendly\n"
            "3. DSA: 100+ problems minimum\n"
            "4. Build 2–3 projects with GitHub + live demo\n\n"
            "3 months before:\n"
            "5. Apply: LinkedIn, Naukri, Instahyre, company portals\n"
            "6. Mock interviews: 2/week minimum\n"
            "7. Research each company before every round\n\n"
            "Day before interview:\n"
            "8. Revise resume line by line\n"
            "9. Prepare STAR stories\n"
            "10. Sleep early"
        ),
        "sources": [
            {"label": "LinkedIn Jobs",  "url": "https://linkedin.com/jobs"},
            {"label": "Naukri.com",     "url": "https://naukri.com"},
            {"label": "Instahyre",      "url": "https://instahyre.com"},
        ],
    },

    {
        "topic": "Study Plan",
        "category": "Career",
        "keywords": ["study plan", "preparation plan", "schedule", "week", "4 week", "plan", "timetable"],
        "answer": (
            "12-week placement preparation plan:\n\n"
            "Week 1–3:   DSA Foundations\n"
            "  Arrays, Strings, Linked Lists, Stacks, Queues, Hash Maps\n\n"
            "Week 4–6:   Algorithms\n"
            "  Sorting, Binary Search, Two Pointer, Sliding Window, Recursion\n\n"
            "Week 7–8:   Advanced DSA\n"
            "  Trees, Graphs, Heaps, Dynamic Programming\n\n"
            "Week 9–10:  System Design\n"
            "  HLD, Scalability, Caching, Databases, 5 core designs\n\n"
            "Week 11–12: Interview Readiness\n"
            "  STAR stories, mock interviews, company research, resume polish\n\n"
            "Daily: 2–3 hr DSA + 30 min review + 30 min theory"
        ),
        "sources": [
            {"label": "NeetCode Roadmap",        "url": "https://neetcode.io/roadmap"},
            {"label": "Striver's SDE Sheet",     "url": "https://takeuforward.org"},
        ],
    },

    {
        "topic": "Career Switch",
        "category": "Career",
        "keywords": ["career switch", "career change", "transition", "change role", "new field"],
        "answer": (
            "Switching careers or roles:\n\n"
            "Step 1: Define your target role precisely\n"
            "Step 2: Identify skill gaps (use the Skill Gap page)\n"
            "Step 3: Build a transition portfolio\n"
            "  • 1–2 projects in the new domain\n"
            "  • Relevant certifications (AWS, Google, Meta)\n"
            "Step 4: Update LinkedIn headline to target role\n"
            "Step 5: Network — 70% of roles are filled via referrals\n"
            "Step 6: Prepare a positive 'why switch' narrative\n"
            "Step 7: Target companies that value cross-functional backgrounds"
        ),
        "sources": [
            {"label": "LinkedIn Learning",  "url": "https://learning.linkedin.com"},
            {"label": "Coursera Careers",   "url": "https://coursera.org"},
        ],
    },

    {
        "topic": "Open Source Contribution",
        "category": "Career",
        "keywords": ["open source", "contribute", "github contribution", "pull request", "open source project", "hacktoberfest", "gsoc"],
        "answer": (
            "How to start contributing to open source:\n\n"
            "Why it matters:\n"
            "• Real-world codebase experience beyond college projects\n"
            "• Signals initiative and coding ability to recruiters\n"
            "• Builds your GitHub profile (green squares count)\n"
            "• Networking with professionals globally\n\n"
            "Where to start (beginner-friendly):\n"
            "1. GitHub's good-first-issue label: github.com/explore/topics/good-first-issue\n"
            "2. Up For Grabs: up-for-grabs.net\n"
            "3. CodeTriage: codetriage.com\n"
            "4. First Contributions: firstcontributions.github.io\n\n"
            "Contribution workflow:\n"
            "1. Fork the repo\n"
            "2. Clone your fork locally\n"
            "3. Create a branch: git checkout -b fix/typo-in-readme\n"
            "4. Make your change + commit with meaningful message\n"
            "5. Push and open a Pull Request\n"
            "6. Respond to reviewer comments\n\n"
            "Programs to participate in:\n"
            "• Hacktoberfest (October — free T-shirt for 4 PRs)\n"
            "• Google Summer of Code (GSoC) — paid internship\n"
            "• GirlScript Summer of Code (GSSoC)\n"
            "• MLH Fellowship"
        ),
        "sources": [
            {"label": "First Contributions (tutorial)", "url": "https://firstcontributions.github.io"},
            {"label": "GitHub Explore — Good First Issues", "url": "https://github.com/explore/topics/good-first-issue"},
            {"label": "GSoC Official",                  "url": "https://summerofcode.withgoogle.com"},
        ],
    },

    {
        "topic": "Certifications",
        "category": "Career",
        "keywords": ["certification", "certify", "aws certification", "google cert", "cloud cert", "meta cert", "certificate course"],
        "answer": (
            "High-value certifications for software roles:\n\n"
            "Cloud (most in demand):\n"
            "• AWS Cloud Practitioner (entry level, 2–4 weeks prep)\n"
            "• AWS Solutions Architect – Associate (3–6 months prep)\n"
            "• Google Associate Cloud Engineer\n"
            "• Microsoft AZ-900 (Azure Fundamentals)\n\n"
            "Development:\n"
            "• Meta Front-End Developer Certificate (Coursera)\n"
            "• Meta Back-End Developer Certificate (Coursera)\n"
            "• Google Data Analytics Certificate\n"
            "• IBM Data Science Professional Certificate\n\n"
            "DevOps:\n"
            "• Docker Certified Associate\n"
            "• Certified Kubernetes Administrator (CKA)\n"
            "• HashiCorp Terraform Associate\n\n"
            "AI / ML:\n"
            "• TensorFlow Developer Certificate\n"
            "• DeepLearning.AI Specialisation (Coursera)\n"
            "• Hugging Face NLP Course (free)\n\n"
            "Free options:\n"
            "• AWS Skill Builder (free tier)\n"
            "• Google Cloud Skills Boost (free quests)\n"
            "• freeCodeCamp certifications\n"
            "• NPTEL certifications (IIT-backed, widely recognised in India)"
        ),
        "sources": [
            {"label": "AWS Skill Builder",              "url": "https://skillbuilder.aws"},
            {"label": "Coursera Professional Certs",    "url": "https://coursera.org/professional-certificates"},
            {"label": "NPTEL Online Courses",           "url": "https://nptel.ac.in"},
            {"label": "freeCodeCamp",                   "url": "https://freecodecamp.org/learn"},
        ],
    },

    {
        "topic": "Freelancing & Remote Work",
        "category": "Career",
        "keywords": ["freelance", "freelancing", "remote work", "upwork", "fiverr", "contract", "gig", "work from home"],
        "answer": (
            "Getting started with freelancing as a developer:\n\n"
            "Platforms to find work:\n"
            "• Upwork: Best for long-term contracts (web, backend, AI projects)\n"
            "• Fiverr: Good for one-time gigs (small websites, APIs, automation)\n"
            "• Toptal: High-paying but very selective (top 3% of applicants)\n"
            "• Freelancer.in: India-focused, lower competition\n"
            "• LinkedIn: Direct outreach to startups needing part-time devs\n\n"
            "Building your freelancer profile:\n"
            "1. Pick a niche: 'Full Stack (React + FastAPI)' or 'Python Data Automation'\n"
            "2. Build 2–3 portfolio projects and deploy them live\n"
            "3. Write a clear profile with your stack and what problems you solve\n"
            "4. Start with lower rates to get initial reviews, then increase\n\n"
            "High-demand freelance skills in 2026:\n"
            "• React + Next.js web apps\n"
            "• Python automation and scraping\n"
            "• FastAPI / Django REST backends\n"
            "• LLM integrations (ChatGPT API, Ollama)\n"
            "• Mobile apps (React Native, Flutter)\n\n"
            "Tax and legal in India:\n"
            "• Income above ₹2.5L per year is taxable\n"
            "• File ITR-4 (presumptive taxation for freelancers)\n"
            "• Consider registering as a sole proprietor for larger contracts"
        ),
        "sources": [
            {"label": "Upwork",                         "url": "https://upwork.com"},
            {"label": "Toptal",                         "url": "https://toptal.com"},
            {"label": "Fiverr",                         "url": "https://fiverr.com"},
        ],
    },
]

# ─────────────────────────────────────────────────────────────
# KB METADATA (for the /ai/knowledge-base endpoint)
# ─────────────────────────────────────────────────────────────
KB_CATEGORIES = sorted(list(set(e["category"] for e in KB)))
KB_TOPICS = [{"topic": e["topic"], "category": e["category"], "keywords": e["keywords"]} for e in KB]


# ─────────────────────────────────────────────────────────────
# DOMAIN GUARD
# ─────────────────────────────────────────────────────────────

def is_career_question(message: str) -> bool:
    msg = message.lower()
    for signal in OFF_TOPIC_SIGNALS:
        if signal in msg:
            return False
    for kw in CAREER_KEYWORDS:
        if kw in msg:
            return True
    greetings = ["hi","hello","hey","thanks","thank you","ok","okay","sure","yes","no","what can you do","help"]
    stripped = msg.strip().rstrip("!.?")
    if stripped in greetings or len(msg.split()) <= 3:
        return True
    return False


# ─────────────────────────────────────────────────────────────
# VECTOR MATCH
# ─────────────────────────────────────────────────────────────

def vector_match(message: str) -> Optional[Dict[str, Any]]:
    msg = message.lower()
    best_score = 0
    best_entry = None
    for entry in KB:
        score = sum(1 for kw in entry["keywords"] if kw in msg)
        if score > best_score:
            best_score = score
            best_entry = entry
    return best_entry if best_score >= 1 else None


# ─────────────────────────────────────────────────────────────
# TOPIC DETECTOR
# ─────────────────────────────────────────────────────────────

def detect_topic(message: str) -> str:
    msg = message.lower()
    checks = [
        ("Resume Building",          ["resume", "cv", "ats", "build resume", "resume format"]),
        ("Cover Letter",             ["cover letter", "covering letter"]),
        ("LinkedIn Profile",         ["linkedin"]),
        ("Resume Projects Section",  ["project section", "project resume", "how to write project"]),
        ("Technical Interview",      ["technical interview", "coding round", "oa", "online assessment", "hackerrank"]),
        ("HR Interview",             ["hr interview", "hr round", "behavioural", "behavioral", "star method", "tell me about yourself"]),
        ("Interview Preparation",    ["interview preparation", "prepare for interview", "how to crack"]),
        ("System Design Interview",  ["system design interview", "hld", "lld", "design interview"]),
        ("Aptitude & Logical Reasoning", ["aptitude", "logical reasoning", "verbal ability", "quant"]),
        ("DSA — Algorithms",         ["algorithm", "sorting", "binary search", "two pointer", "sliding window", "dp", "dynamic programming", "backtracking"]),
        ("DSA — Data Structures",    ["data structure", "array", "linked list", "tree", "graph", "heap", "trie"]),
        ("DSA",                      ["dsa", "leetcode", "neetcode", "competitive"]),
        ("System Design",            ["system design", "scalability", "distributed", "architecture"]),
        ("Python Backend Development", ["python", "fastapi", "django", "flask", "backend"]),
        ("REST APIs",                ["rest api", "api design", "http", "endpoint", "postman"]),
        ("Databases & SQL",          ["database", "sql", "postgresql", "mysql", "mongodb", "nosql", "query", "join"]),
        ("Authentication & Authorization", ["authentication", "jwt", "token", "oauth", "login", "password", "bcrypt"]),
        ("Docker & Containerisation",["docker", "container", "dockerfile"]),
        ("Git & Version Control",    ["git", "github", "version control", "branch", "commit", "pull request"]),
        ("Linux & Command Line",     ["linux", "bash", "terminal", "command line", "shell", "ssh"]),
        ("React & Frontend Development", ["react", "jsx", "hooks", "vite", "frontend", "typescript"]),
        ("FastAPI & SQLAlchemy",     ["fastapi", "sqlalchemy", "pydantic", "orm", "dependency injection"]),
        ("PostgreSQL & Database Management", ["postgresql", "psql", "pgadmin", "migration", "alembic"]),
        ("Object Oriented Programming", ["oop", "object oriented", "class", "inheritance", "polymorphism", "solid"]),
        ("OS & System Concepts",     ["operating system", "os", "process", "thread", "deadlock", "memory"]),
        ("Computer Networking",      ["networking", "tcp", "udp", "dns", "osi", "http", "https", "socket"]),
        ("Open Source Contribution", ["open source", "contribute", "pull request", "hacktoberfest", "gsoc"]),
        ("Certifications",           ["certification", "certify", "aws cert", "google cert", "nptel"]),
        ("Freelancing & Remote Work",["freelance", "freelancing", "upwork", "fiverr", "remote work"]),
        ("Salary",                   ["salary", "negotiate", "ctc", "lpa", "offer", "package"]),
        ("Placement",                ["placement", "campus", "off-campus", "fresher"]),
        ("Study Plan",               ["study plan", "preparation plan", "schedule", "week"]),
        ("Career Switch",            ["switch", "transition", "career change"]),
        ("Skills",                   ["skill", "learn", "upskill", "roadmap"]),
    ]
    for topic, kws in checks:
        if any(k in msg for k in kws):
            return topic
    return "Career"


# ─────────────────────────────────────────────────────────────
# BUILD SYSTEM PROMPT
# ─────────────────────────────────────────────────────────────

def build_system_prompt(user_context: Dict[str, Any]) -> str:
    ctx_parts = []
    if user_context.get("name"):            ctx_parts.append(f"User's name: {user_context['name']}.")
    if user_context.get("education"):       ctx_parts.append(f"Education: {user_context['education']}.")
    if user_context.get("branch"):          ctx_parts.append(f"Branch: {user_context['branch']}.")
    if user_context.get("graduation_year"): ctx_parts.append(f"Graduation year: {user_context['graduation_year']}.")
    if user_context.get("preferred_role"):  ctx_parts.append(f"Target role: {user_context['preferred_role']}.")
    if user_context.get("experience_level"): ctx_parts.append(f"Experience: {user_context['experience_level']}.")
    if user_context.get("skills"):
        skills_preview = ", ".join(user_context["skills"].split(",")[:8])
        ctx_parts.append(f"Current skills: {skills_preview}.")
    if user_context.get("location"):        ctx_parts.append(f"Location: {user_context['location']}.")
    user_context_str = " ".join(ctx_parts) if ctx_parts else "No profile details provided."

    topics_covered = ", ".join([
        "resume writing", "cover letter", "LinkedIn profile", "interview preparation",
        "technical interview", "HR interview", "system design", "aptitude tests",
        "DSA (data structures & algorithms)", "backend development (Python/FastAPI/Node.js)",
        "databases (SQL/PostgreSQL/MongoDB)", "authentication (JWT/OAuth)",
        "Docker & containerisation", "Git & version control", "Linux & command line",
        "React & frontend development", "FastAPI & SQLAlchemy", "PostgreSQL",
        "OOP & design patterns", "OS concepts", "computer networking",
        "open source contribution", "certifications", "freelancing & remote work",
        "salary negotiation", "campus placement", "study plans", "career switching",
        "skill development roadmaps",
    ])

    return f"""You are an expert AI Career Assistant for a placement preparation platform used by students and early-career professionals in India.

USER PROFILE:
{user_context_str}

YOUR KNOWLEDGE COVERS:
{topics_covered}

YOUR ROLE:
- Answer ONLY career-related questions. You are an expert in all topics listed above.
- If the user asks about anything unrelated to careers (food, movies, sports, politics, relationships, medical advice, legal advice, cryptocurrency), respond with exactly: "I can only help with career-related questions. Please ask me about your job search, resume, interview preparation, or skill development."
- Personalise answers using the user's profile when relevant. For example, if they are a CSE student targeting SDE roles, tailor your DSA and system design advice accordingly.
- Be specific, practical, and actionable. Avoid vague generic advice.
- Use bullet points for lists. Keep answers under 500 words unless the user asks for a detailed breakdown.
- When mentioning resources, provide actual URLs.
- Do NOT invent companies, salary figures, or statistics.
- Respond in plain text with line breaks and bullet points. No markdown headers or bold syntax.

IMPORTANT: You are knowledgeable about this specific project's tech stack:
- Frontend: React 19 + Vite + React Router 7 + Axios
- Backend:  FastAPI + SQLAlchemy + Pydantic v2 + Uvicorn
- Database: PostgreSQL with psycopg2
- Auth:     JWT (python-jose) + bcrypt (passlib)
- AI:       Ollama (llama3.2) for resume analysis and this chat
- Deployment: Docker (planned)
If the user asks how something works in this project, answer with project-specific details."""


# ─────────────────────────────────────────────────────────────
# CALL OLLAMA
# ─────────────────────────────────────────────────────────────

def call_ollama_chat(
    system_prompt: str,
    history: List[Dict[str, str]],
    user_message: str,
) -> str:
    prompt_parts = [f"<<SYS>>\n{system_prompt}\n<</SYS>>\n\n"]
    for turn in history[-6:]:
        role = turn.get("role", "user")
        text = turn.get("content", "")
        if role == "user":
            prompt_parts.append(f"User: {text}\n")
        else:
            prompt_parts.append(f"Assistant: {text}\n")
    prompt_parts.append(f"User: {user_message}\nAssistant:")
    full_prompt = "".join(prompt_parts)

    payload = json.dumps({
        "model": OLLAMA_MODEL,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
            "num_predict": 700,
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        OLLAMA_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        raw = resp.read().decode("utf-8")
        result = json.loads(raw)
        response_text = result.get("response", "").strip()
        if not response_text:
            raise ValueError("Ollama returned empty response.")
        return response_text


# ─────────────────────────────────────────────────────────────
# MAIN CHAT FUNCTION
# ─────────────────────────────────────────────────────────────

def chat(
    message: str,
    history: List[Dict[str, str]],
    user_context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    user_context = user_context or {}
    topic = detect_topic(message)

    # Domain guard
    if not is_career_question(message):
        return {
            "answer": (
                "I'm specialised in career guidance and can only help with topics like "
                "resume writing, interview preparation, DSA, system design, backend development, "
                "skill development, and placement strategy.\n\n"
                "Please ask me a career-related question!"
            ),
            "topic": "Off-Topic",
            "confidence": 1.0,
            "sources": [],
            "is_career_related": False,
            "ai_powered": False,
            "model": None,
        }

    # Try Ollama LLM
    try:
        system_prompt = build_system_prompt(user_context)
        answer = call_ollama_chat(system_prompt, history, message)
        is_career = "I can only help with career" not in answer
        kb_entry = vector_match(message)
        sources = kb_entry["sources"] if kb_entry else []
        return {
            "answer": answer,
            "topic": topic,
            "confidence": 0.95,
            "sources": sources,
            "is_career_related": is_career,
            "ai_powered": True,
            "model": OLLAMA_MODEL,
        }
    except Exception as err:
        print(f"[AI Assistant] Ollama unavailable: {err}")

    # Vector KB fallback
    kb_entry = vector_match(message)
    if kb_entry:
        return {
            "answer": (
                kb_entry["answer"] +
                "\n\n(Note: This is a pre-written response from the knowledge base. "
                "Start Ollama with llama3.2 for live AI-powered personalised answers.)"
            ),
            "topic": kb_entry["topic"],
            "confidence": 0.80,
            "sources": kb_entry["sources"],
            "is_career_related": True,
            "ai_powered": False,
            "model": None,
        }

    # Generic fallback
    return {
        "answer": (
            "I can help you with:\n"
            "• Resume writing and ATS optimisation\n"
            "• Interview preparation (technical, HR, aptitude)\n"
            "• DSA and system design\n"
            "• Backend development (Python, FastAPI, Node.js, databases)\n"
            "• Frontend development (React, Vite, TypeScript)\n"
            "• Git, Linux, Docker, and DevOps basics\n"
            "• Salary negotiation and placement strategy\n"
            "• Certifications, open source, and freelancing\n\n"
            "Please ask a specific question like 'How do I write a project section in my resume?' "
            "or 'Explain JWT authentication in FastAPI'.\n\n"
            "(Start Ollama locally with llama3.2 for live AI-powered answers.)"
        ),
        "topic": "Career",
        "confidence": 0.50,
        "sources": [],
        "is_career_related": True,
        "ai_powered": False,
        "model": None,
    }
