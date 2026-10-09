import os
from dotenv import load_dotenv
load_dotenv()

import psycopg2

conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur  = conn.cursor()

cur.execute("""
    SELECT column_name, data_type, is_nullable, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'student_profiles'
    ORDER BY ordinal_position
""")
rows = cur.fetchall()

print("EXISTING COLUMNS IN student_profiles:")
print(f"{'column_name':<30} {'data_type':<25} {'nullable':<10} max_len")
print("-" * 80)
for r in rows:
    print(f"{r[0]:<30} {r[1]:<25} {r[2]:<10} {r[3]}")

cur.close()
conn.close()
