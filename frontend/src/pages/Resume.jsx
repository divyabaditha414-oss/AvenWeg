import { useEffect, useRef, useState } from "react";
import "./PageShell.css";
import "./Resume.css";
import API from "../api";

function ScoreCircle({ score, label }) {
  const safeScore = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  );

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (safeScore / 100) * circumference;

  return (
    <div className="score-circle-wrapper">
      <div className="score-circle">
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e8edf5"
            strokeWidth="12"
          />

          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
          />
        </svg>

        <div className="score-circle-content">
          <strong>{safeScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <h3>{label}</h3>
    </div>
  );
}

function Resume() {
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD EXISTING RESUME
     ===================================================== */

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/resume");

      const existingResume =
        response.data.resume;

      if (existingResume) {
        setResume(existingResume);

        setUploaded({
          name: existingResume.filename,
          size: existingResume.file_size
            ? `${(
                existingResume.file_size / 1024
              ).toFixed(1)} KB`
            : "Unknown",
          date: existingResume.created_at
            ? new Date(
                existingResume.created_at
              ).toLocaleDateString()
            : new Date().toLocaleDateString(),
        });
      }
    } catch (error) {
      console.error(
        "Failed to load resume:",
        error
      );

      if (error.response?.status !== 404) {
        setError(
          error.response?.data?.detail ||
            "Unable to load resume."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UPLOAD / REPLACE RESUME
     ===================================================== */

  const handleFileUpload = async (file) => {
    if (!file) return;

    setError("");
    setSuccess("");

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    const allowedExtensions = [
      "pdf",
      "docx",
    ];

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedExtensions.includes(extension) &&
      !allowedTypes.includes(file.type)
    ) {
      setError(
        "Only PDF and DOCX resume files are allowed."
      );
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Resume size must be less than 10 MB."
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploading(true);

      const response = await API.post(
        "/resume/upload",
        formData
      );

      console.log(
        "Resume upload response:",
        response.data
      );

      const uploadedResume = {
        id: response.data.resume_id,
        filename: response.data.filename,
        file_size: response.data.size,
        /* always reset status so Analyze button re-enables after replace */
        status: "Pending Analysis",
        analysis: null,
        resume_score: null,
        ats_score: null,
      };

      setResume(uploadedResume);

      setUploaded({
        name: response.data.filename,
        size: `${(
          response.data.size / 1024
        ).toFixed(1)} KB`,
        date: new Date().toLocaleDateString(),
      });

      setSuccess(
        "Resume uploaded successfully. Click Analyze Resume to get AI feedback."
      );
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your login session has expired. Please log in again."
        );
      } else {
        setError(
          error.response?.data?.detail ||
            "Unable to upload resume."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  /* =====================================================
     ANALYZE RESUME
     ===================================================== */

  const handleAnalyze = async () => {
    if (!resume?.id) {
      setError(
        "Please upload a resume first."
      );
      return;
    }

    setError("");
    setSuccess("");

    try {
      setAnalyzing(true);

      const response = await API.post(
        `/resume/${resume.id}/analyze`
      );

      console.log(
        "AI analysis:",
        response.data
      );

      const analysis =
        response.data.analysis;

      setResume((previous) => ({
        ...previous,

        status:
          "Analysis Complete",

        resume_score:
          analysis?.score ??
          previous?.resume_score,

        ats_score:
          analysis?.ats_score ??
          previous?.ats_score,

        analysis,
      }));

      setSuccess(
        "AI resume analysis completed successfully."
      );
    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your login session has expired. Please log in again."
        );
      } else {
        setError(
          error.response?.data?.detail ||
            "Unable to analyze resume."
        );
      }
    } finally {
      setAnalyzing(false);
    }
  };

  /* =====================================================
     REPLACE RESUME
     ===================================================== */

  const handleReplace = () => {
    setError("");
    setSuccess("");

    fileInputRef.current?.click();
  };

  /* =====================================================
     FILE INPUT
     ===================================================== */

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (file) {
      handleFileUpload(file);
    }

    event.target.value = "";
  };

  /* =====================================================
     DRAG AND DROP
     ===================================================== */

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFileUpload(file);
    }
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-shell__header">
          <p className="page-shell__eyebrow">
            RESUME
          </p>

          <h1 className="page-shell__title">
            Your Resume
          </h1>

          <p className="page-shell__sub">
            Loading your resume...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
     ===================================================== */

  return (
    <div className="page-shell">

      {/* Hidden input MUST stay outside the
          uploaded conditional */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* HEADER */}

      <div className="page-shell__header">

        <p className="page-shell__eyebrow">
          RESUME
        </p>

        <h1 className="page-shell__title">
          Your Resume
        </h1>

        <p className="page-shell__sub">
          Upload your resume to get AI-powered
          scoring, ATS analysis, detailed
          feedback, and personalized
          improvement suggestions.
        </p>

      </div>

      {/* ERROR */}
      {error && <div className="resume-alert resume-alert--error">{error}</div>}

      {/* SUCCESS */}
      {success && <div className="resume-alert resume-alert--success">{success}</div>}

      {/* =================================================
          UPLOAD
          ================================================= */}

      {!uploaded ? (

        <div
          className="resume-upload-card"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >

          <div
            className={`resume-dropzone${
              dragActive
                ? " resume-dropzone--active"
                : ""
            }`}
          >

            <div className="resume-dropzone__icon">
              📄
            </div>

            <h3>
              Drop your resume here
            </h3>

            <p>
              PDF or DOCX · Maximum 10 MB
            </p>

            <button
              className="page-btn page-btn--primary"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Choose Resume File"}
            </button>

            {uploading && (
              <p>
                Uploading your resume...
              </p>
            )}

          </div>

        </div>

      ) : (

        /* =================================================
           RESUME INFORMATION
           ================================================= */

        <div className="resume-info-card">

          <div className="resume-info-card__badge">
            ✓ Resume Uploaded
          </div>

          <div className="resume-info-card__meta">

            <div className="resume-meta-item">
              <span>Filename</span>
              <strong>
                {uploaded.name}
              </strong>
            </div>

            <div className="resume-meta-item">
              <span>Size</span>
              <strong>
                {uploaded.size}
              </strong>
            </div>

            <div className="resume-meta-item">
              <span>Uploaded</span>
              <strong>
                {uploaded.date}
              </strong>
            </div>

            <div className="resume-meta-item">
              <span>Status</span>
              <strong className="resume-status">
                {resume?.status ||
                  "Pending Analysis"}
              </strong>
            </div>

          </div>

          {/* ACTIONS */}

          <div className="resume-info-card__actions">

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={
                !resume?.id ||
                analyzing ||
                resume?.status ===
                  "Analysis Complete"
              }
            >
              {analyzing
                ? "AI Analyzing..."
                : resume?.status ===
                  "Analysis Complete"
                ? "Analysis Complete"
                : "Analyze Resume with AI"}
            </button>

            <button
              className="page-btn page-btn--ghost"
              onClick={handleReplace}
              disabled={
                uploading || analyzing
              }
            >
              {uploading
                ? "Uploading..."
                : "Replace Resume"}
            </button>

          </div>

          {/* =================================================
              AI ANALYSIS
              ================================================= */}

          {resume?.analysis && (

            <section className="analysis-section">

              <h2>
                AI Resume Analysis
              </h2>

              {/* SCORE CIRCLES */}

              <div className="resume-score-dashboard">

                <div className="score-panel">

                  <ScoreCircle
                    score={
                      resume.analysis?.score ??
                      resume.resume_score ??
                      0
                    }
                    label="AI Resume Score"
                  />

                  <p>
                    Overall quality of your
                    resume based on its
                    content, structure,
                    skills, projects,
                    experience and
                    achievements.
                  </p>

                </div>

                <div className="score-panel">

                  <ScoreCircle
                    score={
                      resume.analysis?.ats_score ??
                      resume.ats_score ??
                      0
                    }
                    label="ATS Compatibility"
                  />

                  <p>
                    Measures resume
                    readability, structure,
                    standard headings,
                    formatting and ATS
                    parsing compatibility.
                  </p>

                </div>

              </div>

              {/* SUMMARY */}

              {resume.analysis?.summary && (
                <div className="analysis-card">

                  <h3>
                    AI Summary
                  </h3>

                  <p>
                    {resume.analysis.summary}
                  </p>

                </div>
              )}

              {/* STRENGTHS */}

              <div className="analysis-grid">

                <div className="analysis-card">

                  <h3>
                    ✨ Strengths
                  </h3>

                  {resume.analysis
                    ?.strengths?.length ? (

                    resume.analysis.strengths.map(
                      (item, index) => (
                        <p key={index}>
                          ✓ {item}
                        </p>
                      )
                    )

                  ) : (
                    <p>
                      No strengths available.
                    </p>
                  )}

                </div>

                {/* WEAKNESSES */}

                <div className="analysis-card">

                  <h3>
                    ⚠️ Areas to Improve
                  </h3>

                  {resume.analysis
                    ?.weaknesses?.length ? (

                    resume.analysis.weaknesses.map(
                      (item, index) => (
                        <p key={index}>
                          ⚠ {item}
                        </p>
                      )
                    )

                  ) : (
                    <p>
                      No weaknesses available.
                    </p>
                  )}

                </div>

              </div>

              {/* =================================================
                  DETAILED AI SUGGESTIONS
                  ================================================= */}

              <div className="ai-improvement-section">

                <h2>
                  🚀 AI Suggestions to Improve Your Resume
                </h2>

                <p className="section-description">
                  These suggestions identify specific
                  areas where your resume can become
                  clearer, stronger and more
                  professional.
                </p>

                {/* GENERAL RECOMMENDATIONS */}

                {resume.analysis
                  ?.recommendations?.length > 0 && (

                  <div className="ai-suggestion-card">

                    <h3>
                      💡 General Improvements
                    </h3>

                    {resume.analysis.recommendations.map(
                      (item, index) => (
                        <div
                          className="ai-suggestion-item"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {item}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

                {/* SECTION-SPECIFIC SUGGESTIONS */}

                {resume.analysis
                  ?.section_suggestions &&
                  Object.entries(
                    resume.analysis.section_suggestions
                  ).map(
                    ([section, suggestions]) => (

                      <div
                        className="ai-suggestion-card"
                        key={section}
                      >

                        <h3>
                          📌 {section}
                        </h3>

                        {Array.isArray(
                          suggestions
                        ) &&
                          suggestions.map(
                            (item, index) => (
                              <div
                                className="ai-suggestion-item"
                                key={index}
                              >
                                <span>
                                  {index + 1}
                                </span>

                                <p>
                                  {item}
                                </p>
                              </div>
                            )
                          )}

                      </div>

                    )
                  )}

                {/* ATS SUGGESTIONS */}

                {resume.analysis
                  ?.ats_suggestions?.length >
                  0 && (

                  <div className="ai-suggestion-card">

                    <h3>
                      🤖 ATS Optimization Suggestions
                    </h3>

                    {resume.analysis.ats_suggestions.map(
                      (item, index) => (
                        <div
                          className="ai-suggestion-item"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {item}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

                {/* BULLET IMPROVEMENTS */}

                {resume.analysis
                  ?.bullet_suggestions?.length >
                  0 && (

                  <div className="ai-suggestion-card">

                    <h3>
                      ✍️ Improve Your Resume Bullets
                    </h3>

                    {resume.analysis.bullet_suggestions.map(
                      (item, index) => (
                        <div
                          className="ai-suggestion-item"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {item}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

                {/* KEYWORD SUGGESTIONS */}

                {resume.analysis
                  ?.keyword_suggestions?.length >
                  0 && (

                  <div className="ai-suggestion-card">

                    <h3>
                      🔑 Skills & Keyword Suggestions
                    </h3>

                    {resume.analysis.keyword_suggestions.map(
                      (item, index) => (
                        <div
                          className="ai-suggestion-item"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {item}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* =================================================
                  RESUME SECTION ANALYSIS
                  ================================================= */}

              {resume.analysis?.sections && (

                <div className="section-scores">

                  <h3>
                    Resume Section Analysis
                  </h3>

                  {Object.entries(
                    resume.analysis.sections
                  ).map(
                    ([section, score]) => {

                      const numericScore =
                        Number(score) || 0;

                      return (
                        <div
                          className="section-score"
                          key={section}
                        >

                          <div className="section-score-header">

                            <span>
                              {section}
                            </span>

                            <strong>
                              {numericScore}
                            </strong>

                          </div>

                          <div className="progress-bar">

                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  numericScore * 5,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

              {/* =================================================
                  QUICK IMPROVEMENT TIPS
                  ================================================= */}

              <div className="tips-card">

                <h3>
                  📋 Resume Improvement Checklist
                </h3>

                {(
                  resume.analysis?.tips || [
                    "Use measurable achievements instead of generic responsibilities.",
                    "Start bullet points with strong action verbs.",
                    "Keep formatting consistent throughout the resume.",
                    "Use standard section headings for ATS compatibility.",
                    "Add relevant technical skills and tools.",
                    "Include project outcomes and measurable results.",
                    "Add GitHub or live project links where appropriate.",
                    "Avoid long paragraphs and keep bullet points concise.",
                  ]
                ).map(
                  (tip, index) => (

                    <div
                      className="tip-item"
                      key={index}
                    >

                      <span>
                        💡
                      </span>

                      <p>
                        {tip}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>
          )}

        </div>
      )}

      {/* =================================================
          STATIC RESUME TIPS
          ================================================= */}

      <div className="resume-tips">

        <h3>
          Resume Tips
        </h3>

        <div className="resume-tips__grid">

          {[
            {
              icon: "✅",
              tip: "Use a simple single-column layout for ATS compatibility.",
            },
            {
              icon: "✅",
              tip: "Quantify achievements using numbers, percentages and measurable results.",
            },
            {
              icon: "✅",
              tip: "Use strong action verbs such as Developed, Implemented, Designed and Optimized.",
            },
            {
              icon: "✅",
              tip: "Use standard headings such as Education, Skills, Projects and Experience.",
            },
            {
              icon: "✅",
              tip: "Add relevant GitHub, portfolio or live project links.",
            },
            {
              icon: "✅",
              tip: "Keep technical skills in a dedicated Skills section.",
            },
          ].map(
            ({ icon, tip }) => (

              <div
                className="resume-tip"
                key={tip}
              >

                <span>
                  {icon}
                </span>

                <p>
                  {tip}
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Resume;