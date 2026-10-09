import { useEffect, useRef, useState } from "react";
import API from "../api";
import "./PageShell.css";
import "./SkillGap.css";

/* ══════════════════ ROLE CATALOGUE ══════════════════ */
const ROLES = {
  "Software Engineer":          { skills:{ "Data Structures & Algorithms":85,"System Design":70,"React":80,"Node.js":75,"PostgreSQL":70,"Git":80,"Docker":60,"REST APIs":80,"TypeScript":65 }},
  "Frontend Developer":         { skills:{ "React":90,"TypeScript":80,"CSS":85,"JavaScript":90,"Figma":60,"REST APIs":80,"Git":80,"Web Performance":70,"Accessibility":65 }},
  "Backend Developer":          { skills:{ "Python":85,"FastAPI":75,"PostgreSQL":80,"REST APIs":85,"Docker":70,"AWS":60,"Redis":60,"System Design":70,"SQL":75 }},
  "Full Stack Developer":       { skills:{ "React":85,"Node.js":80,"PostgreSQL":75,"TypeScript":70,"Docker":65,"REST APIs":85,"Git":80,"System Design":65,"CSS":70 }},
  "Data Analyst":               { skills:{ "SQL":85,"Python":80,"Excel (Advanced)":75,"Power BI":70,"Statistics":70,"Tableau":65,"Data Visualisation":70,"Communication":75,"Pandas":70 }},
  "Machine Learning Engineer":  { skills:{ "Python":90,"TensorFlow":75,"PyTorch":70,"Machine Learning":85,"Statistics":80,"SQL":70,"Git":75,"Deep Learning":70,"Mathematics":80 }},
  "DevOps Engineer":            { skills:{ "AWS":80,"Docker":85,"Kubernetes":75,"CI/CD":80,"Linux":85,"Terraform":65,"Shell Scripting":75,"Monitoring":65,"Security":60 }},
  "Data Scientist":             { skills:{ "Python":90,"Machine Learning":85,"SQL":80,"Statistics":85,"Pandas":80,"NumPy":75,"Data Visualisation":70,"Communication":75,"Feature Engineering":70 }},
  "Mobile Developer":           { skills:{ "React Native":85,"JavaScript":80,"iOS/Android":75,"Redux":70,"REST APIs":80,"Git":80,"Push Notifications":65,"App Store":60,"Performance":70 }},
  "Cloud Architect":            { skills:{ "AWS":85,"GCP":70,"Azure":70,"Kubernetes":80,"Terraform":80,"Security":75,"Microservices":80,"Networking":75,"Cost Optimisation":65 }},
  "UI/UX Designer":             { skills:{ "Figma":90,"User Research":80,"Prototyping":85,"Design Systems":75,"CSS":65,"Accessibility":75,"A/B Testing":65,"Communication":80,"Sketch":60 }},
  "QA/SDET Engineer":           { skills:{ "Selenium":80,"Cypress":75,"API Testing":80,"CI/CD":70,"Python":70,"JavaScript":65,"Test Strategy":75,"BDD":65,"Performance Testing":60 }},
};

/* ══════════════════ RESOURCES PER SKILL ══════════════════ */
const RESOURCES = {
  "Data Structures & Algorithms": [{ label:"NeetCode 150",         url:"https://neetcode.io", type:"Practice" },{ label:"Striver's DSA Sheet", url:"https://takeuforward.org", type:"Sheet" }],
  "System Design":                [{ label:"System Design Primer", url:"https://github.com/donnemartin/system-design-primer", type:"GitHub" },{ label:"ByteByteGo Blog",       url:"https://blog.bytebytego.com", type:"Blog" }],
  "React":                        [{ label:"React Official Docs",  url:"https://react.dev", type:"Docs" },{ label:"Epic React",          url:"https://epicreact.dev", type:"Course" }],
  "Python":                       [{ label:"Python Docs",          url:"https://docs.python.org", type:"Docs" },{ label:"Real Python",          url:"https://realpython.com", type:"Blog" }],
  "JavaScript":                   [{ label:"javascript.info",      url:"https://javascript.info", type:"Guide" },{ label:"MDN Web Docs",         url:"https://developer.mozilla.org", type:"Docs" }],
  "TypeScript":                   [{ label:"TypeScript Handbook",  url:"https://typescriptlang.org/docs", type:"Docs" },{ label:"Total TypeScript",    url:"https://totaltypescript.com", type:"Course" }],
  "SQL":                          [{ label:"SQLZoo",               url:"https://sqlzoo.net", type:"Practice" },{ label:"Mode SQL Tutorial",    url:"https://mode.com/sql-tutorial", type:"Tutorial" }],
  "Machine Learning":             [{ label:"Fast.ai",              url:"https://fast.ai", type:"Course" },{ label:"Coursera ML (Andrew Ng)", url:"https://coursera.org/learn/machine-learning", type:"Course" }],
  "Docker":                       [{ label:"Docker Docs",          url:"https://docs.docker.com", type:"Docs" },{ label:"Play with Docker",      url:"https://labs.play-with-docker.com", type:"Practice" }],
  "AWS":                          [{ label:"AWS Skill Builder",    url:"https://skillbuilder.aws", type:"Official" },{ label:"Cloud Quest (free)",   url:"https://aws.amazon.com/training/digital/aws-cloud-quest", type:"Game" }],
  "Kubernetes":                   [{ label:"Kubernetes Docs",      url:"https://kubernetes.io/docs", type:"Docs" },{ label:"KodeKloud",            url:"https://kodekloud.com", type:"Course" }],
  "Statistics":                   [{ label:"Khan Academy Stats",   url:"https://khanacademy.org/math/statistics-probability", type:"Free" },{ label:"StatQuest (YouTube)",  url:"https://youtube.com/@statquest", type:"Video" }],
  "Node.js":                      [{ label:"Node.js Docs",         url:"https://nodejs.org/en/docs", type:"Docs" },{ label:"The Odin Project",      url:"https://theodinproject.com", type:"Course" }],
  "PostgreSQL":                   [{ label:"PostgreSQL Docs",      url:"https://postgresql.org/docs", type:"Docs" },{ label:"SQLZoo",               url:"https://sqlzoo.net", type:"Practice" }],
  "FastAPI":                      [{ label:"FastAPI Tutorial",     url:"https://fastapi.tiangolo.com/tutorial", type:"Docs" },{ label:"Real Python FastAPI",  url:"https://realpython.com/fastapi-python-web-apis", type:"Blog" }],
  "CSS":                          [{ label:"CSS Tricks",           url:"https://css-tricks.com", type:"Blog" },{ label:"MDN CSS",              url:"https://developer.mozilla.org/en-US/docs/Web/CSS", type:"Docs" }],
  "Git":                          [{ label:"Pro Git Book (free)",  url:"https://git-scm.com/book/en/v2", type:"Book" },{ label:"GitHub Skills",        url:"https://skills.github.com", type:"Practice" }],
  "REST APIs":                    [{ label:"REST API Tutorial",    url:"https://restfulapi.net", type:"Guide" },{ label:"Postman Learning",      url:"https://learning.postman.com", type:"Docs" }],
  "Linux":                        [{ label:"Linux Command Line",   url:"https://linuxcommand.org", type:"Guide" },{ label:"OverTheWire Bandit",    url:"https://overthewire.org/wargames/bandit", type:"Practice" }],
  "Terraform":                    [{ label:"Terraform Docs",       url:"https://developer.hashicorp.com/terraform/docs", type:"Docs" },{ label:"Terraform in 1hr (YT)", url:"https://www.youtube.com/watch?v=SLB_c_ayRMo", type:"Video" }],
  "Figma":                        [{ label:"Figma Learn",          url:"https://help.figma.com/hc/en-us/categories/360002051613", type:"Docs" },{ label:"Figma YT Channel",     url:"https://www.youtube.com/@Figma", type:"Video" }],
  "Selenium":                     [{ label:"Selenium Docs",        url:"https://selenium.dev/documentation", type:"Docs" },{ label:"Cypress Docs",          url:"https://docs.cypress.io", type:"Docs" }],
  "React Native":                 [{ label:"React Native Docs",    url:"https://reactnative.dev/docs/getting-started", type:"Docs" },{ label:"Expo Docs",             url:"https://docs.expo.dev", type:"Docs" }],
  "CI/CD":                        [{ label:"GitHub Actions Docs",  url:"https://docs.github.com/en/actions", type:"Docs" },{ label:"GitLab CI/CD",          url:"https://docs.gitlab.com/ee/ci", type:"Docs" }],
  "Deep Learning":                [{ label:"fast.ai DL Course",    url:"https://course.fast.ai", type:"Course" },{ label:"Stanford CS231n",       url:"https://cs231n.github.io", type:"Course" }],
  "Pandas":                       [{ label:"Pandas Docs",          url:"https://pandas.pydata.org/docs", type:"Docs" },{ label:"Kaggle Pandas",         url:"https://kaggle.com/learn/pandas", type:"Course" }],
  "Communication":                [{ label:"STAR Method",          url:"https://indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique", type:"Guide" },{ label:"Toastmasters",          url:"https://toastmasters.org", type:"Club" }],
  "Web Performance":              [{ label:"web.dev Performance",  url:"https://web.dev/performance", type:"Docs" },{ label:"Chrome DevTools",       url:"https://developer.chrome.com/docs/devtools", type:"Docs" }],
  "GCP":                          [{ label:"Google Cloud Skills Boost", url:"https://cloudskillsboost.google", type:"Official" }],
  "Azure":                        [{ label:"Microsoft Learn Azure", url:"https://learn.microsoft.com/en-us/azure", type:"Official" }],
};

/* ══════════════════ ROADMAP PER ROLE ══════════════════ */
const ROADMAP = {
  "Software Engineer": [
    { week:"Week 1–2",  focus:"DSA Foundations",        topics:"Arrays, Linked Lists, Stacks, Queues, Hash Maps",           skill:"Data Structures & Algorithms" },
    { week:"Week 3–4",  focus:"Algorithms",              topics:"Sorting, Binary Search, Two Pointer, Sliding Window, DP",   skill:"Data Structures & Algorithms" },
    { week:"Week 5–6",  focus:"React & TypeScript",      topics:"Components, Hooks, State management, TypeScript basics",    skill:"React" },
    { week:"Week 7–8",  focus:"Backend & Databases",     topics:"Node.js, REST APIs, PostgreSQL schema design",              skill:"Node.js" },
    { week:"Week 9–10", focus:"System Design",           topics:"Scalability, Caching, Load Balancing, DB choice",           skill:"System Design" },
    { week:"Week 11–12",focus:"DevOps & Deployment",     topics:"Docker, Git workflows, CI/CD basics, AWS EC2/S3",           skill:"Docker" },
  ],
  "Frontend Developer": [
    { week:"Week 1–2",  focus:"HTML, CSS & Layout",      topics:"Flexbox, Grid, Box model, Responsive design, BEM",         skill:"CSS" },
    { week:"Week 3–4",  focus:"JavaScript Deep Dive",    topics:"ES6+, async/await, closures, event loop, DOM manipulation", skill:"JavaScript" },
    { week:"Week 5–6",  focus:"React Fundamentals",      topics:"Components, Props, State, Hooks, React Router",             skill:"React" },
    { week:"Week 7–8",  focus:"TypeScript + Testing",    topics:"TypeScript basics, Jest, React Testing Library",            skill:"TypeScript" },
    { week:"Week 9–10", focus:"Performance & A11y",      topics:"Core Web Vitals, Lazy loading, WCAG 2.1 accessibility",    skill:"Web Performance" },
    { week:"Week 11–12",focus:"Advanced Patterns",       topics:"Design systems, micro-frontends, CI/CD, Storybook",         skill:"REST APIs" },
  ],
  "Backend Developer": [
    { week:"Week 1–2",  focus:"Python Core",             topics:"OOP, decorators, async I/O, error handling, testing",       skill:"Python" },
    { week:"Week 3–4",  focus:"FastAPI & REST",          topics:"Routes, Pydantic, Depends, middleware, Swagger docs",       skill:"FastAPI" },
    { week:"Week 5–6",  focus:"Databases & ORM",         topics:"PostgreSQL, SQLAlchemy, migrations, indexing strategies",   skill:"PostgreSQL" },
    { week:"Week 7–8",  focus:"Auth & Security",         topics:"JWT, OAuth2, bcrypt, CORS, rate limiting, input validation", skill:"REST APIs" },
    { week:"Week 9–10", focus:"Docker & Deployment",     topics:"Dockerfile, docker-compose, env vars, health checks",       skill:"Docker" },
    { week:"Week 11–12",focus:"Cloud & Scaling",         topics:"AWS EC2/S3/RDS, load balancer, auto-scaling, monitoring",   skill:"AWS" },
  ],
  "Full Stack Developer": [
    { week:"Week 1–2",  focus:"React & TypeScript",      topics:"Hooks, Context, Router, TypeScript interfaces",             skill:"React" },
    { week:"Week 3–4",  focus:"Node.js & Express",       topics:"REST APIs, middleware, authentication, file upload",        skill:"Node.js" },
    { week:"Week 5–6",  focus:"Databases",               topics:"PostgreSQL schema design, SQL queries, Redis caching",      skill:"PostgreSQL" },
    { week:"Week 7–8",  focus:"Docker & Dev Workflow",   topics:"Docker compose, git workflows, GitHub Actions CI/CD",       skill:"Docker" },
    { week:"Week 9–10", focus:"System Design Basics",    topics:"MVC, REST best practices, API versioning, rate limiting",   skill:"System Design" },
    { week:"Week 11–12",focus:"Deployment & Polish",     topics:"Vercel/Railway deploy, Nginx, monitoring, end-to-end tests",skill:"REST APIs" },
  ],
  "Data Analyst": [
    { week:"Week 1–2",  focus:"SQL Mastery",             topics:"Joins, Aggregations, Window Functions, CTEs, subqueries",   skill:"SQL" },
    { week:"Week 3–4",  focus:"Python for Data",         topics:"Pandas, NumPy, data cleaning, groupby, merge operations",   skill:"Python" },
    { week:"Week 5–6",  focus:"Statistics",              topics:"Probability, distributions, hypothesis testing, A/B tests", skill:"Statistics" },
    { week:"Week 7–8",  focus:"Data Visualisation",      topics:"Matplotlib, Seaborn, Tableau, Power BI dashboards",         skill:"Pandas" },
    { week:"Week 9–10", focus:"Business Analysis",       topics:"KPIs, stakeholder reporting, presentation skills",          skill:"Communication" },
    { week:"Week 11–12",focus:"Projects & Portfolio",    topics:"End-to-end analysis projects, GitHub + Kaggle showcase",    skill:"Python" },
  ],
  "Machine Learning Engineer": [
    { week:"Week 1–2",  focus:"Mathematics Refresher",   topics:"Linear algebra, calculus, probability, statistics",         skill:"Statistics" },
    { week:"Week 3–4",  focus:"ML Fundamentals",         topics:"Regression, classification, clustering, model evaluation",  skill:"Machine Learning" },
    { week:"Week 5–6",  focus:"Deep Learning",           topics:"Neural networks, backprop, CNNs, RNNs, transformers",       skill:"Deep Learning" },
    { week:"Week 7–8",  focus:"Frameworks",              topics:"TensorFlow, PyTorch, model training and optimisation",      skill:"Machine Learning" },
    { week:"Week 9–10", focus:"MLOps",                   topics:"MLflow, DVC, model serving with FastAPI, Docker",           skill:"Docker" },
    { week:"Week 11–12",focus:"Real Projects",           topics:"Kaggle competitions, end-to-end ML pipeline deployment",    skill:"Machine Learning" },
  ],
  "DevOps Engineer": [
    { week:"Week 1–2",  focus:"Linux & Shell",           topics:"Bash scripting, file permissions, process management, SSH", skill:"Linux" },
    { week:"Week 3–4",  focus:"Docker & Containers",     topics:"Dockerfile, multi-stage builds, docker-compose, registries", skill:"Docker" },
    { week:"Week 5–6",  focus:"Kubernetes",              topics:"Pods, Services, Deployments, Ingress, Helm charts",         skill:"Kubernetes" },
    { week:"Week 7–8",  focus:"CI/CD Pipelines",         topics:"GitHub Actions, Jenkins, pipeline stages, rollback strategy",skill:"CI/CD" },
    { week:"Week 9–10", focus:"Infrastructure as Code",  topics:"Terraform, Ansible, cloud provisioning, state management",  skill:"Terraform" },
    { week:"Week 11–12",focus:"Cloud & Monitoring",      topics:"AWS core services, CloudWatch, Prometheus, Grafana",        skill:"AWS" },
  ],
  "Data Scientist": [
    { week:"Week 1–2",  focus:"Python & Statistics",     topics:"NumPy, Pandas, probability distributions, hypothesis tests", skill:"Statistics" },
    { week:"Week 3–4",  focus:"ML Algorithms",           topics:"Regression, decision trees, ensemble methods, SVM",         skill:"Machine Learning" },
    { week:"Week 5–6",  focus:"Feature Engineering",     topics:"Missing data, encoding, scaling, feature selection, PCA",   skill:"Pandas" },
    { week:"Week 7–8",  focus:"Deep Learning",           topics:"Neural nets, CNNs for tabular, NLP basics, transfer learning",skill:"Deep Learning" },
    { week:"Week 9–10", focus:"SQL & Data Pipelines",    topics:"Advanced SQL, dbt, Airflow, BigQuery/Redshift basics",       skill:"SQL" },
    { week:"Week 11–12",focus:"Projects & Communication",topics:"End-to-end projects, stakeholder presentations, portfolio",  skill:"Communication" },
  ],
  "Mobile Developer": [
    { week:"Week 1–2",  focus:"React Native Basics",     topics:"Core components, Flexbox layout, navigation, state",        skill:"React Native" },
    { week:"Week 3–4",  focus:"State Management",        topics:"Redux Toolkit, Context API, Zustand, async storage",        skill:"React Native" },
    { week:"Week 5–6",  focus:"Native APIs",             topics:"Camera, location, notifications, biometrics, file system",  skill:"React Native" },
    { week:"Week 7–8",  focus:"Backend Integration",     topics:"REST APIs, auth tokens, real-time with WebSockets",         skill:"REST APIs" },
    { week:"Week 9–10", focus:"Performance & Testing",   topics:"Profiling, lazy loading, Detox for E2E, Jest unit tests",   skill:"React Native" },
    { week:"Week 11–12",focus:"Deployment",              topics:"App Store submission, Play Store, OTA updates with Expo",   skill:"React Native" },
  ],
  "Cloud Architect": [
    { week:"Week 1–2",  focus:"Cloud Fundamentals",      topics:"AWS core services: EC2, S3, IAM, VPC, RDS basics",          skill:"AWS" },
    { week:"Week 3–4",  focus:"Networking & Security",   topics:"VPC, subnets, security groups, NACLs, WAF, CloudFront",     skill:"AWS" },
    { week:"Week 5–6",  focus:"GCP & Azure Overview",    topics:"Compute, storage, identity on GCP and Azure",               skill:"GCP" },
    { week:"Week 7–8",  focus:"Infrastructure as Code",  topics:"Terraform modules, state, remote backends, CI/CD for IaC",  skill:"Terraform" },
    { week:"Week 9–10", focus:"Kubernetes at Scale",     topics:"EKS/GKE, autoscaling, service mesh, GitOps with ArgoCD",    skill:"Kubernetes" },
    { week:"Week 11–12",focus:"Cost & Architecture Review",topics:"Well-architected pillars, cost optimisation, FinOps",      skill:"AWS" },
  ],
  "UI/UX Designer": [
    { week:"Week 1–2",  focus:"Design Fundamentals",     topics:"Colour theory, typography, spacing, visual hierarchy",       skill:"Figma" },
    { week:"Week 3–4",  focus:"Figma Proficiency",       topics:"Components, auto-layout, variants, prototyping, handoff",   skill:"Figma" },
    { week:"Week 5–6",  focus:"User Research",           topics:"User interviews, surveys, affinity mapping, personas",       skill:"Communication" },
    { week:"Week 7–8",  focus:"UX Patterns",             topics:"Information architecture, user flows, wireframes, A/B test", skill:"Figma" },
    { week:"Week 9–10", focus:"Design Systems",          topics:"Token-based design, component libraries, documentation",     skill:"CSS" },
    { week:"Week 11–12",focus:"Portfolio & Handoff",     topics:"Case studies, Zeplin/Figma dev mode, accessibility audits", skill:"Communication" },
  ],
  "QA/SDET Engineer": [
    { week:"Week 1–2",  focus:"Testing Fundamentals",    topics:"SDLC, test types, test cases, bug reports, test plans",     skill:"Selenium" },
    { week:"Week 3–4",  focus:"Selenium WebDriver",      topics:"Locators, waits, Page Object Model, data-driven tests",     skill:"Selenium" },
    { week:"Week 5–6",  focus:"API Testing",             topics:"Postman, REST Assured, contract testing, mocking",          skill:"Selenium" },
    { week:"Week 7–8",  focus:"CI/CD Integration",       topics:"Jenkins/GitHub Actions, test reports, quality gates",       skill:"CI/CD" },
    { week:"Week 9–10", focus:"Performance Testing",     topics:"JMeter, load testing, stress testing, identifying bottlenecks",skill:"Selenium" },
    { week:"Week 11–12",focus:"Advanced Automation",     topics:"Cypress E2E, visual regression, BDD with Cucumber",         skill:"Selenium" },
  ],
};
const DEFAULT_ROADMAP = ROADMAP["Software Engineer"];

/* ══════════════════ SVG RADAR CHART ══════════════════ */
function RadarChart({ skills, size = 260 }) {
  const entries  = Object.entries(skills).slice(0, 8);
  const n        = entries.length;
  if (n < 3) return null;
  const cx = size / 2, cy = size / 2, maxR = size * 0.38;
  const angle = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const pt    = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];

  const gridLevels = [20, 40, 60, 80, 100];
  const userPoints = entries.map(([, v], i) => pt(i, (v.current / 100) * maxR));
  const reqPoints  = entries.map(([, v], i) => pt(i, (v.required / 100) * maxR));

  const poly = (pts) => pts.map(p => p.join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="sg-radar">
      {/* grid */}
      {gridLevels.map(lvl => (
        <polygon key={lvl}
          points={poly(entries.map((_, i) => pt(i, (lvl / 100) * maxR)))}
          fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* axes */}
      {entries.map((_, i) => {
        const [x, y] = pt(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {/* required area */}
      <polygon points={poly(reqPoints)} fill="rgba(99,102,241,.10)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* user area */}
      <polygon points={poly(userPoints)} fill="rgba(16,185,129,.18)" stroke="#10b981" strokeWidth="2" />
      {/* labels */}
      {entries.map(([name], i) => {
        const r = maxR + 22;
        const [x, y] = pt(i, r);
        return (
          <text key={name} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill="#64748b" fontWeight="600"
            style={{ maxWidth: 60 }}>
            {name.length > 12 ? name.slice(0,11)+"…" : name}
          </text>
        );
      })}
      {/* dots */}
      {userPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

/* ══════════════════ SKILL SLIDER ROW ══════════════════ */
function SkillSliderRow({ name, current, required, color, onUpdate }) {
  const gap     = Math.max(0, required - current);
  const status  = current >= required ? "met" : gap <= 12 ? "close" : "gap";
  const res     = RESOURCES[name];

  return (
    <div className="sg-skill-row">
      <div className="sg-skill-row__head">
        <span className="sg-skill-row__name">{name}</span>
        <div className="sg-skill-row__badges">
          <span className={`sg-pill sg-pill--${status}`}>
            {status === "met" ? "✓ Met" : status === "close" ? "≈ Close" : `⚠ Gap ${gap}%`}
          </span>
          <span className="sg-skill-row__req-label">Need {required}%</span>
        </div>
      </div>

      {/* interactive slider */}
      <div className="sg-slider-wrap">
        <input
          type="range" min={0} max={100} step={5}
          value={current}
          onChange={e => onUpdate(name, Number(e.target.value))}
          className="sg-slider"
          style={{ "--fill": `${current}%`, "--color": color }}
        />
        <span className="sg-slider-val" style={{ color }}>{current}%</span>
      </div>

      {/* bar visual */}
      <div className="sg-skill-row__track">
        <div className="sg-skill-row__fill"  style={{ width:`${current}%`, background:color }} />
        {gap > 0 && <div className="sg-skill-row__gap" style={{ width:`${gap}%`, left:`${current}%` }} />}
        <div className="sg-skill-row__req"   style={{ left:`${required}%` }} title={`Required: ${required}%`} />
      </div>

      {/* resources */}
      {status !== "met" && res && (
        <div className="sg-skill-row__resources">
          {res.map(r => (
            <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="sg-resource-chip">
              <span className="sg-resource-chip__type">{r.type}</span>
              {r.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════ MAIN COMPONENT ══════════════════ */
const SKILL_COLORS = ["#6366f1","#10b981","#f59e0b","#ec4899","#0ea5e9","#8b5cf6","#ef4444","#14b8a6","#f97316"];

export default function SkillGap() {
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [overrides,  setOverrides]  = useState({});   // user slider adjustments
  const [showRoadmap,setShowRoadmap]= useState(true);
  const [activeWeek, setActiveWeek] = useState(null);
  const [endorsedSkills, setEndorsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("endorsed_skills") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    API.get("/profile")
      .then(r => {
        setProfile(r.data);
        if (r.data?.preferred_role && ROLES[r.data.preferred_role]) {
          setTargetRole(r.data.preferred_role);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* persist overrides & endorsements */
  useEffect(() => {
    localStorage.setItem("endorsed_skills", JSON.stringify(endorsedSkills));
  }, [endorsedSkills]);

  if (loading) return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">SKILL GAP</p>
        <h1 className="page-shell__title">Loading…</h1>
      </div>
    </div>
  );

  /* ── Build skill data ── */
  const requirements   = ROLES[targetRole]?.skills || ROLES["Software Engineer"].skills;
  const profileSkills  = profile?.skills
    ? profile.skills.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  /* baseline from profile: 70 if present, 25 if missing */
  const baseline = {};
  profileSkills.forEach((s, i) => { baseline[s] = 60 + (i % 5) * 6; });

  /* merge with overrides */
  const skillData = Object.entries(requirements).map(([name, req], i) => {
    const base    = baseline[name] ?? 25;
    const current = overrides[name] ?? base;
    return { name, current, required: req, color: SKILL_COLORS[i % SKILL_COLORS.length] };
  });

  /* summary counts */
  const gaps  = skillData.filter(s => s.current < s.required - 12);
  const close = skillData.filter(s => s.current >= s.required - 12 && s.current < s.required);
  const met   = skillData.filter(s => s.current >= s.required);

  const readinessPct = skillData.length > 0
    ? Math.round(skillData.reduce((a, s) => a + Math.min(s.current / s.required, 1), 0) / skillData.length * 100)
    : 0;

  /* radar data shape */
  const radarData = Object.fromEntries(
    skillData.slice(0, 8).map(s => [s.name, { current: s.current, required: s.required }])
  );

  /* handlers */
  const updateSkill = (name, val) => setOverrides(p => ({ ...p, [name]: val }));
  const resetAll    = () => setOverrides({});

  const toggleEndorse = (name) => {
    setEndorsed(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const roadmap = ROADMAP[targetRole] || ROADMAP["Software Engineer"];

  return (
    <div className="page-shell">

      {/* ── HEADER ── */}
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">SKILL GAP</p>
        <h1 className="page-shell__title">Skill Gap Analysis</h1>
        <p className="page-shell__sub">
          Adjust sliders to reflect your real skill level. See exactly where you stand vs requirements and follow the roadmap to close gaps.
        </p>
      </div>

      {/* profile skills info banner */}
      {!profile?.skills && (
        <div className="coming-soon-banner">
          <span className="coming-soon-banner__icon">💡</span>
          <span>
            Add your skills and preferred role in your{" "}
            <a href="/profile" style={{ color:"#92400e", fontWeight:700 }}>Profile</a>{" "}
            for auto-filled skill levels. Using default baseline for <strong>{targetRole}</strong>.
          </span>
        </div>
      )}

      {/* ── ROLE SWITCHER ── */}
      <div className="sg-role-panel">
        <div className="sg-role-panel__left">
          <p className="sg-role-panel__label">Target Role</p>
          <div className="sg-role-grid">
            {Object.keys(ROLES).map(role => (
              <button
                key={role}
                className={`sg-role-btn${targetRole === role ? " active" : ""}`}
                onClick={() => { setTargetRole(role); setOverrides({}); }}>
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="sg-role-panel__right">
          <p className="sg-role-panel__hint">
            Showing requirements for <strong>{targetRole}</strong>
          </p>
          {overrides && Object.keys(overrides).length > 0 && (
            <button className="sg-reset-btn" onClick={resetAll}>↺ Reset Adjustments</button>
          )}
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="sg-summary">
        <div className="sg-chip sg-chip--overall">
          <span className="sg-chip__icon">🎯</span>
          <span className="sg-chip__val">{readinessPct}%</span>
          <span className="sg-chip__lbl">Overall Readiness</span>
          <div className="sg-chip__bar"><div style={{ width:`${readinessPct}%`, background:"#6366f1" }} /></div>
        </div>
        <div className="sg-chip sg-chip--gap">
          <span className="sg-chip__icon">⚠️</span>
          <span className="sg-chip__val">{gaps.length}</span>
          <span className="sg-chip__lbl">Skill Gaps</span>
        </div>
        <div className="sg-chip sg-chip--close">
          <span className="sg-chip__icon">📈</span>
          <span className="sg-chip__val">{close.length}</span>
          <span className="sg-chip__lbl">Almost There</span>
        </div>
        <div className="sg-chip sg-chip--met">
          <span className="sg-chip__icon">✅</span>
          <span className="sg-chip__val">{met.length}</span>
          <span className="sg-chip__lbl">Requirements Met</span>
        </div>
      </div>

      {/* ── MAIN GRID: radar + sliders ── */}
      <div className="sg-main-grid">

        {/* Radar chart */}
        <div className="page-card sg-radar-card">
          <h3 className="sg-section-title">Skill Radar</h3>
          <p className="sg-section-sub">
            <span style={{ color:"#10b981" }}>●</span> Your level &nbsp;
            <span style={{ color:"#6366f1" }}>◌</span> Required level
          </p>
          <div className="sg-radar-wrap">
            <RadarChart skills={radarData} size={280} />
          </div>
          <p className="sg-radar-hint">Drag sliders on the right to update the chart in real time.</p>
        </div>

        {/* Skill sliders */}
        <div className="page-card sg-sliders-card">
          <div className="sg-sliders-header">
            <h3 className="sg-section-title">Self-Assessment Sliders</h3>
            <p className="sg-section-sub">Drag each slider to your honest current level.</p>
          </div>
          <div className="sg-skills">
            {skillData.map(s => (
              <SkillSliderRow key={s.name} {...s} onUpdate={updateSkill} />
            ))}
          </div>
        </div>
      </div>

      {/* ── ENDORSED SKILLS (chips) ── */}
      <div className="page-card">
        <h3 className="sg-section-title">🏅 Skill Endorsements</h3>
        <p className="sg-section-sub">Mark skills you are confident in. These are saved to your profile context.</p>
        <div className="sg-endorse-grid">
          {skillData.map(s => {
            const isEndorsed = endorsedSkills.includes(s.name);
            return (
              <button
                key={s.name}
                className={`sg-endorse-chip${isEndorsed ? " endorsed" : ""}`}
                style={isEndorsed
                  ? { background:`${s.color}18`, border:`1.5px solid ${s.color}`, color:s.color }
                  : {}}
                onClick={() => toggleEndorse(s.name)}
              >
                {isEndorsed ? "✓ " : ""}{s.name}
              </button>
            );
          })}
        </div>
        {endorsedSkills.length > 0 && (
          <p className="sg-endorse-count">{endorsedSkills.length} skill{endorsedSkills.length !== 1 ? "s" : ""} endorsed</p>
        )}
      </div>

      {/* ── PRIORITY GAPS ── */}
      {gaps.length > 0 && (
        <div className="page-card">
          <h3 className="sg-section-title">🚀 Priority Gaps — Focus Here First</h3>
          <div className="sg-priority-grid">
            {gaps.sort((a,b) => (b.required - b.current) - (a.required - a.current)).slice(0,6).map(s => {
              const gapPct = s.required - s.current;
              const res    = RESOURCES[s.name];
              return (
                <div key={s.name} className="sg-priority-card" style={{ borderTop:`3px solid ${s.color}` }}>
                  <div className="sg-priority-card__head">
                    <span className="sg-priority-card__name">{s.name}</span>
                    <span className="sg-priority-card__gap" style={{ color:s.color }}>Gap: {gapPct}%</span>
                  </div>
                  <div className="sg-priority-card__bars">
                    <div className="sg-priority-card__bar-row">
                      <span>You</span>
                      <div className="sg-priority-bar"><div style={{ width:`${s.current}%`, background:s.color }} /></div>
                      <span>{s.current}%</span>
                    </div>
                    <div className="sg-priority-card__bar-row">
                      <span>Need</span>
                      <div className="sg-priority-bar"><div style={{ width:`${s.required}%`, background:"#e2e8f0" }} /></div>
                      <span>{s.required}%</span>
                    </div>
                  </div>
                  {res && (
                    <div className="sg-priority-card__links">
                      {res.map(r => (
                        <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="sg-resource-chip">
                          <span className="sg-resource-chip__type">{r.type}</span>
                          {r.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEARNING ROADMAP ── */}
      <div className="page-card">
        <div className="sg-roadmap-header">
          <div>
            <h3 className="sg-section-title">📅 Learning Roadmap — {targetRole}</h3>
            <p className="sg-section-sub">12-week structured plan to reach role readiness.</p>
          </div>
          <button className="sg-roadmap-toggle" onClick={() => setShowRoadmap(!showRoadmap)}>
            {showRoadmap ? "▲ Collapse" : "▼ Expand"}
          </button>
        </div>

        {showRoadmap && (
          <div className="sg-roadmap">
            {roadmap.map((step, i) => {
              const skillEntry = skillData.find(s => s.name === step.skill);
              const done       = skillEntry ? skillEntry.current >= (skillEntry.required - 10) : false;
              const isActive   = activeWeek === i;
              return (
                <div key={i}
                  className={`sg-roadmap-item${done ? " done" : ""}${isActive ? " active" : ""}`}
                  onClick={() => setActiveWeek(isActive ? null : i)}>
                  <div className="sg-roadmap-item__num">{i + 1}</div>
                  <div className="sg-roadmap-item__content">
                    <div className="sg-roadmap-item__head">
                      <span className="sg-roadmap-item__week">{step.week}</span>
                      <span className="sg-roadmap-item__focus">{step.focus}</span>
                      {done && <span className="sg-roadmap-item__done-pill">✓ Ready</span>}
                    </div>
                    {isActive && (
                      <div className="sg-roadmap-item__detail">
                        <p className="sg-roadmap-item__topics">{step.topics}</p>
                        {RESOURCES[step.skill] && (
                          <div className="sg-roadmap-item__resources">
                            {RESOURCES[step.skill].map(r => (
                              <a key={r.label} href={r.url} target="_blank" rel="noreferrer"
                                className="sg-resource-chip">
                                <span className="sg-resource-chip__type">{r.type}</span>
                                {r.label} →
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="sg-roadmap-item__chevron">{isActive ? "▲" : "▼"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
