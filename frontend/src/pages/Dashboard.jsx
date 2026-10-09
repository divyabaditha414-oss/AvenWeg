import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

/* ── Sparkline ── */
function Sparkline({ points, color = "#6366f1" }) {
  const w = 80, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = coords.split(" ").at(-1).split(",");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={coords} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

/* ── SVG Ring ── */
function Ring({ pct, size = 80, stroke = 7, color = "#6366f1", label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(0,0,0,.07)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray .8s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        {label}
      </div>
    </div>
  );
}

/* ── Skill Bar ── */
function SkillBar({ name, pct, color }) {
  return (
    <div className="db-skill-row">
      <div className="db-skill-row__head">
        <span className="db-skill-row__name">{name}</span>
        <span className="db-skill-row__pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="db-skill-row__track">
        <div className="db-skill-row__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { icon: "📄", label: "Resume",         path: "/resume",          color: "#6366f1" },
  { icon: "💼", label: "Jobs",           path: "/jobs",            color: "#10b981" },
  { icon: "🎤", label: "Mock Interview", path: "/mock-interview",  color: "#f59e0b" },
  { icon: "🧠", label: "Skill Gap",      path: "/skill-gap",       color: "#ec4899" },
  { icon: "📚", label: "Preparation",    path: "/preparation",     color: "#8b5cf6" },
  { icon: "📋", label: "Applications",   path: "/applications",    color: "#0ea5e9" },
];

const PREP_WEEKS = [
  { week: "Week 1", theme: "Data Structures",     done: 0, total: 4 },
  { week: "Week 2", theme: "Algorithms",           done: 0, total: 4 },
  { week: "Week 3", theme: "System Design",        done: 0, total: 4 },
  { week: "Week 4", theme: "Interview Readiness",  done: 0, total: 4 },
];

export default function Dashboard() {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [resume,  setResume]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12)      setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else              setGreeting("Good evening");

    (async () => {
      try {
        const [uRes, pRes, rRes] = await Promise.all([
          API.get("/me"),
          API.get("/profile").catch(() => null),
          API.get("/resume").catch(() => null),
        ]);
        setUser(uRes.data);
        setProfile(pRes?.data || null);
        setResume(rRes?.data?.resume || null);
      } catch { /* AppLayout handles redirect */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="db-loading"><div className="db-spinner" /><p>Loading your dashboard…</p></div>
  );
  if (!user) return null;

  /* ── derived ── */
  const firstName = user.name.split(" ")[0];
  const profileComplete = profile?.education && profile?.branch && profile?.graduation_year && profile?.preferred_role;

  /* Resume score — real if analysed, else 0 */
  const resumeScore   = resume?.resume_score ?? 0;
  const resumeAnalysed = resume?.status === "Analysis Complete";

  /* Skill bars built from profile.skills (comma-sep) or defaults */
  const SKILL_COLORS = ["#6366f1","#f59e0b","#10b981","#0ea5e9","#ec4899","#8b5cf6","#ef4444","#14b8a6"];
  const skillsRaw = profile?.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const skillBars = skillsRaw.length > 0
    ? skillsRaw.slice(0, 6).map((name, i) => ({ name, pct: 65 + (i % 4) * 8, color: SKILL_COLORS[i % SKILL_COLORS.length] }))
    : [
        { name: "Python",        pct: 75, color: "#6366f1" },
        { name: "JavaScript",    pct: 68, color: "#f59e0b" },
        { name: "React",         pct: 60, color: "#10b981" },
        { name: "SQL",           pct: 72, color: "#0ea5e9" },
        { name: "System Design", pct: 35, color: "#ec4899" },
      ];

  /* Setup checklist */
  const setupSteps = [
    { done: true,              text: "Create account"         },
    { done: !!profileComplete, text: "Complete profile"        },
    { done: !!resume,          text: "Upload resume"           },
    { done: resumeAnalysed,    text: "Analyse resume with AI"  },
    { done: false,             text: "Apply to a job"          },
  ];
  const setupDone  = setupSteps.filter(s => s.done).length;
  const setupTotal = setupSteps.length;
  const setupPct   = Math.round((setupDone / setupTotal) * 100);

  /* Prep progress (from localStorage if available) */
  const savedPrep = (() => {
    try { return JSON.parse(localStorage.getItem("prep_plan") || "null"); } catch { return null; }
  })();
  const prepWeeks  = savedPrep || PREP_WEEKS;
  const prepDone   = prepWeeks.reduce((a, w) => a + w.done, 0);
  const prepTotal  = prepWeeks.reduce((a, w) => a + w.total, 0);
  const prepPct    = Math.round((prepDone / prepTotal) * 100);

  /* Activity */
  const activity = [
    { icon: "👤", color: "#6366f1", text: "Account created successfully",                    time: "Account" },
    profile?.education
      ? { icon: "🎓", color: "#10b981", text: `Education: ${profile.education}${profile.branch ? ` · ${profile.branch}` : ""}`, time: "Profile" }
      : { icon: "👤", color: "#94a3b8", text: "Complete your profile to personalise your experience", time: "Action" },
    resume
      ? { icon: "📄", color: "#f59e0b", text: `Resume uploaded: ${resume.filename}`, time: "Resume" }
      : { icon: "📄", color: "#94a3b8", text: "Upload your resume to get AI feedback",        time: "Action" },
    resumeAnalysed
      ? { icon: "🤖", color: "#8b5cf6", text: `Resume AI score: ${resumeScore}/100`,          time: "Analysis" }
      : { icon: "🤖", color: "#94a3b8", text: "Analyse your resume for AI-powered feedback",  time: "Action" },
    { icon: "📚", color: "#ec4899", text: "4-week preparation plan ready to start",            time: "Available" },
  ];

  /* Jobs sample */
  const JOBS = [
    { title: "Software Engineer",    company: "TechCorp India",  location: "Hyderabad", match: 92 },
    { title: "Frontend Developer",   company: "Infosys",         location: "Bengaluru", match: 87 },
    { title: "Full Stack Developer", company: "StartupXYZ",      location: "Remote",    match: 89 },
    { title: "Data Analyst",         company: "Analytics Co.",   location: "Pune",      match: 74 },
  ];
  const matchColor = (m) => m >= 85 ? "#10b981" : m >= 70 ? "#f59e0b" : "#64748b";

  /* Readiness rough calc */
  const readinessPct = Math.round(
    (setupPct * 0.4) + (resumeScore * 0.4) + (prepPct * 0.2)
  );

  return (
    <div className="db">
      {/* ══ WELCOME BANNER ══ */}
      <div className="db-banner">
        <div className="db-banner__left">
          <p className="db-banner__greeting">{greeting} 👋</p>
          <h1 className="db-banner__name">{user.name}</h1>
          <p className="db-banner__sub">
            {profileComplete
              ? `${profile.preferred_role} · ${profile.branch} · ${profile.education}`
              : "Complete your profile to personalise your experience."}
          </p>
        </div>
        <div className="db-banner__right">
          {!profileComplete && (
            <Link to="/profile" className="db-banner__cta">Complete Profile →</Link>
          )}
          <div className="db-banner__date">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS ══ */}
      <div className="db-stats">
        <div className="db-stat-card">
          <div className="db-stat-card__top">
            <div>
              <p className="db-stat-card__label">Resume Score</p>
              <p className="db-stat-card__val">
                {resumeScore}<span>/100</span>
              </p>
            </div>
            <div className="db-stat-card__icon" style={{ background: "rgba(99,102,241,.15)", color: "#818cf8" }}>📄</div>
          </div>
          {resumeScore > 0
            ? <Sparkline points={[Math.max(0,resumeScore-25), Math.max(0,resumeScore-18), Math.max(0,resumeScore-10), Math.max(0,resumeScore-4), resumeScore]} color="#6366f1" />
            : <p className="db-stat-card__empty-hint">Upload and analyse your resume to get a score.</p>
          }
          {resumeScore > 0
            ? <p className="db-stat-card__trend db-stat-card__trend--up">↑ AI Score Available</p>
            : <Link to="/resume" className="db-stat-card__link">Upload Resume →</Link>
          }
        </div>

        <div className="db-stat-card">
          <div className="db-stat-card__top">
            <div>
              <p className="db-stat-card__label">Setup Progress</p>
              <p className="db-stat-card__val">{setupPct}<span>%</span></p>
            </div>
            <div className="db-stat-card__icon" style={{ background: "rgba(16,185,129,.15)", color: "#34d399" }}>✅</div>
          </div>
          <Sparkline points={[0, setupPct * 0.3, setupPct * 0.5, setupPct * 0.8, setupPct]} color="#10b981" />
          <p className="db-stat-card__trend db-stat-card__trend--up">
            {setupDone}/{setupTotal} steps complete
          </p>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-card__top">
            <div>
              <p className="db-stat-card__label">Readiness</p>
              <p className="db-stat-card__val">{readinessPct}<span>%</span></p>
            </div>
            <div className="db-stat-card__icon" style={{ background: "rgba(245,158,11,.15)", color: "#fcd34d" }}>🎯</div>
          </div>
          <Sparkline points={[0, readinessPct * 0.3, readinessPct * 0.55, readinessPct * 0.8, readinessPct]} color="#f59e0b" />
          <p className="db-stat-card__trend db-stat-card__trend--up">
            {readinessPct >= 70 ? "↑ Good readiness" : "Keep building your profile"}
          </p>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-card__top">
            <div>
              <p className="db-stat-card__label">Prep Progress</p>
              <p className="db-stat-card__val">{prepPct}<span>%</span></p>
            </div>
            <div className="db-stat-card__icon" style={{ background: "rgba(14,165,233,.15)", color: "#38bdf8" }}>📚</div>
          </div>
          <Sparkline points={[0, prepPct * 0.4, prepPct * 0.7, prepPct]} color="#0ea5e9" />
          <p className="db-stat-card__trend db-stat-card__trend--up">
            {prepDone}/{prepTotal} topics done
          </p>
        </div>
      </div>

      {/* ══ QUICK ACTIONS ══ */}
      <div className="db-section">
        <h2 className="db-section__title">Quick Actions</h2>
        <div className="db-quick-actions">
          {QUICK_ACTIONS.map(({ icon, label, path, color }) => (
            <Link to={path} key={label} className="db-qa">
              <div className="db-qa__icon" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
              </div>
              <span className="db-qa__label">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ MAIN GRID ══ */}
      <div className="db-main-grid">
        {/* ── LEFT ── */}
        <div className="db-col">

          {/* Setup Progress */}
          <div className="db-card">
            <div className="db-card__head">
              <h3>Setup Progress</h3>
              <span className="db-card__badge">{setupDone}/{setupTotal} done</span>
            </div>
            <div className="db-setup-ring-row">
              <Ring pct={setupPct} size={80} stroke={7} color="#6366f1"
                label={<span className="db-ring-label">{setupPct}%</span>} />
              <div className="db-setup-steps">
                {setupSteps.map(({ done, text }) => (
                  <div key={text} className={`db-setup-step${done ? " done" : ""}`}>
                    <span className="db-setup-step__dot">{done ? "✓" : ""}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="db-card">
            <div className="db-card__head">
              <h3>Skill Overview</h3>
              <Link to="/skill-gap" className="db-card__link">Full Analysis →</Link>
            </div>
            <div className="db-skills">
              {skillBars.map(s => <SkillBar key={s.name} {...s} />)}
            </div>
            {skillsRaw.length === 0 && (
              <div className="db-skill-note">
                💡 Add skills to your profile to see personalised skill analysis.
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="db-card">
            <div className="db-card__head"><h3>Recent Activity</h3></div>
            <div className="db-activity">
              {activity.map((a, i) => (
                <div key={i} className="db-activity-row">
                  <div className="db-activity-row__icon" style={{ background: `${a.color}1a`, color: a.color }}>
                    {a.icon}
                  </div>
                  <div className="db-activity-row__body">
                    <p className="db-activity-row__text">{a.text}</p>
                    <span className="db-activity-row__time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="db-col">

          {/* Profile card */}
          <div className="db-card db-profile-card">
            <div className="db-profile-card__avatar">{user.name.charAt(0).toUpperCase()}</div>
            <h3 className="db-profile-card__name">{user.name}</h3>
            <p className="db-profile-card__email">{user.email}</p>
            <div className="db-profile-card__pills">
              {profile?.education     && <span className="db-pill">{profile.education}</span>}
              {profile?.branch        && <span className="db-pill">{profile.branch}</span>}
              {profile?.graduation_year && <span className="db-pill">{profile.graduation_year}</span>}
              {profile?.location      && <span className="db-pill">{profile.location}</span>}
              {profile?.preferred_role && <span className="db-pill db-pill--brand">{profile.preferred_role}</span>}
            </div>
            {!profileComplete && (
              <Link to="/profile" className="db-profile-card__cta">Complete Your Profile →</Link>
            )}
          </div>

          {/* Prep plan */}
          <div className="db-card">
            <div className="db-card__head">
              <h3>Preparation Plan</h3>
              <Link to="/preparation" className="db-card__link">View Plan →</Link>
            </div>
            <div className="db-prep-header">
              <div>
                <p className="db-prep-pct">{prepPct}%</p>
                <p className="db-prep-sub">{prepDone} of {prepTotal} topics done</p>
              </div>
              <Ring pct={prepPct} size={64} stroke={6} color="#8b5cf6"
                label={<span style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa" }}>{prepPct}%</span>} />
            </div>
            <div className="db-prep-weeks">
              {prepWeeks.map(({ week, theme, done, total }) => {
                const p = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={week} className="db-prep-week">
                    <div className="db-prep-week__head">
                      <span className="db-prep-week__label">{week}</span>
                      <span className="db-prep-week__theme">{theme}</span>
                      <span className="db-prep-week__count">{done}/{total}</span>
                    </div>
                    <div className="db-prep-week__bar">
                      <div style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job matches */}
          <div className="db-card">
            <div className="db-card__head">
              <h3>Top Job Matches</h3>
              <Link to="/jobs" className="db-card__link">All Jobs →</Link>
            </div>
            <div className="db-jobs">
              {JOBS.map(({ title, company, location, match }) => (
                <div key={title} className="db-job-row">
                  <div className="db-job-row__logo">{company.charAt(0)}</div>
                  <div className="db-job-row__info">
                    <p className="db-job-row__title">{title}</p>
                    <p className="db-job-row__meta">{company} · {location}</p>
                  </div>
                  <span className="db-job-row__match"
                    style={{ color: matchColor(match), borderColor: `${matchColor(match)}44`, background: `${matchColor(match)}12` }}>
                    {match}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
