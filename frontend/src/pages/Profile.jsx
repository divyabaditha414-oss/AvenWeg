import { useEffect, useRef, useState } from "react";
import API from "../api";
import "./Profile.css";

/* ═══════════════════════════════════════════════
   STATIC DATA — dropdown options
═══════════════════════════════════════════════ */
const EDUCATION_LEVELS = [
  "B.Tech / B.E.",
  "B.Sc",
  "B.Com",
  "B.A.",
  "BCA",
  "BBA",
  "B.Arch",
  "B.Pharm",
  "Diploma (Engineering)",
  "Diploma (Other)",
  "M.Tech / M.E.",
  "M.Sc",
  "MCA",
  "MBA",
  "M.A.",
  "M.Com",
  "Ph.D.",
  "12th / HSC",
  "Other",
];

const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Data Science",
  "Artificial Intelligence & ML",
  "Cyber Security",
  "Cloud Computing",
  "IoT (Internet of Things)",
  "Robotics & Automation",
  "Mathematics & Computing",
  "Physics",
  "Chemistry",
  "Commerce",
  "Economics",
  "Business Administration",
  "Other",
];

const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad", "IIT Pune",
  "NIT Warangal", "NIT Trichy", "NIT Surathkal", "NIT Calicut",
  "NIT Rourkela", "NIT Allahabad",
  "BITS Pilani", "BITS Goa", "BITS Hyderabad",
  "VIT Vellore", "VIT Chennai", "VIT Bhopal",
  "SRM Institute of Science and Technology",
  "Manipal Institute of Technology",
  "Amity University",
  "Thapar Institute of Engineering and Technology",
  "PES University",
  "RV College of Engineering",
  "BMS College of Engineering",
  "Ramaiah Institute of Technology",
  "Anna University",
  "Osmania University",
  "JNTU Hyderabad",
  "Pune University",
  "Mumbai University",
  "Delhi University",
  "Bangalore University",
  "Calicut University",
  "Other",
];

const GRADUATION_YEARS = Array.from({ length: 12 }, (_, i) => 2019 + i);

const EXPERIENCE_LEVELS = [
  "Fresher (No experience)",
  "Intern (< 6 months)",
  "Entry Level (0–1 year)",
  "Junior (1–2 years)",
  "Mid Level (3–5 years)",
  "Senior (5+ years)",
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
  "Remote (Full-time)",
  "Remote (Part-time)",
  "Hybrid",
  "Open to All",
];

const AVAILABILITY_OPTIONS = [
  "Immediately Available",
  "Within 2 weeks",
  "Within 1 month",
  "Within 2 months",
  "Within 3 months",
  "Not actively looking",
];

const SALARY_RANGES = [
  "0–3 LPA",
  "3–5 LPA",
  "5–8 LPA",
  "8–12 LPA",
  "12–18 LPA",
  "18–25 LPA",
  "25+ LPA",
  "Stipend (Internship)",
];

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const PREFERRED_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer (Android)",
  "Mobile App Developer (iOS)",
  "React Native Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Site Reliability Engineer (SRE)",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Engineer",
  "Business Analyst",
  "Product Manager",
  "UI/UX Designer",
  "QA / Test Engineer",
  "Cybersecurity Analyst",
  "Blockchain Developer",
  "Embedded Systems Engineer",
  "Network Engineer",
  "Database Administrator",
  "Technical Writer",
  "System Administrator",
  "Research Engineer",
  "Consultant",
  "Other",
];

const CITIES = [
  "Hyderabad", "Bengaluru", "Mumbai", "Delhi / NCR", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat", "Lucknow",
  "Kochi", "Chandigarh", "Indore", "Nagpur", "Coimbatore",
  "Visakhapatnam", "Bhubaneswar", "Thiruvananthapuram",
  "Noida", "Gurgaon", "Navi Mumbai", "Thane", "Remote",
];

const ALL_SKILLS = [
  // Languages
  "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", "Go",
  "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R", "MATLAB",
  // Web
  "HTML", "CSS", "React", "Vue.js", "Angular", "Next.js", "Node.js",
  "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel",
  // Mobile
  "React Native", "Flutter", "Android (Kotlin)", "iOS (Swift)",
  // Data / AI
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
  "Matplotlib", "Seaborn", "OpenCV", "Hugging Face",
  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle DB",
  "Firebase", "DynamoDB", "Cassandra", "Elasticsearch",
  // Cloud / DevOps
  "AWS", "Google Cloud (GCP)", "Microsoft Azure", "Docker", "Kubernetes",
  "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Ansible",
  "Linux", "Shell Scripting", "Nginx",
  // Tools
  "Git", "GitHub", "Postman", "VS Code", "Jira", "Figma",
  "Tableau", "Power BI", "Excel (Advanced)", "Notion",
  // CS Concepts
  "Data Structures & Algorithms", "System Design", "OOP",
  "REST APIs", "GraphQL", "WebSockets", "Microservices",
  "Design Patterns", "Operating Systems", "Computer Networks",
  "Database Design", "Agile / Scrum",
];

const CERTIFICATIONS_LIST = [
  "AWS Certified Solutions Architect",
  "AWS Certified Developer",
  "Google Professional Cloud Architect",
  "Google Associate Cloud Engineer",
  "Microsoft Azure Fundamentals (AZ-900)",
  "Microsoft Azure Developer (AZ-204)",
  "Certified Kubernetes Administrator (CKA)",
  "Docker Certified Associate",
  "Meta Front-End Developer Certificate",
  "Meta Back-End Developer Certificate",
  "Google Data Analytics Certificate",
  "IBM Data Science Professional Certificate",
  "TensorFlow Developer Certificate",
  "Oracle Java SE Certification",
  "CompTIA Security+",
  "Certified Ethical Hacker (CEH)",
  "PMP (Project Management Professional)",
  "Scrum Master (CSM)",
  "Salesforce Administrator",
  "HackerRank Problem Solving (Gold)",
  "Coursera / edX — Machine Learning (Stanford)",
  "NPTEL Certification",
  "Other",
];

const PROGRAMMING_LANGUAGES = [
  "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#",
  "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R",
  "MATLAB", "Dart", "Perl", "Haskell", "Lua", "Shell / Bash",
  "SQL", "PL/SQL", "Assembly",
];

const TOOLS_LIST = [
  "Git & GitHub", "Docker", "Kubernetes", "Postman", "VS Code",
  "IntelliJ IDEA", "PyCharm", "Eclipse", "Android Studio", "Xcode",
  "Figma", "Adobe XD", "Sketch", "Jira", "Confluence", "Trello",
  "Notion", "Slack", "Linux / Unix", "Windows Server",
  "Tableau", "Power BI", "Excel (Advanced)", "Google Analytics",
  "Selenium", "Jest", "Cypress", "JUnit", "Pytest",
  "Webpack", "Vite", "Babel", "ESLint", "Prettier",
];

/* ═══════════════════════════════════════════════
   REUSABLE COMPONENTS
═══════════════════════════════════════════════ */

/* Searchable dropdown with options list */
function SearchableSelect({ id, label, value, onChange, options, placeholder, required }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));
  const display  = value || "";

  const select = (opt) => { onChange(opt); setQuery(""); setOpen(false); };
  const clear   = (e) => { e.stopPropagation(); onChange(""); setQuery(""); };

  return (
    <div className="pf-field" ref={ref}>
      {label && <label className="pf-label" htmlFor={id}>{label}{required && <span className="pf-required">*</span>}</label>}
      <div className={`pf-select${open ? " pf-select--open" : ""}`} onClick={() => setOpen(!open)} id={id}>
        {open ? (
          <input
            className="pf-select__search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${label || ""}…`}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={`pf-select__value${!display ? " pf-select__value--placeholder" : ""}`}>
            {display || placeholder || `Select ${label || "option"}…`}
          </span>
        )}
        <div className="pf-select__actions">
          {display && !open && <button className="pf-select__clear" onClick={clear} type="button" aria-label="Clear">✕</button>}
          <span className="pf-select__arrow">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="pf-select__dropdown">
          {filtered.length === 0
            ? <div className="pf-select__no-result">No results for "{query}"</div>
            : filtered.map(opt => (
                <div
                  key={opt}
                  className={`pf-select__option${opt === value ? " pf-select__option--active" : ""}`}
                  onMouseDown={() => select(opt)}
                >
                  {opt === value && <span className="pf-select__check">✓</span>}
                  {opt}
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}

/* Multi-select tag chip component */
function TagSelector({ label, selected, onChange, allOptions, placeholder }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const tags     = selected ? selected.split(",").map(s => s.trim()).filter(Boolean) : [];
  const filtered = allOptions.filter(o =>
    o.toLowerCase().includes(query.toLowerCase()) && !tags.includes(o)
  );

  const addTag = (tag) => {
    if (!tags.includes(tag)) onChange([...tags, tag].join(", "));
    setQuery("");
  };
  const removeTag = (tag) => onChange(tags.filter(t => t !== tag).join(", "));

  return (
    <div className="pf-field pf-field--full" ref={ref}>
      {label && <label className="pf-label">{label}</label>}

      <div className="pf-tags-wrap" onClick={() => setOpen(true)}>
        {tags.map(tag => (
          <span key={tag} className="pf-tag">
            {tag}
            <button type="button" className="pf-tag__remove" onClick={e => { e.stopPropagation(); removeTag(tag); }}>✕</button>
          </span>
        ))}
        <input
          className="pf-tags-input"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={tags.length === 0 ? (placeholder || "Type to search and add…") : "Add more…"}
        />
      </div>

      {open && (
        <div className="pf-select__dropdown pf-tags-dropdown">
          {filtered.length === 0 && query
            ? (
              <div className="pf-select__option pf-tags-custom" onMouseDown={() => { addTag(query.trim()); setOpen(false); }}>
                + Add "<strong>{query.trim()}</strong>"
              </div>
            )
            : filtered.slice(0, 12).map(opt => (
                <div key={opt} className="pf-select__option" onMouseDown={() => addTag(opt)}>
                  {opt}
                </div>
              ))
          }
        </div>
      )}
      {tags.length > 0 && (
        <p className="pf-tags-count">{tags.length} selected</p>
      )}
    </div>
  );
}

/* Multi-city preferred locations */
function CitySelector({ label, value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
  const filtered = CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()) && !selected.includes(c));

  const add    = (c) => { onChange([...selected, c].join(", ")); setQuery(""); };
  const remove = (c) => onChange(selected.filter(x => x !== c).join(", "));

  return (
    <div className="pf-field pf-field--full" ref={ref}>
      <label className="pf-label">{label}</label>
      <div className="pf-tags-wrap" onClick={() => setOpen(true)}>
        {selected.map(c => (
          <span key={c} className="pf-tag pf-tag--city">
            📍 {c}
            <button type="button" className="pf-tag__remove" onClick={e => { e.stopPropagation(); remove(c); }}>✕</button>
          </span>
        ))}
        <input
          className="pf-tags-input"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? "Add preferred cities…" : "Add more cities…"}
        />
      </div>
      {open && (
        <div className="pf-select__dropdown pf-tags-dropdown">
          {filtered.slice(0, 10).map(c => (
            <div key={c} className="pf-select__option" onMouseDown={() => add(c)}>📍 {c}</div>
          ))}
          {filtered.length === 0 && <div className="pf-select__no-result">No cities match</div>}
        </div>
      )}
    </div>
  );
}

/* Completion score calculator */
function calcCompletion(form) {
  const fields = [
    form.bio, form.phone, form.location, form.linkedin, form.github,
    form.education, form.college, form.branch, form.graduation_year, form.cgpa,
    form.preferred_role, form.experience_level, form.job_type, form.availability,
    form.skills, form.languages,
    form.achievements,
  ];
  const filled = fields.filter(f => f !== null && f !== undefined && String(f).trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

/* Section wrapper */
function Section({ id, icon, title, desc, children, active, onClick }) {
  return (
    <div className={`pf-section${active ? " pf-section--open" : ""}`} id={id}>
      <button type="button" className="pf-section__header" onClick={onClick}>
        <span className="pf-section__icon">{icon}</span>
        <div className="pf-section__meta">
          <span className="pf-section__title">{title}</span>
          <span className="pf-section__desc">{desc}</span>
        </div>
        <span className="pf-section__chevron">{active ? "▲" : "▼"}</span>
      </button>
      {active && <div className="pf-section__body">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════ */
export default function Profile() {
  const EMPTY = {
    bio: "", phone: "", date_of_birth: "", gender: "", location: "", website: "", linkedin: "", github: "",
    education: "", college: "", branch: "", specialization: "", graduation_year: "", cgpa: "", backlogs: "",
    preferred_role: "", experience_level: "", job_type: "", preferred_locations: "", availability: "", expected_salary: "",
    skills: "", certifications: "", languages: "", tools: "",
    achievements: "", extracurriculars: "", projects_count: "", internships_count: "",
  };

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeSection, setActiveSection] = useState(0);

  /* load existing profile */
  useEffect(() => {
    API.get("/profile")
      .then(res => {
        const d = res.data;
        setForm({
          bio:               d.bio               ?? "",
          phone:             d.phone             ?? "",
          date_of_birth:     d.date_of_birth     ?? "",
          gender:            d.gender            ?? "",
          location:          d.location          ?? "",
          website:           d.website           ?? "",
          linkedin:          d.linkedin          ?? "",
          github:            d.github            ?? "",
          education:         d.education         ?? "",
          college:           d.college           ?? "",
          branch:            d.branch            ?? "",
          specialization:    d.specialization    ?? "",
          graduation_year:   d.graduation_year   ?? "",
          cgpa:              d.cgpa              ?? "",
          backlogs:          d.backlogs          ?? "",
          preferred_role:    d.preferred_role    ?? "",
          experience_level:  d.experience_level  ?? "",
          job_type:          d.job_type          ?? "",
          preferred_locations: d.preferred_locations ?? "",
          availability:      d.availability      ?? "",
          expected_salary:   d.expected_salary   ?? "",
          skills:            d.skills            ?? "",
          certifications:    d.certifications    ?? "",
          languages:         d.languages         ?? "",
          tools:             d.tools             ?? "",
          achievements:      d.achievements      ?? "",
          extracurriculars:  d.extracurriculars  ?? "",
          projects_count:    d.projects_count    ?? "",
          internships_count: d.internships_count ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set  = (field) => (val) => { setForm(p => ({ ...p, [field]: val })); setMessage({ text: "", type: "" }); };
  const setE = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setMessage({ text: "", type: "" }); };

  /* safe int helper — returns null for blank/invalid, int otherwise */
  const toInt = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  };

  /* safe float helper */
  const toFloat = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    /* Build payload — every numeric field uses null-safe helpers */
    const payload = {
      bio:               form.bio             || null,
      phone:             form.phone           || null,
      date_of_birth:     form.date_of_birth   || null,
      gender:            form.gender          || null,
      location:          form.location        || null,
      website:           form.website         || null,
      linkedin:          form.linkedin        || null,
      github:            form.github          || null,

      education:         form.education       || null,
      college:           form.college         || null,
      branch:            form.branch          || null,
      specialization:    form.specialization  || null,
      graduation_year:   toInt(form.graduation_year),
      cgpa:              toFloat(form.cgpa),
      backlogs:          toInt(form.backlogs),

      preferred_role:      form.preferred_role      || null,
      experience_level:    form.experience_level    || null,
      job_type:            form.job_type            || null,
      preferred_locations: form.preferred_locations || null,
      availability:        form.availability        || null,
      expected_salary:     form.expected_salary     || null,

      skills:              form.skills         || null,
      certifications:      form.certifications || null,
      languages:           form.languages      || null,
      tools:               form.tools          || null,

      achievements:        form.achievements      || null,
      extracurriculars:    form.extracurriculars  || null,
      projects_count:      toInt(form.projects_count),
      internships_count:   toInt(form.internships_count),
    };

    try {
      await API.put("/profile", payload);
      setMessage({ text: "Profile saved successfully! ✓", type: "success" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
        : detail || "Failed to save. Please try again.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const pct      = calcCompletion(form);
  const pctColor = pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";

  const toggleSection = (i) => setActiveSection(prev => prev === i ? -1 : i);

  if (loading) {
    return (
      <div className="pf-loading">
        <div className="pf-spinner" />
        <p>Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="pf-page">

      {/* ── PAGE HEADER ── */}
      <div className="pf-top">
        <div className="pf-top__left">
          <p className="pf-eyebrow">STUDENT PROFILE</p>
          <h1 className="pf-title">Complete Your Profile</h1>
          <p className="pf-subtitle">
            A complete profile unlocks personalised job matches, skill gap analysis,
            and AI-powered career guidance.
          </p>
        </div>

        {/* Completion ring */}
        <div className="pf-completion">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="7" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={pctColor}
              strokeWidth="7"
              strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dasharray .6s ease" }}
            />
          </svg>
          <div className="pf-completion__inner">
            <span className="pf-completion__pct" style={{ color: pctColor }}>{pct}%</span>
          </div>
          <div className="pf-completion__label">Complete</div>
        </div>
      </div>

      {/* Completion bar */}
      <div className="pf-progress-wrap">
        <div className="pf-progress-bar">
          <div className="pf-progress-bar__fill" style={{ width: `${pct}%`, background: pctColor }} />
        </div>
        <span className="pf-progress-tip">
          {pct < 40 && "🚀 Add basic details to get started"}
          {pct >= 40 && pct < 70 && "✨ Good progress! Keep going"}
          {pct >= 70 && pct < 90 && "💪 Almost there — just a few more fields"}
          {pct >= 90 && "⭐ Excellent! Your profile is highly complete"}
        </span>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`pf-alert pf-alert--${message.type}`} role={message.type === "error" ? "alert" : "status"}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ════════════════════════════════
            SECTION 1 — PERSONAL INFO
        ════════════════════════════════ */}
        <Section id="sec-personal" icon="👤" title="Personal Information"
          desc="Your basic details and contact information"
          active={activeSection === 0} onClick={() => toggleSection(0)}>

          <div className="pf-grid">
            <div className="pf-field pf-field--full">
              <label className="pf-label">Professional Summary / Bio</label>
              <textarea
                className="pf-textarea"
                name="bio"
                rows={3}
                placeholder="Write a short 2–3 line introduction about yourself — your background, what you're passionate about, and what you're looking for…"
                value={form.bio}
                onChange={setE}
                maxLength={500}
              />
              <p className="pf-char-count">{form.bio.length}/500</p>
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-phone">Phone Number</label>
              <input id="pf-phone" className="pf-input" name="phone" type="tel"
                placeholder="+91 98765 43210"
                value={form.phone} onChange={setE} />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-dob">Date of Birth</label>
              <input id="pf-dob" className="pf-input" name="date_of_birth" type="date"
                value={form.date_of_birth} onChange={setE} />
            </div>

            <SearchableSelect
              id="pf-gender" label="Gender"
              value={form.gender} onChange={set("gender")}
              options={GENDER_OPTIONS} placeholder="Select gender"
            />

            <SearchableSelect
              id="pf-location" label="Current City / Location"
              value={form.location} onChange={set("location")}
              options={CITIES} placeholder="Select your city"
            />

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-website">Personal Website / Portfolio</label>
              <input id="pf-website" className="pf-input" name="website" type="url"
                placeholder="https://yourportfolio.dev"
                value={form.website} onChange={setE} />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-linkedin">LinkedIn Profile URL</label>
              <div className="pf-input-icon-wrap">
                <span className="pf-input-icon">in</span>
                <input id="pf-linkedin" className="pf-input pf-input--icon" name="linkedin"
                  type="url" placeholder="https://linkedin.com/in/your-profile"
                  value={form.linkedin} onChange={setE} />
              </div>
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-github">GitHub Profile URL</label>
              <div className="pf-input-icon-wrap">
                <span className="pf-input-icon">⌥</span>
                <input id="pf-github" className="pf-input pf-input--icon" name="github"
                  type="url" placeholder="https://github.com/your-username"
                  value={form.github} onChange={setE} />
              </div>
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════
            SECTION 2 — EDUCATION
        ════════════════════════════════ */}
        <Section id="sec-education" icon="🎓" title="Education"
          desc="Your degree, institution, and academic performance"
          active={activeSection === 1} onClick={() => toggleSection(1)}>

          <div className="pf-grid">
            <SearchableSelect
              id="pf-education" label="Degree / Education Level" required
              value={form.education} onChange={set("education")}
              options={EDUCATION_LEVELS} placeholder="Select your degree"
            />

            <SearchableSelect
              id="pf-college" label="College / University" required
              value={form.college} onChange={set("college")}
              options={COLLEGES} placeholder="Search your institution"
            />

            <SearchableSelect
              id="pf-branch" label="Branch / Department" required
              value={form.branch} onChange={set("branch")}
              options={BRANCHES} placeholder="Select your branch"
            />

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-spec">Specialization (Optional)</label>
              <input id="pf-spec" className="pf-input" name="specialization"
                placeholder="e.g. Data Science, Embedded Systems"
                value={form.specialization} onChange={setE} />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-year">Graduation Year</label>
              <select id="pf-year" className="pf-input pf-select-native"
                name="graduation_year" value={form.graduation_year} onChange={setE}>
                <option value="">Select year</option>
                {GRADUATION_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-cgpa">
                CGPA / Percentage
                <span className="pf-label-hint">(out of 10 or %)</span>
              </label>
              <input id="pf-cgpa" className="pf-input" name="cgpa" type="number"
                placeholder="e.g. 8.5 or 85"
                value={form.cgpa} onChange={setE}
                min="0" max="100" step="0.01" />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-backlogs">
                Active Backlogs
                <span className="pf-label-hint">(enter 0 if none)</span>
              </label>
              <input id="pf-backlogs" className="pf-input" name="backlogs" type="number"
                placeholder="0"
                value={form.backlogs} onChange={setE}
                min="0" max="20" />
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════
            SECTION 3 — CAREER GOALS
        ════════════════════════════════ */}
        <Section id="sec-career" icon="🎯" title="Career Goals"
          desc="Target role, job preferences, and availability"
          active={activeSection === 2} onClick={() => toggleSection(2)}>

          <div className="pf-grid">
            <SearchableSelect
              id="pf-role" label="Preferred Job Role" required
              value={form.preferred_role} onChange={set("preferred_role")}
              options={PREFERRED_ROLES} placeholder="e.g. Software Engineer"
            />

            <SearchableSelect
              id="pf-exp" label="Experience Level"
              value={form.experience_level} onChange={set("experience_level")}
              options={EXPERIENCE_LEVELS} placeholder="Select level"
            />

            <SearchableSelect
              id="pf-jobtype" label="Preferred Job Type"
              value={form.job_type} onChange={set("job_type")}
              options={JOB_TYPES} placeholder="Full-time, Intern…"
            />

            <SearchableSelect
              id="pf-avail" label="Availability"
              value={form.availability} onChange={set("availability")}
              options={AVAILABILITY_OPTIONS} placeholder="When can you join?"
            />

            <SearchableSelect
              id="pf-salary" label="Expected Salary / Stipend"
              value={form.expected_salary} onChange={set("expected_salary")}
              options={SALARY_RANGES} placeholder="Select salary range"
            />

            <CitySelector
              label="Preferred Work Locations (select multiple)"
              value={form.preferred_locations}
              onChange={set("preferred_locations")}
            />
          </div>
        </Section>

        {/* ════════════════════════════════
            SECTION 4 — SKILLS & TECH
        ════════════════════════════════ */}
        <Section id="sec-skills" icon="💻" title="Skills & Technology"
          desc="Technical skills, programming languages, tools, and certifications"
          active={activeSection === 3} onClick={() => toggleSection(3)}>

          <div className="pf-grid">
            <TagSelector
              label="Technical Skills"
              selected={form.skills}
              onChange={set("skills")}
              allOptions={ALL_SKILLS}
              placeholder="Type to search skills (React, Python, Docker…)"
            />

            <TagSelector
              label="Programming Languages"
              selected={form.languages}
              onChange={set("languages")}
              allOptions={PROGRAMMING_LANGUAGES}
              placeholder="Add programming languages…"
            />

            <TagSelector
              label="Tools & Software"
              selected={form.tools}
              onChange={set("tools")}
              allOptions={TOOLS_LIST}
              placeholder="Add tools (Git, Docker, Figma…)"
            />

            <TagSelector
              label="Certifications"
              selected={form.certifications}
              onChange={set("certifications")}
              allOptions={CERTIFICATIONS_LIST}
              placeholder="Add certifications…"
            />
          </div>
        </Section>

        {/* ════════════════════════════════
            SECTION 5 — ACHIEVEMENTS
        ════════════════════════════════ */}
        <Section id="sec-extra" icon="🏆" title="Achievements & Extras"
          desc="Projects, internships, achievements, and extracurriculars"
          active={activeSection === 4} onClick={() => toggleSection(4)}>

          <div className="pf-grid">
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-projects">Number of Projects</label>
              <input id="pf-projects" className="pf-input" name="projects_count" type="number"
                placeholder="e.g. 5"
                value={form.projects_count} onChange={setE}
                min="0" max="100" />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-internships">Internships Completed</label>
              <input id="pf-internships" className="pf-input" name="internships_count" type="number"
                placeholder="e.g. 2"
                value={form.internships_count} onChange={setE}
                min="0" max="20" />
            </div>

            <div className="pf-field pf-field--full">
              <label className="pf-label" htmlFor="pf-achievements">
                Key Achievements
                <span className="pf-label-hint">Hackathons, ranks, awards, publications…</span>
              </label>
              <textarea
                id="pf-achievements"
                className="pf-textarea"
                name="achievements"
                rows={4}
                placeholder={"• Winner — Smart India Hackathon 2025\n• AIR 1200 in GATE CSE 2025\n• Published paper in IEEE ICECCT 2024\n• 5-star on HackerRank Problem Solving"}
                value={form.achievements}
                onChange={setE}
                maxLength={1000}
              />
              <p className="pf-char-count">{form.achievements.length}/1000</p>
            </div>

            <div className="pf-field pf-field--full">
              <label className="pf-label" htmlFor="pf-extra">
                Extracurricular Activities
                <span className="pf-label-hint">Clubs, sports, volunteering, leadership roles…</span>
              </label>
              <textarea
                id="pf-extra"
                className="pf-textarea"
                name="extracurriculars"
                rows={3}
                placeholder={"• President — Google Developer Student Club\n• Captain — College Cricket Team\n• NSS Volunteer — 100+ hours"}
                value={form.extracurriculars}
                onChange={setE}
                maxLength={600}
              />
              <p className="pf-char-count">{form.extracurriculars.length}/600</p>
            </div>
          </div>
        </Section>

        {/* ── SAVE BUTTON ── */}
        <div className="pf-save-row">
          <div className="pf-save-hint">
            {pct < 60
              ? `Your profile is ${pct}% complete. Fill more sections to improve job matches.`
              : `Profile is ${pct}% complete — looking great!`}
          </div>
          <button type="submit" className="pf-save-btn" disabled={saving}>
            {saving ? (
              <><span className="pf-btn-spinner" /> Saving…</>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
