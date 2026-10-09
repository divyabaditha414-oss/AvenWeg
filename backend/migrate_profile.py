"""
migrate_profile.py
──────────────────
Safely adds the 24 missing columns to the student_profiles table.

Rules:
  - Uses ADD COLUMN IF NOT EXISTS  → safe to re-run
  - Every new column is NULLABLE   → existing rows are untouched
  - No DROP, no TRUNCATE, no data loss
"""

import os
from dotenv import load_dotenv
load_dotenv()

import psycopg2

DATABASE_URL = os.getenv("DATABASE_URL")

# ── All ALTER TABLE statements ─────────────────────────────────────────────
# Each statement uses IF NOT EXISTS so the script is idempotent.

MIGRATIONS = [

    # ── SECTION 1: Personal Info ──────────────────────────────────────────
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS bio            TEXT         NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS phone          VARCHAR(20)  NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS date_of_birth  VARCHAR(20)  NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS gender         VARCHAR(20)  NULL",
    # location already exists — no change needed
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS website        VARCHAR(300) NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS linkedin       VARCHAR(300) NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS github         VARCHAR(300) NULL",

    # ── SECTION 2: Education ──────────────────────────────────────────────
    # education, branch, graduation_year already exist — no change needed
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS college        VARCHAR(300) NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS specialization VARCHAR(150) NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS cgpa           FLOAT        NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS backlogs       INTEGER      NULL",

    # ── SECTION 3: Career Goals ───────────────────────────────────────────
    # preferred_role already exists — no change needed
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS experience_level    VARCHAR(50)  NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS job_type            VARCHAR(100) NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS preferred_locations TEXT         NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS availability        VARCHAR(50)  NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS expected_salary     VARCHAR(100) NULL",

    # ── SECTION 4: Skills & Tech ─────────────────────────────────────────
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS skills         TEXT NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS certifications TEXT NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS languages      TEXT NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS tools          TEXT NULL",

    # ── SECTION 5: Achievements ───────────────────────────────────────────
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS achievements      TEXT    NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS extracurriculars  TEXT    NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS projects_count    INTEGER NULL",
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS internships_count INTEGER NULL",

    # ── META ──────────────────────────────────────────────────────────────
    "ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NULL DEFAULT now()",
]

# ── Also widen the existing education column (was VARCHAR(200), model says 200 — OK)
# ── and branch column (was VARCHAR(100), model says 150 — widen safely)
WIDEN = [
    "ALTER TABLE student_profiles ALTER COLUMN branch TYPE VARCHAR(150)",
]


def run():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    cur = conn.cursor()

    print("=" * 60)
    print("AI Career Assistant — Profile Schema Migration")
    print("=" * 60)

    # ── Add missing columns ──────────────────────────────────
    print("\n[1/3] Adding missing columns...")
    for sql in MIGRATIONS:
        col = sql.split("IF NOT EXISTS")[1].strip().split()[0]
        try:
            cur.execute(sql)
            print(f"  ✓  {col}")
        except Exception as e:
            conn.rollback()
            print(f"  ✗  {col}  →  {e}")
            cur = conn.cursor()

    # ── Widen columns ────────────────────────────────────────
    print("\n[2/3] Widening existing columns where needed...")
    for sql in WIDEN:
        col = sql.split("COLUMN")[1].strip().split()[0]
        try:
            cur.execute(sql)
            print(f"  ✓  {col}")
        except Exception as e:
            # If already the right size this may be a no-op error — rollback and continue
            conn.rollback()
            print(f"  ~  {col}  (skipped: {e})")
            cur = conn.cursor()

    conn.commit()

    # ── Verify ───────────────────────────────────────────────
    print("\n[3/3] Verifying final schema...")
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'student_profiles'
        ORDER BY ordinal_position
    """)
    rows = cur.fetchall()
    print(f"\n  {'column_name':<30} {'data_type':<25} nullable")
    print("  " + "-" * 65)
    for r in rows:
        print(f"  {r[0]:<30} {r[1]:<25} {r[2]}")

    cur.close()
    conn.close()

    print("\n✅  Migration complete. student_profiles now has", len(rows), "columns.")
    print("    Restart Uvicorn, then test GET /profile and PUT /profile.")


if __name__ == "__main__":
    run()
