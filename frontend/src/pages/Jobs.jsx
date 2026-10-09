import { useEffect, useState } from "react";
import API from "../api";
import "./PageShell.css";
import "./Jobs.css";

/* ═══════════════════════ DATA ═══════════════════════ */
const ALL_JOBS = [
  { id:1,  title:"Software Engineer",            company:"TechCorp India",      location:"Hyderabad",  type:"Full-time",  exp:"Entry Level",   match:92, salaryMin:8,  salaryMax:12, salary:"8–12 LPA",   tags:["React","Node.js","PostgreSQL","System Design"],   posted:"2 days ago",   logo:"TC", color:"#6366f1",
    desc:"Build scalable web applications using a modern tech stack. You will work across the full product lifecycle — design, build, test, and ship. Strong DSA and system design fundamentals required.",
    requirements:["B.Tech/B.E. in CS or related field","Strong knowledge of Data Structures & Algorithms","Experience with React and Node.js","Understanding of RESTful APIs and databases","Excellent problem-solving skills"],
    perks:["Health insurance","Flexible WFH policy","Annual bonus","Learning & development budget","Team offsites"] },
  { id:2,  title:"Frontend Developer",            company:"Infosys",             location:"Bengaluru",  type:"Full-time",  exp:"Entry Level",   match:87, salaryMin:6,  salaryMax:10, salary:"6–10 LPA",   tags:["React","TypeScript","CSS","Jest"],                 posted:"3 days ago",   logo:"IN", color:"#0ea5e9",
    desc:"Create accessible, responsive UI components and improve user experience across enterprise SaaS products. You will collaborate closely with UX designers and backend engineers.",
    requirements:["Proficiency in React and TypeScript","Strong CSS/HTML skills","Unit testing with Jest or Vitest","Understanding of web performance and accessibility","Experience with design systems"],
    perks:["5-day work week","Medical & dental cover","Transport allowance","On-site gym","Annual hike"] },
  { id:3,  title:"Full Stack Developer",          company:"StartupXYZ",          location:"Remote",     type:"Full-time",  exp:"Junior",        match:89, salaryMin:10, salaryMax:15, salary:"10–15 LPA",  tags:["React","Python","FastAPI","Docker","PostgreSQL"],  posted:"4 days ago",   logo:"SX", color:"#10b981",
    desc:"End-to-end feature development from database schema design to polished frontend delivery. High ownership in a lean, fast-moving product team building a B2B SaaS platform.",
    requirements:["Proficiency in React and Python","Experience with FastAPI or Django","PostgreSQL and Redis knowledge","Docker and basic DevOps understanding","Strong communication skills for async remote work"],
    perks:["Fully remote","Equity stake","Home office stipend","Unlimited PTO","Annual retreat"] },
  { id:4,  title:"Backend Developer",             company:"Wipro",               location:"Chennai",    type:"Full-time",  exp:"Entry Level",   match:74, salaryMin:5,  salaryMax:8,  salary:"5–8 LPA",    tags:["Python","FastAPI","AWS","Microservices"],         posted:"1 week ago",   logo:"WP", color:"#f59e0b",
    desc:"Design and maintain high-performance REST APIs, microservices, and cloud infrastructure on AWS. Contribute to system architecture decisions for enterprise-grade products.",
    requirements:["Python programming proficiency","Knowledge of REST API design patterns","Basic AWS services (EC2, S3, RDS)","Experience with SQL databases","Understanding of microservices architecture"],
    perks:["Medical insurance","Annual bonus","Learning platform access","Relocation assistance","Cafeteria"] },
  { id:5,  title:"Data Analyst",                  company:"Analytics Co.",       location:"Pune",       type:"Full-time",  exp:"Entry Level",   match:78, salaryMin:5,  salaryMax:8,  salary:"5–8 LPA",    tags:["Python","SQL","Power BI","Tableau","Statistics"],  posted:"1 week ago",  logo:"AC", color:"#8b5cf6",
    desc:"Analyse business data across sales, marketing, and operations. Build automated dashboards and present weekly insights to leadership. Strong SQL and communication skills needed.",
    requirements:["Strong SQL query skills","Python for data analysis (Pandas, NumPy)","Experience with Power BI or Tableau","Statistical analysis fundamentals","Good presentation and communication skills"],
    perks:["Hybrid work model","Health coverage","Performance bonus","Conference budget","Flexible hours"] },
  { id:6,  title:"DevOps Engineer",               company:"CloudBase",           location:"Mumbai",     type:"Full-time",  exp:"Mid Level",     match:65, salaryMin:10, salaryMax:18, salary:"10–18 LPA",  tags:["AWS","Kubernetes","CI/CD","Terraform","Linux"],  posted:"5 days ago",   logo:"CB", color:"#ec4899",
    desc:"Own cloud infrastructure reliability, CI/CD pipeline efficiency, and deployment automation. Drive SRE practices including on-call rotations and incident response.",
    requirements:["AWS or GCP certification preferred","Kubernetes administration experience","CI/CD tools: Jenkins, GitHub Actions","Terraform for Infrastructure as Code","Linux system administration"],
    perks:["On-call allowance","Remote-friendly","Stock options","Training budget","Premium health plan"] },
  { id:7,  title:"Machine Learning Engineer",     company:"AI Solutions Ltd",    location:"Bengaluru",  type:"Full-time",  exp:"Mid Level",     match:82, salaryMin:12, salaryMax:20, salary:"12–20 LPA",  tags:["Python","TensorFlow","PyTorch","MLOps","NLP"],   posted:"3 days ago",   logo:"AI", color:"#14b8a6",
    desc:"Build and deploy production ML models for NLP and computer vision use cases at scale. Work closely with data engineers, product managers, and research scientists.",
    requirements:["Deep knowledge of TensorFlow and PyTorch","Experience deploying models with FastAPI or TorchServe","MLOps tools: MLflow, DVC, Airflow","Strong mathematics: linear algebra, probability, calculus","Research publication is a plus"],
    perks:["Research time allocation","Conference sponsorship","GPU workstation","Equity","Flexible schedule"] },
  { id:8,  title:"React Native Developer",        company:"MobileFirst",         location:"Remote",     type:"Full-time",  exp:"Junior",        match:85, salaryMin:8,  salaryMax:14, salary:"8–14 LPA",   tags:["React Native","JavaScript","iOS","Android","Redux"], posted:"6 days ago",  logo:"MF", color:"#6366f1",
    desc:"Develop cross-platform mobile applications for iOS and Android. Maintain feature parity across platforms while optimising for device-specific performance.",
    requirements:["Proficiency in React Native and JavaScript","Experience publishing to App Store and Play Store","State management with Redux or Zustand","Native module integration","Push notifications and offline support"],
    perks:["Full remote","Latest MacBook Pro","App Store revenue share","Flexible hours","Annual team trip"] },
  { id:9,  title:"Software Engineer Intern",      company:"Google",              location:"Hyderabad",  type:"Internship", exp:"Fresher",       match:71, salaryMin:0,  salaryMax:0,  salary:"₹80K/month", tags:["C++","Algorithms","System Design","Distributed Systems"], posted:"1 week ago", logo:"GO", color:"#ef4444",
    desc:"12-week internship working on Google-scale distributed systems. You'll be paired with a senior engineer as your mentor and work on a project that ships to production.",
    requirements:["Strong competitive programming background","C++ or Java proficiency","Good understanding of algorithms and data structures","Ability to work in a large codebase","Currently pursuing B.Tech/M.Tech"],
    perks:["₹80,000 stipend","Free meals","Mentorship","Pre-placement offer chance","Google swag"] },
  { id:10, title:"Data Science Intern",           company:"Flipkart",            location:"Bengaluru",  type:"Internship", exp:"Fresher",       match:76, salaryMin:0,  salaryMax:0,  salary:"₹60K/month", tags:["Python","ML","Statistics","SQL","Spark"],        posted:"5 days ago",   logo:"FK", color:"#f59e0b",
    desc:"Work with petabyte-scale datasets to derive insights that improve customer experience, seller success, and supply chain efficiency. Collaborate with senior data scientists.",
    requirements:["Strong Python and machine learning fundamentals","SQL proficiency for large-scale data","Statistical modelling experience","Familiarity with Spark or Hadoop is a plus","Currently pursuing relevant degree"],
    perks:["₹60,000 stipend","Relocation support","Pre-placement offer","Learning sessions","Cafeteria access"] },
  { id:11, title:"Frontend Engineer",             company:"PhonePe",             location:"Bengaluru",  type:"Full-time",  exp:"Junior",        match:88, salaryMin:12, salaryMax:18, salary:"12–18 LPA",  tags:["React","TypeScript","Redux","Performance","Web Vitals"], posted:"2 days ago", logo:"PP", color:"#8b5cf6",
    desc:"Build high-performance financial UIs serving 400M+ users. Obsess over Core Web Vitals, accessibility, and micro-interactions. Own end-to-end feature delivery.",
    requirements:["Expert-level React and TypeScript","Deep understanding of browser rendering pipeline","Experience optimising Core Web Vitals","Accessibility standards (WCAG 2.1)","Exposure to micro-frontend architecture"],
    perks:["ESOPs","Premium health for family","Flexi WFH","Learning budget","High-growth environment"] },
  { id:12, title:"Cloud Architect",               company:"Microsoft",           location:"Hyderabad",  type:"Full-time",  exp:"Senior",        match:62, salaryMin:25, salaryMax:40, salary:"25–40 LPA",  tags:["Azure","Terraform","Kubernetes","Architecture","Security"], posted:"1 week ago", logo:"MS", color:"#0ea5e9",
    desc:"Design enterprise cloud solutions on Azure for Fortune 500 clients. Own the solution architecture, security compliance, and technical delivery for large-scale digital transformation programmes.",
    requirements:["Azure Solutions Architect Expert certification","10+ years of IT experience","Strong knowledge of hybrid cloud architectures","Security and compliance frameworks (ISO 27001, SOC 2)","Excellent client-facing presentation skills"],
    perks:["Microsoft 365 suite","Premium medical","Annual bonus + stocks","Global mobility","High impact role"] },
  { id:13, title:"UI/UX Designer",                company:"Razorpay",            location:"Bengaluru",  type:"Full-time",  exp:"Entry Level",   match:80, salaryMin:8,  salaryMax:14, salary:"8–14 LPA",   tags:["Figma","User Research","Prototyping","Design Systems","CSS"], posted:"3 days ago", logo:"RZ", color:"#10b981",
    desc:"Design end-to-end product experiences for Razorpay's payment products used by 8M+ businesses. Own user research, wireframing, high-fidelity design, and design system contribution.",
    requirements:["Proficiency in Figma and prototyping tools","Portfolio demonstrating end-to-end product design","User research and usability testing experience","Understanding of accessibility and inclusive design","Basic CSS/HTML is a plus"],
    perks:["Hybrid work","MacBook Pro","Design conference budget","Health insurance","Equity"] },
  { id:14, title:"QA / SDET Engineer",            company:"Freshworks",          location:"Chennai",    type:"Full-time",  exp:"Entry Level",   match:72, salaryMin:6,  salaryMax:10, salary:"6–10 LPA",   tags:["Selenium","Jest","Cypress","API Testing","CI/CD"],  posted:"4 days ago",  logo:"FW", color:"#ec4899",
    desc:"Build and maintain automated test suites for web and API layers. Champion quality across the engineering org through test strategy, framework selection, and developer education.",
    requirements:["Experience with Selenium WebDriver and Cypress","API testing with Postman or REST-Assured","Understanding of CI/CD integration for tests","Python or JavaScript for test automation","Knowledge of BDD frameworks (Cucumber, Gherkin)"],
    perks:["5-day week","Health insurance","Remote-friendly","Annual hike","Team activities"] },
  { id:15, title:"Product Manager",               company:"Swiggy",              location:"Bengaluru",  type:"Full-time",  exp:"Mid Level",     match:68, salaryMin:18, salaryMax:28, salary:"18–28 LPA",  tags:["Product Strategy","User Research","Analytics","A/B Testing","SQL"], posted:"5 days ago", logo:"SW", color:"#f59e0b",
    desc:"Drive product strategy and execution for Swiggy's growth products. Own the full product lifecycle from discovery to launch and post-release optimisation, working with 50M+ users.",
    requirements:["3+ years PM experience in a consumer product","Strong analytical and SQL skills","Experience running A/B experiments at scale","Excellent stakeholder management","MBA from a premier institution preferred"],
    perks:["ESOPs","Free food credits","Premium health","Flexible WFH","High impact at scale"] },
  { id:16, title:"Business Analyst",               company:"Accenture",            location:"Hyderabad",  type:"Full-time",  exp:"Entry Level",   match:76, salaryMin:5,  salaryMax:9,  salary:"5–9 LPA",    tags:["SQL","Excel","Power BI","Requirement Gathering","Agile"], posted:"3 days ago",  logo:"AC", color:"#6366f1",
    desc:"Work with clients to gather requirements, model business processes, and translate them into functional specifications for technology teams. Strong analytical mindset required.",
    requirements:["Degree in CS, MBA, or related field","Strong SQL and Excel skills","Experience with Power BI or Tableau","Understanding of Agile/Scrum methodology","Excellent communication and presentation skills"],
    perks:["Global project exposure","Training certifications","Health insurance","Annual bonus","Mentorship programme"] },
  { id:17, title:"Cybersecurity Analyst",          company:"Deloitte",             location:"Bengaluru",  type:"Full-time",  exp:"Entry Level",   match:70, salaryMin:6,  salaryMax:11, salary:"6–11 LPA",   tags:["Network Security","SIEM","Penetration Testing","Python","Compliance"], posted:"4 days ago", logo:"DL", color:"#ef4444",
    desc:"Monitor security incidents, conduct vulnerability assessments, and support compliance initiatives. Assist in penetration testing and security audits for enterprise clients.",
    requirements:["B.Tech in CS or IT","CEH or Security+ certification (preferred)","Knowledge of SIEM tools (Splunk, QRadar)","Basic Python scripting for automation","Understanding of OWASP Top 10"],
    perks:["Certification sponsorship","Security lab access","Remote-friendly","Annual hike","Global client projects"] },
  { id:18, title:"Technical Content Writer",       company:"GeeksforGeeks",        location:"Noida",      type:"Full-time",  exp:"Entry Level",   match:73, salaryMin:4,  salaryMax:7,  salary:"4–7 LPA",    tags:["Technical Writing","Python","DSA","SEO","Markdown"], posted:"2 days ago",  logo:"GG", color:"#10b981",
    desc:"Write high-quality technical articles, tutorials, and problem explanations for one of India's largest coding platforms. Strong programming knowledge + writing skills required.",
    requirements:["Strong programming knowledge (Python/Java/C++)","Excellent written communication skills","Understanding of DSA and CS fundamentals","SEO basics and content structuring","Ability to explain complex concepts simply"],
    perks:["Flexible remote work","Author credits","Skill development budget","Free premium access","Young team culture"] },
  { id:19, title:"Embedded Systems Engineer",      company:"Texas Instruments",    location:"Bengaluru",  type:"Full-time",  exp:"Entry Level",   match:67, salaryMin:7,  salaryMax:12, salary:"7–12 LPA",   tags:["C","ARM Cortex","RTOS","Embedded C","Firmware"], posted:"1 week ago",  logo:"TI", color:"#f97316",
    desc:"Design and develop firmware for embedded systems in consumer electronics and automotive applications. Work with microcontrollers, RTOS, and low-level hardware interfaces.",
    requirements:["B.Tech in ECE or EE","Strong C/C++ programming skills","Experience with ARM Cortex-M series","Knowledge of RTOS (FreeRTOS, AUTOSAR)","Understanding of SPI, I2C, UART communication"],
    perks:["Patent opportunities","R&D exposure","Health insurance","Relocation support","Innovation awards"] },
  { id:20, title:"Cloud Support Engineer",         company:"Amazon Web Services",  location:"Hyderabad",  type:"Full-time",  exp:"Entry Level",   match:77, salaryMin:6,  salaryMax:10, salary:"6–10 LPA",   tags:["AWS","Linux","Networking","Python","Troubleshooting"], posted:"3 days ago",  logo:"AW", color:"#f59e0b",
    desc:"Help AWS customers architect, optimise, and troubleshoot their cloud solutions. Support customers using AWS services through tickets, phone, and live chat.",
    requirements:["Knowledge of AWS core services (EC2, S3, VPC, IAM)","Linux/Unix administration skills","Basic networking: TCP/IP, DNS, routing","Python or Bash scripting","Strong written communication"],
    perks:["AWS certifications funded","Employee discount on AWS","Stock units","Global team","Career progression"] },
  { id:21, title:"Research Engineer — NLP",        company:"NVIDIA",               location:"Pune",       type:"Full-time",  exp:"Mid Level",     match:79, salaryMin:20, salaryMax:35, salary:"20–35 LPA",  tags:["Python","PyTorch","NLP","Transformers","CUDA"], posted:"5 days ago",  logo:"NV", color:"#10b981",
    desc:"Research and implement state-of-the-art NLP models for production AI products. Collaborate with a world-class team on large language models, reasoning, and multimodal AI.",
    requirements:["M.Tech/MS/PhD in CS or related field","Deep knowledge of transformer architectures","PyTorch and CUDA programming","Experience with LLM fine-tuning (LoRA, QLoRA)","Research publications in NLP/ML (preferred)"],
    perks:["GPU cluster access","Research paper budget","Sabbatical option","Global relocation","Industry-leading compensation"] },
  { id:22, title:"Android Developer",              company:"Paytm",                location:"Noida",      type:"Full-time",  exp:"Junior",        match:83, salaryMin:8,  salaryMax:14, salary:"8–14 LPA",   tags:["Kotlin","Android SDK","MVVM","Coroutines","Jetpack Compose"], posted:"4 days ago", logo:"PT", color:"#8b5cf6",
    desc:"Build and maintain Android payment features for India's largest fintech app. Focus on performance, security, and user experience for 100M+ users.",
    requirements:["Proficiency in Kotlin and Android SDK","Experience with MVVM architecture and Jetpack","Coroutines and Flow for async programming","Understanding of payment security (PCI DSS basics)","Strong UI/UX sensibility"],
    perks:["ESOPs","Flexible WFH","Health + dental","Annual learning budget","High-scale impact"] },
  { id:23, title:"Blockchain Developer",           company:"Polygon Labs",         location:"Remote",     type:"Full-time",  exp:"Junior",        match:72, salaryMin:12, salaryMax:22, salary:"12–22 LPA",  tags:["Solidity","Ethereum","Web3.js","Smart Contracts","Hardhat"], posted:"6 days ago", logo:"PL", color:"#7c3aed",
    desc:"Build and audit smart contracts for DeFi protocols on the Polygon network. Work with a globally distributed team on cutting-edge Web3 infrastructure.",
    requirements:["Solid understanding of blockchain fundamentals","Solidity smart contract development experience","Web3.js or Ethers.js proficiency","Testing with Hardhat or Foundry","Security awareness (reentrancy, flash loans, front-running)"],
    perks:["Token compensation","Fully remote","Global team","Crypto salary option","Conference sponsorship"] },
  { id:24, title:"Scrum Master / Agile Coach",     company:"Capgemini",            location:"Chennai",    type:"Full-time",  exp:"Mid Level",     match:65, salaryMin:10, salaryMax:16, salary:"10–16 LPA",  tags:["Agile","Scrum","Jira","Stakeholder Management","Facilitation"], posted:"1 week ago",  logo:"CG", color:"#0ea5e9",
    desc:"Facilitate Agile ceremonies, remove impediments, and coach development teams on Scrum best practices. Work across multiple delivery teams for an enterprise client.",
    requirements:["CSM or PSM certification","3+ years as Scrum Master or Agile Lead","Experience with Jira and Confluence","Strong facilitation and conflict-resolution skills","Knowledge of SAFe (preferred)"],
    perks:["Hybrid work","Training reimbursement","Health coverage","Annual performance bonus","Leadership track"] },
  { id:25, title:"Data Engineer",                  company:"Zomato",               location:"Gurugram",   type:"Full-time",  exp:"Junior",        match:81, salaryMin:10, salaryMax:18, salary:"10–18 LPA",  tags:["Python","Apache Spark","Kafka","Airflow","PostgreSQL"], posted:"2 days ago",  logo:"ZO", color:"#ef4444",
    desc:"Build and maintain real-time data pipelines that power Zomato's analytics, recommendations, and operational dashboards serving 100M+ users.",
    requirements:["Strong Python and SQL skills","Experience with Apache Spark or Flink","Kafka or any message queue experience","Airflow for workflow orchestration","Cloud data warehouse experience (BigQuery/Redshift/Snowflake)"],
    perks:["Free Zomato Gold","ESOPs","Hybrid work","Health + accident cover","High-data-scale exposure"] },
];

const EXPERIENCE_LEVELS = ["All Levels", "Fresher", "Entry Level", "Junior", "Mid Level", "Senior"];
const JOB_TYPES = ["All", "Full-time", "Internship", "Remote"];
const SORT_OPTIONS = ["Best Match", "Newest", "Salary: High → Low", "Salary: Low → High"];
const LOCATIONS = ["All Locations", "Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Pune", "Noida", "Gurugram", "Remote"];
const DOMAINS = ["All Domains", "Software Engineering", "Data & AI", "DevOps & Cloud", "Design & Product", "Security", "Mobile", "Blockchain", "Content & Writing", "Hardware"];

const DOMAIN_MAP = {
  "Software Engineering": [1,2,3,4,8,11,14,16,18,22,24],
  "Data & AI":            [5,7,10,17,21,25],
  "DevOps & Cloud":       [6,20,23],
  "Design & Product":     [13,15],
  "Security":             [17],
  "Mobile":               [8,22],
  "Blockchain":           [23],
  "Content & Writing":    [18],
  "Hardware":             [19],
};

/* ═══════════════════════ HELPERS ═══════════════════════ */
function MatchBadge({ match }) {
  const c = match >= 85
    ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" }
    : match >= 70
    ? { bg: "#fffbeb", color: "#b45309", border: "#fde68a" }
    : { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
  return (
    <span className="job-match-badge"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {match}% match
    </span>
  );
}

function CompanyLogo({ logo, color }) {
  return (
    <div className="job-logo" style={{ background: `${color}18`, border: `1px solid ${color}33`, color }}>
      {logo}
    </div>
  );
}

/* ═══════════════════════ JOB DETAIL MODAL ═══════════════════════ */
function JobModal({ job, onClose, onApply, applied, saved, onSave }) {
  if (!job) return null;
  return (
    <div className="jm-overlay" onClick={onClose}>
      <div className="jm-panel" onClick={e => e.stopPropagation()}>
        <button className="jm-close" onClick={onClose}>✕</button>

        {/* header */}
        <div className="jm-header">
          <CompanyLogo logo={job.logo} color={job.color} />
          <div className="jm-header__info">
            <h2 className="jm-title">{job.title}</h2>
            <p className="jm-company">{job.company} · {job.location}</p>
          </div>
          <div className="jm-header__actions">
            <button
              className={`jm-save-btn${saved ? " saved" : ""}`}
              onClick={() => onSave(job.id)}
              title={saved ? "Unsave" : "Save job"}
            >
              {saved ? "🔖 Saved" : "🏷️ Save"}
            </button>
            <MatchBadge match={job.match} />
          </div>
        </div>

        {/* meta chips */}
        <div className="jm-meta">
          <span className="jm-chip">💼 {job.type}</span>
          <span className="jm-chip">📍 {job.location}</span>
          <span className="jm-chip">💰 {job.salary}</span>
          <span className="jm-chip">🎓 {job.exp}</span>
          <span className="jm-chip">🕒 Posted {job.posted}</span>
        </div>

        {/* skills */}
        <div className="jm-tags">
          {job.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
        </div>

        {/* description */}
        <div className="jm-section">
          <h3>About this role</h3>
          <p>{job.desc}</p>
        </div>

        {/* requirements */}
        <div className="jm-section">
          <h3>Requirements</h3>
          <ul className="jm-list">
            {job.requirements.map(r => <li key={r}>{r}</li>)}
          </ul>
        </div>

        {/* perks */}
        <div className="jm-section">
          <h3>Perks & Benefits</h3>
          <div className="jm-perks">
            {job.perks.map(p => (
              <span key={p} className="jm-perk">✓ {p}</span>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="jm-footer">
          <p className="jm-note">
            ⚡ One-click apply feature coming soon. Track this application manually in Applications.
          </p>
          <button
            className={`jm-apply-btn${applied ? " applied" : ""}`}
            onClick={() => onApply(job)}
            disabled={applied}
          >
            {applied ? "✓ Added to Applications" : "Add to My Applications"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
export default function Jobs() {
  const [profile,    setProfile]   = useState(null);
  const [search,     setSearch]    = useState("");
  const [jobType,    setJobType]   = useState("All");
  const [location,   setLocation]  = useState("All Locations");
  const [expLevel,   setExpLevel]  = useState("All Levels");
  const [domain,     setDomain]    = useState("All Domains");
  const [sortBy,     setSortBy]    = useState("Best Match");
  const [salaryMin,  setSalaryMin] = useState(0);
  const [salaryMax,  setSalaryMax] = useState(50);
  const [view,       setView]      = useState("grid");
  const [activeTab,  setActiveTab] = useState("all"); // "all" | "saved"
  const [selectedJob,setSelected] = useState(null);
  const [saved,      setSaved]     = useState(() => {
    try { const s = JSON.parse(localStorage.getItem("saved_jobs")||"[]"); return new Set(s); } catch { return new Set(); }
  });
  const [applied,    setApplied]   = useState(new Set());
  const [page,       setPage]      = useState(1);
  const [showFilters,setShowFilters] = useState(true);
  const JOBS_PER_PAGE = 9;

  /* load profile for personalised match context */
  useEffect(() => {
    API.get("/profile").then(r => setProfile(r.data)).catch(() => {});
  }, []);

  /* filter + sort */
  const domainIds = domain !== "All Domains" ? (DOMAIN_MAP[domain] || []) : null;
  let filtered = ALL_JOBS.filter(j => {
    if (activeTab === "saved" && !saved.has(j.id)) return false;
    const q = search.toLowerCase();
    const matchSearch = !q
      || j.title.toLowerCase().includes(q)
      || j.company.toLowerCase().includes(q)
      || j.tags.some(t => t.toLowerCase().includes(q))
      || j.desc.toLowerCase().includes(q);
    const matchType   = jobType === "All" || j.type === jobType || (jobType === "Remote" && j.location === "Remote");
    const matchLoc    = location === "All Locations" || j.location === location;
    const matchExp    = expLevel === "All Levels" || j.exp === expLevel;
    const matchDomain = !domainIds || domainIds.includes(j.id);
    const matchSal    = j.salaryMin === 0 || (j.salaryMin >= salaryMin && j.salaryMax <= salaryMax + 10);
    return matchSearch && matchType && matchLoc && matchExp && matchDomain && matchSal;
  });

  if (sortBy === "Best Match")           filtered = [...filtered].sort((a, b) => b.match - a.match);
  else if (sortBy === "Newest")          filtered = [...filtered].reverse();
  else if (sortBy === "Salary: High → Low") filtered = [...filtered].sort((a, b) => b.salaryMax - a.salaryMax);
  else if (sortBy === "Salary: Low → High") filtered = [...filtered].sort((a, b) => a.salaryMin - b.salaryMin);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  /* reset page when filters change */
  const applyFilter = (fn) => { fn(); setPage(1); };

  const toggleSave = (id) => {
    setSaved(prev => {
      const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id);
      localStorage.setItem("saved_jobs", JSON.stringify([...s]));
      return s;
    });
  };

  const handleApply = (job) => {
    setApplied(prev => new Set(prev).add(job.id));
    /* persist to localStorage so Applications page picks it up */
    try {
      const existing = JSON.parse(localStorage.getItem("applications") || "[]");
      const already  = existing.some(a => a.role === job.title && a.company === job.company);
      if (!already) {
        existing.push({
          id: Date.now(), role: job.title, company: job.company,
          location: job.location, date: new Date().toLocaleDateString("en-IN"),
          status: "Applied", note: `Added from Jobs page. Match: ${job.match}%`,
          tags: job.tags, salary: job.salary,
        });
        localStorage.setItem("applications", JSON.stringify(existing));
      }
    } catch {}
    setSelected(null);
  };

  const activeFilters = [
    jobType !== "All", location !== "All Locations",
    expLevel !== "All Levels", domain !== "All Domains",
    salaryMin > 0 || salaryMax < 50,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setJobType("All"); setLocation("All Locations");
    setExpLevel("All Levels"); setDomain("All Domains");
    setSalaryMin(0); setSalaryMax(50);
    setSearch(""); setPage(1);
  };

  /* profile skill match highlight */
  const profileSkills = profile?.skills
    ? profile.skills.split(",").map(s => s.trim().toLowerCase())
    : [];

  return (
    <div className="page-shell jobs-page">

      {/* header */}
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">JOBS</p>
        <h1 className="page-shell__title">Job Opportunities</h1>
        <p className="page-shell__sub">
          {profile?.preferred_role
            ? `Showing roles relevant to ${profile.preferred_role}. Match scores based on your profile.`
            : `Browse ${ALL_JOBS.length} opportunities. Complete your profile for personalised match scores.`}
        </p>
      </div>

      {/* tabs: All Jobs | Saved */}
      <div className="jobs-tabs">
        <button className={`jobs-tab${activeTab==="all"?" jobs-tab--active":""}`}
          onClick={() => { setActiveTab("all"); setPage(1); }}>
          All Jobs <span className="jobs-tab-count">{ALL_JOBS.length}</span>
        </button>
        <button className={`jobs-tab${activeTab==="saved"?" jobs-tab--active":""}`}
          onClick={() => { setActiveTab("saved"); setPage(1); }}>
          🔖 Saved <span className="jobs-tab-count">{saved.size}</span>
        </button>
      </div>

      {/* top toolbar */}
      <div className="jobs-toolbar">
        <div className="jobs-search-wrap">
          <span className="jobs-search-icon">🔍</span>
          <input
            className="jobs-search"
            placeholder="Search title, company, skill…"
            value={search}
            onChange={e => applyFilter(() => setSearch(e.target.value))}
          />
          {search && <button className="jobs-search-clear" onClick={() => applyFilter(() => setSearch(""))}>✕</button>}
        </div>

        <div className="jobs-toolbar__right">
          <button
            className={`jobs-filter-toggle${showFilters ? " active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Filters {activeFilters > 0 && <span className="jobs-filter-count">{activeFilters}</span>}
          </button>

          <div className="jobs-view-toggle">
            <button className={`jobs-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid view">⊞</button>
            <button className={`jobs-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List view">☰</button>
          </div>

          <select className="jobs-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* expandable filter panel */}
      {showFilters && (
        <div className="jobs-filter-panel">
          <div className="jobs-filter-row">
            {/* type */}
            <div className="jobs-filter-group">
              <p className="jobs-filter-label">Job Type</p>
              <div className="jobs-filter-chips">
                {JOB_TYPES.map(t => (
                  <button key={t}
                    className={`jobs-chip${jobType === t ? " active" : ""}`}
                    onClick={() => applyFilter(() => setJobType(t))}>{t}
                  </button>
                ))}
              </div>
            </div>

            {/* location */}
            <div className="jobs-filter-group">
              <p className="jobs-filter-label">Location</p>
              <select className="jobs-filter-select" value={location}
                onChange={e => applyFilter(() => setLocation(e.target.value))}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* experience */}
            <div className="jobs-filter-group">
              <p className="jobs-filter-label">Experience</p>
              <select className="jobs-filter-select" value={expLevel}
                onChange={e => applyFilter(() => setExpLevel(e.target.value))}>
                {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* domain */}
            <div className="jobs-filter-group">
              <p className="jobs-filter-label">Domain</p>
              <select className="jobs-filter-select" value={domain}
                onChange={e => applyFilter(() => setDomain(e.target.value))}>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* salary */}
            <div className="jobs-filter-group jobs-filter-group--salary">
              <p className="jobs-filter-label">Salary Range: {salaryMin}–{salaryMax} LPA</p>
              <div className="jobs-salary-range">
                <input type="range" min={0} max={50} step={2} value={salaryMin}
                  onChange={e => applyFilter(() => setSalaryMin(Number(e.target.value)))} />
                <input type="range" min={0} max={50} step={2} value={salaryMax}
                  onChange={e => applyFilter(() => setSalaryMax(Number(e.target.value)))} />
              </div>
              <div className="jobs-salary-labels">
                <span>₹{salaryMin}L</span><span>₹{salaryMax}L+</span>
              </div>
            </div>
          </div>

          {activeFilters > 0 && (
            <button className="jobs-clear-filters" onClick={clearFilters}>
              ✕ Clear all filters ({activeFilters})
            </button>
          )}
        </div>
      )}

      {/* results count + saved indicator */}
      <div className="jobs-results-bar">
        <p className="jobs-count">
          <strong>{filtered.length}</strong> job{filtered.length !== 1 ? "s" : ""} found
          {saved.size > 0 && <span className="jobs-saved-count">· {saved.size} saved 🔖</span>}
        </p>
        <div className="jobs-results-bar__tabs">
          {JOB_TYPES.slice(1).map(t => {
            const c = ALL_JOBS.filter(j => j.type === t || (t === "Remote" && j.location === "Remote")).length;
            return <span key={t} className="jobs-type-pill">{t}: {c}</span>;
          })}
        </div>
      </div>

      {/* job cards */}
      {paginated.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <h3>No jobs match your filters</h3>
          <p>Try broadening your search or clearing some filters.</p>
          <button className="page-btn page-btn--primary" style={{ marginTop: 16 }} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      ) : view === "grid" ? (
        /* GRID VIEW */
        <div className="jobs-grid">
          {paginated.map(job => {
            const isSaved   = saved.has(job.id);
            const isApplied = applied.has(job.id);
            const matchingSkills = job.tags.filter(t =>
              profileSkills.some(s => s.includes(t.toLowerCase()) || t.toLowerCase().includes(s))
            );
            return (
              <div key={job.id} className={`job-card${isApplied ? " job-card--applied" : ""}`}>
                {isApplied && <div className="job-card__applied-ribbon">✓ Applied</div>}

                <div className="job-card__top">
                  <CompanyLogo logo={job.logo} color={job.color} />
                  <div className="job-card__info">
                    <h3 className="job-card__title">{job.title}</h3>
                    <p className="job-card__company">{job.company}</p>
                    <p className="job-card__location">📍 {job.location}</p>
                  </div>
                  <button
                    className={`job-save-btn${isSaved ? " saved" : ""}`}
                    onClick={() => toggleSave(job.id)}
                    title={isSaved ? "Unsave" : "Save"}
                  >{isSaved ? "🔖" : "🏷️"}</button>
                </div>

                <div className="job-card__tags">
                  {job.tags.slice(0, 4).map(tag => (
                    <span key={tag}
                      className={`job-tag${matchingSkills.includes(tag) ? " job-tag--match" : ""}`}>
                      {matchingSkills.includes(tag) && "✓ "}{tag}
                    </span>
                  ))}
                  {job.tags.length > 4 && <span className="job-tag job-tag--more">+{job.tags.length - 4}</span>}
                </div>

                <div className="job-card__chips">
                  <span className="job-chip">{job.type}</span>
                  <span className="job-chip">💰 {job.salary}</span>
                  <span className="job-chip">🎓 {job.exp}</span>
                </div>

                <div className="job-card__footer">
                  <div className="job-card__footer-left">
                    <MatchBadge match={job.match} />
                    <span className="job-posted">🕒 {job.posted}</span>
                  </div>
                  <button className="job-details-btn" onClick={() => setSelected(job)}>
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="jobs-list">
          {paginated.map(job => {
            const isSaved   = saved.has(job.id);
            const isApplied = applied.has(job.id);
            return (
              <div key={job.id} className={`job-list-row${isApplied ? " job-list-row--applied" : ""}`}
                onClick={() => setSelected(job)}>
                <CompanyLogo logo={job.logo} color={job.color} />
                <div className="job-list-row__main">
                  <div className="job-list-row__head">
                    <h3 className="job-card__title">{job.title}</h3>
                    {isApplied && <span className="job-applied-pill">✓ Applied</span>}
                  </div>
                  <p className="job-card__company">{job.company} · {job.location} · {job.type}</p>
                  <div className="job-list-row__tags">
                    {job.tags.slice(0, 5).map(t => <span key={t} className="job-tag">{t}</span>)}
                  </div>
                </div>
                <div className="job-list-row__right">
                  <MatchBadge match={job.match} />
                  <span className="job-salary-label">{job.salary}</span>
                  <span className="job-posted">{job.posted}</span>
                  <button className={`job-save-btn${isSaved ? " saved" : ""}`}
                    onClick={e => { e.stopPropagation(); toggleSave(job.id); }}>
                    {isSaved ? "🔖" : "🏷️"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="jobs-pagination">
          <button className="jobs-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div className="jobs-page-nums">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`jobs-page-num${page === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
          <button className="jobs-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* job detail modal */}
      <JobModal
        job={selectedJob}
        onClose={() => setSelected(null)}
        onApply={handleApply}
        applied={selectedJob ? applied.has(selectedJob.id) : false}
        saved={selectedJob ? saved.has(selectedJob.id) : false}
        onSave={toggleSave}
      />
    </div>
  );
}
