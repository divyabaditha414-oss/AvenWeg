import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const FEATURES = [
  {
    icon: "📄",
    title: "AI Resume Analysis",
    desc: "Upload your resume and get instant AI-powered feedback. Score your resume, identify weak sections, and receive tailored suggestions to beat ATS filters.",
    tag: "Resume",
  },
  {
    icon: "🎯",
    title: "Smart Job Matching",
    desc: "Our algorithm analyses your skills, education, and preferred role to surface the most relevant opportunities — ranked by compatibility score.",
    tag: "Jobs",
  },
  {
    icon: "📋",
    title: "Application Tracker",
    desc: "Never lose track of where you stand. Log every application, track status from Applied to Offered, and keep notes against each company.",
    tag: "Applications",
  },
  {
    icon: "🧠",
    title: "Skill Gap Analysis",
    desc: "See exactly which skills are missing for your target role. Get a visual breakdown of your current level vs. what recruiters expect.",
    tag: "Skills",
  },
  {
    icon: "📚",
    title: "Placement Preparation",
    desc: "Follow a structured 4-week study plan covering DSA, system design, web concepts, and behavioural questions — all in one place.",
    tag: "Prep",
  },
  {
    icon: "🎤",
    title: "AI Mock Interviews",
    desc: "Practice with 150+ real interview questions across 6 categories. Get instant feedback on your answers and improve round by round.",
    tag: "Interviews",
  },
];

const STEPS = [
  { n: "01", icon: "👤", title: "Create Your Profile",    desc: "Add your education, branch, graduation year, and target role. Takes under 2 minutes." },
  { n: "02", icon: "📄", title: "Upload Your Resume",     desc: "Drop your PDF resume. AI analyses it instantly and gives you an improvement score." },
  { n: "03", icon: "💼", title: "Discover Job Matches",   desc: "Browse smart-ranked job listings tailored to your skills and academic background." },
  { n: "04", icon: "🧠", title: "Close Skill Gaps",       desc: "Work through your personalised study plan and track readiness week over week." },
  { n: "05", icon: "🚀", title: "Prepare & Get Hired",    desc: "Practice mock interviews, get AI feedback, and walk into every interview confident." },
];

const STATS = [
  { value: "10K+",  label: "Students Registered" },
  { value: "85%",   label: "Placement Success Rate" },
  { value: "500+",  label: "Companies Tracked" },
  { value: "150+",  label: "Interview Questions" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "SDE @ Amazon",
    college: "NIT Warangal, CSE 2026",
    text: "The resume analyser showed me exactly why I was getting rejected. After fixing those issues my callback rate went from 10% to 65% in three weeks.",
    avatar: "P",
    color: "#7c3aed",
  },
  {
    name: "Arjun Mehta",
    role: "Frontend Engineer @ Flipkart",
    college: "VIT Vellore, IT 2026",
    text: "Mock interview practice here is better than anything else I tried. The structured questions and feedback helped me crack Flipkart in my second attempt.",
    avatar: "A",
    color: "#0891b2",
  },
  {
    name: "Sneha Reddy",
    role: "Data Analyst @ Infosys",
    college: "JNTUH, CSE 2025",
    text: "Skill gap analysis told me I was weak in SQL and Power BI for DA roles. I focused there for 3 weeks and landed an offer. Exactly what I needed.",
    avatar: "S",
    color: "#059669",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-page">

      {/* ════════════════════════════════ NAVBAR */}
      <header className="h-nav" id="home">
        <div className="h-nav__inner">
          
<Link to="/" className="h-nav__logo">
  <span className="h-nav__logo-mark">✦</span>
  AvenWeg
</Link>


          <nav className="h-nav__links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="h-nav__actions">
            <Link to="/login"    className="h-nav__signin">Sign In</Link>
            <Link to="/register" className="h-nav__signup">Get Started</Link>
          </div>

          <button
            className="h-nav__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {menuOpen && (
          <div className="h-nav__drawer">
            <a href="#home"         onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#features"     onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#about"        onClick={() => setMenuOpen(false)}>About</a>
            <div className="h-nav__drawer-btns">
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="h-nav__signin">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="h-nav__signup">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════ HERO */}
      <section className="h-hero">
        {/* background grid */}
        <div className="h-hero__grid" aria-hidden="true" />

        {/* glow blobs */}
        <div className="h-hero__blob h-hero__blob--1" aria-hidden="true" />
        <div className="h-hero__blob h-hero__blob--2" aria-hidden="true" />

        <div className="h-hero__inner">
          <div className="h-hero__content">
            <div className="h-hero__badge">
              <span className="h-hero__badge-dot" />
              AI-Powered Career Platform
            </div>

            <h1 className="h-hero__heading">
              Build Your Career.<br />
              <span className="h-hero__heading-accent">Get Hired Smarter.</span>
            </h1>

            <p className="h-hero__sub">
              The all-in-one placement companion for students — AI resume analysis,
              smart job matching, skill gap tracking, mock interviews, and personalised
              preparation plans, all in one dashboard.
            </p>

            <div className="h-hero__btns">
              <Link to="/register" className="h-btn h-btn--primary">
                Start for Free →
              </Link>
              <a href="#features" className="h-btn h-btn--ghost">
                See Features
              </a>
            </div>

            <div className="h-hero__trust">
              <div className="h-hero__avatars">
                {["P","A","S","R","K"].map((l, i) => (
                  <div key={i} className="h-hero__avatar">{l}</div>
                ))}
              </div>
              <p><strong>10,000+</strong> students accelerating their careers</p>
            </div>
          </div>

          {/* ── HERO DASHBOARD CARD ── */}
          <div className="h-hero__card" aria-hidden="true">
            <div className="h-card__topbar">
              <div className="h-card__dots">
                <span /><span /><span />
              </div>
              <span className="h-card__url">AvenWeg· Dashboard</span>
            </div>

            <div className="h-card__body">
              <div className="h-card__welcome">
                <div className="h-card__avatar">A</div>
                <div>
                  <p className="h-card__name">Welcome back, Arjun 👋</p>
                  <p className="h-card__sub">Your readiness improved 12% this week</p>
                </div>
              </div>

              <div className="h-card__stats">
                <div className="h-card__stat">
                  <span className="h-card__stat-val">82</span>
                  <span className="h-card__stat-lbl">Resume Score</span>
                  <div className="h-card__stat-bar">
                    <div style={{ width: "82%" }} />
                  </div>
                </div>
                <div className="h-card__stat">
                  <span className="h-card__stat-val">24</span>
                  <span className="h-card__stat-lbl">Job Matches</span>
                  <div className="h-card__stat-bar">
                    <div style={{ width: "60%", background: "#10b981" }} />
                  </div>
                </div>
                <div className="h-card__stat">
                  <span className="h-card__stat-val">74%</span>
                  <span className="h-card__stat-lbl">Readiness</span>
                  <div className="h-card__stat-bar">
                    <div style={{ width: "74%", background: "#f59e0b" }} />
                  </div>
                </div>
              </div>

              <div className="h-card__activity">
                <p className="h-card__activity-title">Recent Activity</p>
                {[
                  { dot: "#6366f1", text: "Resume analysed — score improved to 82" },
                  { dot: "#10b981", text: "Applied to Software Engineer @ TechCorp" },
                  { dot: "#f59e0b", text: "Completed Week 1 DSA preparation plan" },
                ].map((a, i) => (
                  <div key={i} className="h-card__activity-row">
                    <span className="h-card__activity-dot" style={{ background: a.dot }} />
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ STATS BAR */}
      <div className="h-stats-bar">
        <div className="h-stats-bar__inner">
          {STATS.map(({ value, label }) => (
            <div className="h-stat" key={label}>
              <span className="h-stat__val">{value}</span>
              <span className="h-stat__lbl">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════ FEATURES */}
      <section className="h-section" id="features">
        <div className="h-section__head">
          <span className="h-eyebrow">POWERFUL FEATURES</span>
          <h2>Everything you need to land your first role</h2>
          <p>Six core tools. One dashboard. No juggling between apps.</p>
        </div>

        <div className="h-features__grid">
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div className="h-feat" key={title}>
              <div className="h-feat__top">
                <div className="h-feat__icon">{icon}</div>
                <span className="h-feat__tag">{tag}</span>
              </div>
              <h3 className="h-feat__title">{title}</h3>
              <p className="h-feat__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS */}
      <section className="h-section h-how" id="how-it-works">
        <div className="h-section__head">
          <span className="h-eyebrow">SIMPLE PROCESS</span>
          <h2>From registration to placement in 5 steps</h2>
          <p>A clear, guided path from your first login to your first offer.</p>
        </div>

        <div className="h-steps">
          {STEPS.map(({ n, icon, title, desc }, i) => (
            <div className="h-step" key={n}>
              <div className="h-step__connector" aria-hidden="true" />
              <div className="h-step__num">{n}</div>
              <div className="h-step__icon-wrap">{icon}</div>
              <h3 className="h-step__title">{title}</h3>
              <p className="h-step__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ ABOUT */}
      <section className="h-section h-about" id="about">
        <div className="h-about__inner">
          <div className="h-about__text">
            <span className="h-eyebrow">ABOUT THE PLATFORM</span>
            <h2>Built for placement-focused students</h2>
            <p>
              Most students use 5–6 disconnected tools during their job search —
              a resume builder here, a job board there, a YouTube playlist somewhere else.
              
               AvenWeg brings everything into one cohesive platform

            </p>
            <p>
              Whether you are in your final year, just graduated, or looking for a
              career switch — the platform guides you step by step with AI that
              understands the Indian placement ecosystem.
            </p>
            <div className="h-about__chips">
              {[
                { icon: "🎓", text: "Built for students" },
                { icon: "🤖", text: "AI at the core" },
                { icon: "📈", text: "Progress tracking" },
                { icon: "🔒", text: "Private & secure" },
                { icon: "🇮🇳", text: "India-first design" },
                { icon: "⚡", text: "Instant feedback" },
              ].map(({ icon, text }) => (
                <div className="h-about__chip" key={text}>
                  <span>{icon}</span><strong>{text}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="h-about__visual">
            <div className="h-about__ring-card">
              <div className="h-about__ring-label">Placement Readiness</div>
              <div className="h-about__ring-wrap">
                <svg viewBox="0 0 120 120" width="160" height="160">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#6366f1" strokeWidth="10"
                    strokeDasharray="220 314.16" strokeLinecap="round"
                    transform="rotate(-90 60 60)" />
                </svg>
                <div className="h-about__ring-inner">
                  <span className="h-about__ring-pct">70%</span>
                  <span className="h-about__ring-sub">Ready</span>
                </div>
              </div>
              <div className="h-about__ring-items">
                {[
                  { label: "Resume",    pct: 82, color: "#6366f1" },
                  { label: "Skills",    pct: 64, color: "#10b981" },
                  { label: "Interview", pct: 55, color: "#f59e0b" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="h-about__ring-item">
                    <span>{label}</span>
                    <div className="h-about__mini-bar">
                      <div style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ TESTIMONIALS */}
      <section className="h-section h-testimonials">
        <div className="h-section__head">
          <span className="h-eyebrow">STUDENT STORIES</span>
          <h2>Real results from real students</h2>
          <p>Hear from students who used the platform to land their first offer.</p>
        </div>

        <div className="h-testimonials__grid">
          {TESTIMONIALS.map(({ name, role, college, text, avatar, color }) => (
            <div className="h-tcard" key={name}>
              <div className="h-tcard__quote">"</div>
              <p className="h-tcard__text">{text}</p>
              <div className="h-tcard__author">
                <div className="h-tcard__avatar" style={{ background: color }}>{avatar}</div>
                <div>
                  <p className="h-tcard__name">{name}</p>
                  <p className="h-tcard__role">{role}</p>
                  <p className="h-tcard__college">{college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ CTA */}
      <section className="h-cta">
        <div className="h-cta__glow" aria-hidden="true" />
        <div className="h-cta__inner">
          <span className="h-eyebrow">GET STARTED TODAY</span>
          <h2>Your placement journey starts here.</h2>
          <p>
            Create a free account in under 60 seconds. No credit card required.
            Start building the career you deserve.
          </p>
          <div className="h-cta__btns">
            <Link to="/register" className="h-btn h-btn--primary h-btn--lg">
              Create Free Account →
            </Link>
            <Link to="/login" className="h-btn h-btn--outline h-btn--lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ FOOTER */}
      <footer className="h-footer">
        <div className="h-footer__inner">
          <div className="h-footer__brand">
            <span className="h-footer__logo-mark">✦</span>
            <span>AvenWeg</span>
          </div>
          <p className="h-footer__tagline">Your AI-powered placement companion.</p>
          <span className="h-footer__copy">© 2026 AvenWeg. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
