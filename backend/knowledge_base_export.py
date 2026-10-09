"""
knowledge_base_export.py
────────────────────────
Generates a well-formatted PDF of the complete AI Career Assistant
knowledge base using the reportlab library.

Usage:
    cd backend
    venv\\Scripts\\activate
    pip install reportlab
    python knowledge_base_export.py

Output:
    knowledge_base.pdf  (created in the backend/ directory)

What the PDF contains:
    • Cover page
    • Table of contents (by category)
    • All 30 topics — full answers + source URLs
    • Clean, readable layout with section dividers
"""

import os
import sys
from datetime import datetime

# ─── Import the knowledge base directly from ai_assistant.py ─────────────────
try:
    from ai_assistant import KB, KB_CATEGORIES
except ImportError:
    print("ERROR: Could not import ai_assistant.py. Run this script from the backend/ directory.")
    sys.exit(1)

# ─── Try to import reportlab ──────────────────────────────────────────────────
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.colors import (
        HexColor, white, black, Color
    )
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
        Table, TableStyle, PageBreak, KeepTogether,
    )
    from reportlab.lib.enums import TA_LEFT, TA_CENTER
except ImportError:
    print("reportlab is not installed.")
    print("Run:  pip install reportlab")
    sys.exit(1)


# ─── COLOURS ─────────────────────────────────────────────────────────────────
BRAND          = HexColor("#6366f1")   # indigo
BRAND_DARK     = HexColor("#4338ca")
BRAND_LIGHT    = HexColor("#eef2ff")
TEXT_PRIMARY   = HexColor("#0f172a")
TEXT_MUTED     = HexColor("#64748b")
TEXT_DIM       = HexColor("#94a3b8")
BORDER_COLOR   = HexColor("#e2e8f0")
BG_SOFT        = HexColor("#f8fafc")
WHITE          = white

CATEGORY_COLORS = {
    "Interview":     HexColor("#f59e0b"),
    "Resume":        HexColor("#6366f1"),
    "Backend":       HexColor("#10b981"),
    "Frontend":      HexColor("#0ea5e9"),
    "CS Fundamentals": HexColor("#8b5cf6"),
    "Career":        HexColor("#ec4899"),
}

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 18 * mm
CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN


# ─── STYLES ──────────────────────────────────────────────────────────────────
def build_styles():
    base = getSampleStyleSheet()

    styles = {}

    styles["cover_title"] = ParagraphStyle(
        "cover_title",
        fontSize=32,
        leading=40,
        textColor=WHITE,
        fontName="Helvetica-Bold",
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    styles["cover_sub"] = ParagraphStyle(
        "cover_sub",
        fontSize=14,
        leading=20,
        textColor=HexColor("#c7d2fe"),
        fontName="Helvetica",
        alignment=TA_CENTER,
        spaceAfter=6,
    )

    styles["cover_meta"] = ParagraphStyle(
        "cover_meta",
        fontSize=11,
        leading=16,
        textColor=HexColor("#a5b4fc"),
        fontName="Helvetica",
        alignment=TA_CENTER,
    )

    styles["toc_header"] = ParagraphStyle(
        "toc_header",
        fontSize=22,
        leading=28,
        textColor=TEXT_PRIMARY,
        fontName="Helvetica-Bold",
        spaceAfter=4,
    )

    styles["toc_category"] = ParagraphStyle(
        "toc_category",
        fontSize=13,
        leading=18,
        textColor=BRAND,
        fontName="Helvetica-Bold",
        spaceBefore=10,
        spaceAfter=2,
    )

    styles["toc_topic"] = ParagraphStyle(
        "toc_topic",
        fontSize=11,
        leading=16,
        textColor=TEXT_MUTED,
        fontName="Helvetica",
        leftIndent=14,
        spaceAfter=1,
    )

    styles["category_badge"] = ParagraphStyle(
        "category_badge",
        fontSize=10,
        leading=14,
        textColor=WHITE,
        fontName="Helvetica-Bold",
    )

    styles["topic_title"] = ParagraphStyle(
        "topic_title",
        fontSize=18,
        leading=24,
        textColor=TEXT_PRIMARY,
        fontName="Helvetica-Bold",
        spaceBefore=4,
        spaceAfter=6,
    )

    styles["answer_text"] = ParagraphStyle(
        "answer_text",
        fontSize=10,
        leading=16,
        textColor=TEXT_PRIMARY,
        fontName="Helvetica",
        spaceAfter=2,
    )

    styles["bullet_text"] = ParagraphStyle(
        "bullet_text",
        fontSize=10,
        leading=16,
        textColor=TEXT_PRIMARY,
        fontName="Helvetica",
        leftIndent=14,
        firstLineIndent=-8,
        spaceAfter=1,
    )

    styles["section_header"] = ParagraphStyle(
        "section_header",
        fontSize=10,
        leading=14,
        textColor=BRAND,
        fontName="Helvetica-Bold",
        spaceBefore=6,
        spaceAfter=3,
    )

    styles["source_label"] = ParagraphStyle(
        "source_label",
        fontSize=9,
        leading=13,
        textColor=TEXT_MUTED,
        fontName="Helvetica-Bold",
        spaceBefore=6,
        spaceAfter=2,
    )

    styles["source_item"] = ParagraphStyle(
        "source_item",
        fontSize=9,
        leading=13,
        textColor=HexColor("#3730a3"),
        fontName="Helvetica",
        leftIndent=10,
        spaceAfter=1,
    )

    styles["keyword_text"] = ParagraphStyle(
        "keyword_text",
        fontSize=8,
        leading=12,
        textColor=TEXT_DIM,
        fontName="Helvetica-Oblique",
        spaceAfter=4,
    )

    styles["page_number"] = ParagraphStyle(
        "page_number",
        fontSize=9,
        textColor=TEXT_DIM,
        fontName="Helvetica",
        alignment=TA_CENTER,
    )

    return styles


# ─── PARSE ANSWER INTO STYLED ELEMENTS ───────────────────────────────────────
def answer_to_elements(answer: str, styles: dict) -> list:
    """
    Convert the plain-text answer (with • bullets and indented lines)
    into reportlab Paragraph elements.
    """
    elements = []
    lines = answer.split("\n")

    for line in lines:
        stripped = line.strip()

        if stripped == "":
            elements.append(Spacer(1, 3))
            continue

        # Section header lines (e.g. "Phase 1 — Technical Foundation:")
        if (
            stripped.endswith(":") and len(stripped) < 60
            and not stripped.startswith("•")
            and not stripped.startswith("-")
        ) or any(stripped.startswith(emoji) for emoji in ["🔥", "🌐", "☁️", "🤖", "📅", "⚙️", "⭐", "🎓", "💡"]):
            elements.append(Paragraph(stripped, styles["section_header"]))
            continue

        # Bullet points
        if stripped.startswith("•") or stripped.startswith("-"):
            clean = stripped.lstrip("•- ").strip()
            elements.append(Paragraph(f"• {clean}", styles["bullet_text"]))
            continue

        # Numbered list
        if len(stripped) > 1 and stripped[0].isdigit() and stripped[1] in ".):":
            elements.append(Paragraph(stripped, styles["bullet_text"]))
            continue

        # Indented code-like lines (commands)
        if line.startswith("  ") or line.startswith("\t"):
            code_style = ParagraphStyle(
                "code",
                parent=styles["answer_text"],
                fontName="Courier",
                fontSize=9,
                backColor=BG_SOFT,
                borderPadding=(2, 4, 2, 4),
                leftIndent=14,
                leading=14,
            )
            elements.append(Paragraph(stripped, code_style))
            continue

        # Normal paragraph
        elements.append(Paragraph(stripped, styles["answer_text"]))

    return elements


# ─── PAGE TEMPLATE (header + footer) ─────────────────────────────────────────
class PageTemplate:
    def __init__(self):
        self.page_num = [0]

    def on_page(self, canvas, doc):
        self.page_num[0] += 1
        canvas.saveState()

        # Header bar
        canvas.setFillColor(BRAND)
        canvas.rect(MARGIN, PAGE_HEIGHT - 14 * mm, CONTENT_WIDTH, 8 * mm, fill=1, stroke=0)
        canvas.setFillColor(WHITE)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawString(MARGIN + 4, PAGE_HEIGHT - 10 * mm, "AI CAREER ASSISTANT — KNOWLEDGE BASE")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(PAGE_WIDTH - MARGIN - 4, PAGE_HEIGHT - 10 * mm, "Career Guidance for Students & Professionals")

        # Footer
        canvas.setFillColor(TEXT_DIM)
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(PAGE_WIDTH / 2, 8 * mm, f"Page {self.page_num[0]}  ·  AI Career Assistant  ·  © {datetime.now().year}")

        canvas.restoreState()


# ─── COVER PAGE ───────────────────────────────────────────────────────────────
def build_cover(styles: dict) -> list:
    elements = []

    # Full-page indigo background via a large coloured table
    cover_table_data = [[""]]
    cover_table = Table(cover_table_data, colWidths=[CONTENT_WIDTH], rowHeights=[210 * mm])
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BRAND),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [BRAND]),
    ]))
    elements.append(cover_table)

    # Overlay text (positioned over the table via negative spacers is complex in reportlab;
    # instead we add paragraphs after the coloured block with matching background)
    elements.append(Spacer(1, -190 * mm))   # pull back up

    elements.append(Paragraph("✦", ParagraphStyle("logo_symbol", fontSize=48, textColor=WHITE,
                                                    fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=4)))
    elements.append(Spacer(1, 4 * mm))
    elements.append(Paragraph("AI Career Assistant", styles["cover_title"]))
    elements.append(Paragraph("Complete Knowledge Base", styles["cover_sub"]))
    elements.append(Spacer(1, 8 * mm))
    elements.append(Paragraph(
        f"30 Topics · 6 Categories · Interview Prep · Resume Building · Backend Technologies · CS Fundamentals",
        styles["cover_meta"]
    ))
    elements.append(Spacer(1, 4 * mm))
    elements.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y')}",
        styles["cover_meta"]
    ))

    elements.append(PageBreak())
    return elements


# ─── TABLE OF CONTENTS ────────────────────────────────────────────────────────
def build_toc(styles: dict) -> list:
    elements = []
    elements.append(Spacer(1, 6 * mm))
    elements.append(Paragraph("Table of Contents", styles["toc_header"]))
    elements.append(HRFlowable(width=CONTENT_WIDTH, thickness=2, color=BRAND, spaceAfter=8))

    # Group by category
    grouped: dict = {}
    for entry in KB:
        cat = entry["category"]
        grouped.setdefault(cat, []).append(entry["topic"])

    for cat in KB_CATEGORIES:
        if cat not in grouped:
            continue
        cat_color = CATEGORY_COLORS.get(cat, BRAND)
        elements.append(Paragraph(f"▸  {cat}", ParagraphStyle(
            "toc_cat_colored",
            parent=styles["toc_category"],
            textColor=cat_color,
        )))
        for topic in grouped[cat]:
            elements.append(Paragraph(f"    • {topic}", styles["toc_topic"]))

    elements.append(PageBreak())
    return elements


# ─── INDIVIDUAL TOPIC PAGE ────────────────────────────────────────────────────
def build_topic(entry: dict, styles: dict, idx: int) -> list:
    elements = []
    cat_color = CATEGORY_COLORS.get(entry["category"], BRAND)

    # Category badge
    badge_data = [[f"  {entry['category'].upper()}  "]]
    badge_table = Table(badge_data)
    badge_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), cat_color),
        ("TEXTCOLOR",  (0, 0), (0, 0), WHITE),
        ("FONTNAME",   (0, 0), (0, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (0, 0), 9),
        ("LEFTPADDING",  (0, 0), (0, 0), 8),
        ("RIGHTPADDING", (0, 0), (0, 0), 8),
        ("TOPPADDING",   (0, 0), (0, 0), 4),
        ("BOTTOMPADDING",(0, 0), (0, 0), 4),
        ("ROUNDEDCORNERS", [4]),
    ]))

    # Topic number + title
    elements.append(KeepTogether([
        Spacer(1, 3 * mm),
        badge_table,
        Spacer(1, 2 * mm),
        Paragraph(f"{idx:02d}. {entry['topic']}", styles["topic_title"]),
        HRFlowable(width=CONTENT_WIDTH, thickness=1, color=cat_color, spaceAfter=6),
    ]))

    # Keywords line
    kw_str = " · ".join(entry["keywords"][:8])
    elements.append(Paragraph(f"Keywords: {kw_str}", styles["keyword_text"]))

    # Answer
    elements.extend(answer_to_elements(entry["answer"], styles))

    # Sources
    if entry.get("sources"):
        elements.append(Spacer(1, 3 * mm))
        elements.append(Paragraph("📚 Resources", styles["source_label"]))
        for src in entry["sources"]:
            elements.append(Paragraph(f"• {src['label']}  —  {src['url']}", styles["source_item"]))

    # Divider
    elements.append(Spacer(1, 4 * mm))
    elements.append(HRFlowable(width=CONTENT_WIDTH, thickness=0.5, color=BORDER_COLOR, spaceAfter=6))

    return elements


# ─── MAIN BUILD ───────────────────────────────────────────────────────────────
def build_pdf(output_path: str = "knowledge_base.pdf"):
    print(f"Building PDF: {output_path}")
    print(f"Topics: {len(KB)}  |  Categories: {len(KB_CATEGORIES)}")

    pt = PageTemplate()

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        title="AI Career Assistant — Knowledge Base",
        author="AI Career Assistant",
        subject="Career Guidance Knowledge Base",
    )

    styles = build_styles()
    story  = []

    # Cover
    story.extend(build_cover(styles))

    # TOC
    story.extend(build_toc(styles))

    # Category intro pages + topics
    current_category = None
    topic_idx = 0
    for entry in KB:
        topic_idx += 1
        cat = entry["category"]

        # Category section header
        if cat != current_category:
            current_category = cat
            cat_color = CATEGORY_COLORS.get(cat, BRAND)

            story.append(KeepTogether([
                Spacer(1, 4 * mm),
                Paragraph(f"Category: {cat}", ParagraphStyle(
                    "cat_header",
                    fontSize=20,
                    leading=26,
                    textColor=cat_color,
                    fontName="Helvetica-Bold",
                    spaceAfter=4,
                )),
                HRFlowable(width=CONTENT_WIDTH, thickness=3, color=cat_color, spaceAfter=8),
            ]))

        story.extend(build_topic(entry, styles, topic_idx))

    # Back cover
    story.append(PageBreak())
    story.append(Spacer(1, 80 * mm))
    story.append(Paragraph("AI Career Assistant", ParagraphStyle(
        "back_title", fontSize=24, fontName="Helvetica-Bold",
        textColor=BRAND, alignment=TA_CENTER, spaceAfter=8,
    )))
    story.append(Paragraph(
        "Your AI-powered placement companion for students and early-career professionals.",
        ParagraphStyle("back_sub", fontSize=12, textColor=TEXT_MUTED,
                       alignment=TA_CENTER, fontName="Helvetica", leading=18),
    ))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph(
        f"© {datetime.now().year} AI Career Assistant  ·  All career guidance is for informational purposes.",
        ParagraphStyle("back_copy", fontSize=9, textColor=TEXT_DIM,
                       alignment=TA_CENTER, fontName="Helvetica"),
    ))

    # Build
    doc.build(
        story,
        onFirstPage=pt.on_page,
        onLaterPages=pt.on_page,
    )

    size_kb = os.path.getsize(output_path) // 1024
    print(f"\n✅  PDF generated: {output_path}  ({size_kb} KB)")
    print(f"    Topics: {len(KB)}")
    print(f"    Categories: {', '.join(KB_CATEGORIES)}")
    print(f"\n    Open with: start {output_path}  (Windows)")


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "knowledge_base.pdf"
    build_pdf(output)
