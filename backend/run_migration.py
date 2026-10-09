"""
run_migration.py — adds all missing StudentProfile columns safely.
Uses ADD COLUMN IF NOT EXISTS on every new field.
"""
import os, sys
from dotenv import load_dotenv
load_dotenv()

try:
    import psycopg2
except ImportError:
    print("psycopg2 not found — trying psycopg2-binary")
    sys.exit(1)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

SQL_STATEMENTS = [
    # Section 1 — Personal Info
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS bio TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(20) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS website VARCHAR(300) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS linkedin VARCHAR(300) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS github VARCHAR(300) NULL;",
    # Section 2 — Education
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS college VARCHAR(300) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS specialization VARCHAR(150) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS cgpa FLOAT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS backlogs INTEGER NULL;",
    # Section 3 — Career Goals
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS job_type VARCHAR(100) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS preferred_locations TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS availability VARCHAR(50) NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS expected_salary VARCHAR(100) NULL;",
    # Section 4 — Skills
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS skills TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS certifications TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS languages TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS tools TEXT NULL;",
    # Section 5 — Achievements
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS achievements TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS extracurriculars TEXT NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS projects_count INTEGER NULL;",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS internships_count INTEGER NULL;",
    # Meta
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NULL DEFAULT NOW();",
    # Widen branch from VARCHAR(100) to VARCHAR(150)
    "ALTER TABLE student_profiles ALTER COLUMN branch TYPE VARCHAR(150);",
]

def main():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cur = conn.cursor()
        print("Connected to database.")
        print("Running migration...")
        ok = 0
        for sql in SQL_STATEMENTS:
            col = sql.split("COLUMN")[1].strip().split()[0] if "COLUMN" in sql else "branch"
            try:
                cur.execute(sql)
                print(f"  OK  {col}")
                ok += 1
            except Exception as e:
                print(f"  SKIP {col}: {e}")
        cur.close()
        conn.close()
        print(f"\nDone. {ok}/{len(SQL_STATEMENTS)} statements applied.")
        print("Restart uvicorn and the profile save error will be fixed.")
    except Exception as e:
        print(f"Connection error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
