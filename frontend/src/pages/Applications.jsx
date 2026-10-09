import { useEffect, useState } from "react";
import "./PageShell.css";
import "./Applications.css";

/* ══════════════════ STATUS CONFIG ══════════════════ */
const STATUS_META = {
  Applied:     { bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe", icon:"📨", dark:"#1e40af" },
  "In Review": { bg:"#fffbeb", color:"#b45309", border:"#fde68a", icon:"🔍", dark:"#92400e" },
  Interview:   { bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0", icon:"🎤", dark:"#166534" },
  Offered:     { bg:"#f5f3ff", color:"#6d28d9", border:"#ddd6fe", icon:"🎉", dark:"#5b21b6" },
  Rejected:    { bg:"#fef2f2", color:"#b91c1c", border:"#fecaca", icon:"❌", dark:"#991b1b" },
};
const ALL_STATUSES = Object.keys(STATUS_META);
const PRIORITIES   = ["Low", "Medium", "High", "Urgent"];
const PRIORITY_COLOR = { Low:"#94a3b8", Medium:"#f59e0b", High:"#ef4444", Urgent:"#7c3aed" };

/* ══════════════════ SEED DATA ══════════════════ */
const seed = () => {
  try {
    const ls = JSON.parse(localStorage.getItem("applications") || "null");
    if (ls && ls.length > 0) return ls;
  } catch {}
  return [
    { id:1,  role:"Software Engineer",    company:"TechCorp India",  date:"2026-09-18", status:"Interview",  priority:"High",   note:"Round 2 scheduled Sep 28. Focus: system design + DSA.",  location:"Hyderabad", salary:"8–12 LPA", tags:["React","Node.js"], timeline:[{ date:"2026-09-18", event:"Applied" },{ date:"2026-09-20", event:"Phone screen" },{ date:"2026-09-28", event:"Round 2 scheduled" }] },
    { id:2,  role:"Frontend Developer",   company:"Infosys",         date:"2026-09-15", status:"In Review",  priority:"Medium", note:"Awaiting HR callback. Applied via referral.",            location:"Bengaluru", salary:"6–10 LPA", tags:["React","TypeScript"], timeline:[{ date:"2026-09-15", event:"Applied via referral" }] },
    { id:3,  role:"Full Stack Developer", company:"StartupXYZ",      date:"2026-09-10", status:"Applied",    priority:"Low",    note:"",                                                       location:"Remote",    salary:"10–15 LPA",tags:["React","Python"], timeline:[{ date:"2026-09-10", event:"Applied online" }] },
    { id:4,  role:"Data Analyst",         company:"Analytics Co.",   date:"2026-09-05", status:"Rejected",   priority:"Low",    note:"Position filled internally.",                            location:"Pune",      salary:"5–8 LPA",  tags:["Python","SQL"], timeline:[{ date:"2026-09-05", event:"Applied" },{ date:"2026-09-12", event:"Rejection received" }] },
    { id:5,  role:"Backend Developer",    company:"Wipro",           date:"2026-09-03", status:"Offered",    priority:"Urgent", note:"Offer deadline Sep 30. Package: 7 LPA + bonus.",         location:"Chennai",   salary:"5–8 LPA",  tags:["Python","FastAPI"], timeline:[{ date:"2026-09-03", event:"Applied" },{ date:"2026-09-10", event:"Technical round" },{ date:"2026-09-18", event:"HR round" },{ date:"2026-09-25", event:"Offer received 🎉" }] },
    { id:6,  role:"ML Engineer",          company:"AI Solutions",    date:"2026-09-22", status:"Applied",    priority:"High",   note:"Reached out via LinkedIn before applying.",               location:"Bengaluru", salary:"12–20 LPA",tags:["Python","TensorFlow"], timeline:[{ date:"2026-09-22", event:"Applied" }] },
  ];
};

const EMPTY_FORM = {
  role:"", company:"", location:"", date:"", status:"Applied",
  priority:"Medium", note:"", salary:"", tags:"",
  interview_date:"", interview_type:"", contact_name:"", contact_email:"",
};

/* ── APPLICATION GOALS ── */
const DEFAULT_GOALS = { target: 20, interviews: 5, offers: 2 };
function GoalTracker({ apps }) {
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("app_goals")) || DEFAULT_GOALS; } catch { return DEFAULT_GOALS; }
  });
  const [editing, setEditing] = useState(false);
  const save = () => { localStorage.setItem("app_goals", JSON.stringify(goals)); setEditing(false); };
  const applied   = apps.length;
  const interviews= apps.filter(a => a.status === "Interview").length;
  const offers    = apps.filter(a => a.status === "Offered").length;
  const bars = [
    { label:"Applications", current:applied,    target:goals.target,     color:"#6366f1" },
    { label:"Interviews",   current:interviews, target:goals.interviews, color:"#10b981" },
    { label:"Offers",       current:offers,     target:goals.offers,     color:"#f59e0b" },
  ];
  return (
    <div className="app-goals page-card">
      <div className="app-goals__head">
        <h3>🎯 Monthly Goals</h3>
        <button className="app-goals__edit" onClick={() => editing ? save() : setEditing(true)}>
          {editing ? "Save" : "Edit Goals"}
        </button>
      </div>
      <div className="app-goals__grid">
        {bars.map(b => (
          <div key={b.label} className="app-goal-item">
            <div className="app-goal-item__head">
              <span className="app-goal-item__label">{b.label}</span>
              <span className="app-goal-item__val" style={{ color: b.color }}>
                {b.current}{editing
                  ? <span>/<input className="app-goal-input" type="number" min="1" max="100" value={b.target}
                      onChange={e => setGoals(p => ({ ...p, [b.label.toLowerCase()]: Number(e.target.value) }))} /></span>
                  : `/${b.target}`}
              </span>
            </div>
            <div className="app-goal-bar">
              <div style={{ width:`${Math.min(100,(b.current/b.target)*100)}%`, background:b.color }} />
            </div>
            <span className="app-goal-item__pct">{b.target>0?Math.round((b.current/b.target)*100):0}% of goal</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ STATUS BADGE ══════════════════ */
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.Applied;
  return (
    <span className="app-badge"
      style={{ background:m.bg, color:m.color, border:`1px solid ${m.border}` }}>
      {m.icon} {status}
    </span>
  );
}

function PriorityDot({ priority }) {
  const color = PRIORITY_COLOR[priority] || "#94a3b8";
  return <span className="app-priority-dot" style={{ background:color }} title={`${priority} priority`} />;
}

/* ══════════════════ STATS PANEL ══════════════════ */
function StatsPanel({ apps }) {
  const total     = apps.length;
  const offered   = apps.filter(a => a.status === "Offered").length;
  const interview = apps.filter(a => a.status === "Interview").length;
  const rejected  = apps.filter(a => a.status === "Rejected").length;
  const active    = apps.filter(a => !["Rejected","Offered"].includes(a.status)).length;
  const rate      = total > 0 ? Math.round((interview + offered) / total * 100) : 0;
  const offerRate = total > 0 ? Math.round(offered / total * 100) : 0;

  return (
    <div className="app-stats">
      <div className="app-stat-card app-stat-card--blue">
        <span className="app-stat-icon">📨</span>
        <span className="app-stat-val">{total}</span>
        <span className="app-stat-lbl">Total Applied</span>
      </div>
      <div className="app-stat-card app-stat-card--green">
        <span className="app-stat-icon">📈</span>
        <span className="app-stat-val">{rate}%</span>
        <span className="app-stat-lbl">Response Rate</span>
      </div>
      <div className="app-stat-card app-stat-card--purple">
        <span className="app-stat-icon">🎤</span>
        <span className="app-stat-val">{interview}</span>
        <span className="app-stat-lbl">Interviews</span>
      </div>
      <div className="app-stat-card app-stat-card--gold">
        <span className="app-stat-icon">🎉</span>
        <span className="app-stat-val">{offered}</span>
        <span className="app-stat-lbl">Offers ({offerRate}%)</span>
      </div>
      <div className="app-stat-card app-stat-card--teal">
        <span className="app-stat-icon">⚡</span>
        <span className="app-stat-val">{active}</span>
        <span className="app-stat-lbl">Active</span>
      </div>
      <div className="app-stat-card app-stat-card--red">
        <span className="app-stat-icon">❌</span>
        <span className="app-stat-val">{rejected}</span>
        <span className="app-stat-lbl">Rejected</span>
      </div>
    </div>
  );
}

/* ══════════════════ ADD/EDIT MODAL ══════════════════ */
function AppModal({ open, editApp, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editApp) setForm({
      role:           editApp.role           || "",
      company:        editApp.company        || "",
      location:       editApp.location       || "",
      date:           editApp.date           || "",
      status:         editApp.status         || "Applied",
      priority:       editApp.priority       || "Medium",
      note:           editApp.note           || "",
      salary:         editApp.salary         || "",
      tags:           (editApp.tags || []).join(", "),
      interview_date: editApp.interview_date || "",
      interview_type: editApp.interview_type || "",
      contact_name:   editApp.contact_name   || "",
      contact_email:  editApp.contact_email  || "",
    });
    else setForm(EMPTY_FORM);
  }, [editApp, open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return;
    onSave({
      ...form,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });
  };

  const F = ({ label, children, full }) => (
    <div className={`app-mf${full ? " app-mf--full" : ""}`}>
      <label className="app-mf__label">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="app-overlay" onClick={onClose}>
      <div className="app-modal" onClick={e => e.stopPropagation()}>
        <div className="app-modal__hd">
          <h3>{editApp ? "Edit Application" : "Add New Application"}</h3>
          <button className="app-modal__x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="app-modal__form">
          <div className="app-modal__grid">
            <F label="Job Role *"><input value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="e.g. Software Engineer" required /></F>
            <F label="Company *"><input value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} placeholder="e.g. Google" required /></F>
            <F label="Location"><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Hyderabad / Remote" /></F>
            <F label="Date Applied"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></F>
            <F label="Status">
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {ALL_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </F>
            <F label="Priority">
              <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </F>
            <F label="Expected Salary"><input value={form.salary} onChange={e=>setForm(p=>({...p,salary:e.target.value}))} placeholder="e.g. 8–12 LPA" /></F>
            <F label="Skills / Tags (comma-separated)"><input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="React, Python, SQL" /></F>
            <F label="Interview Date (if scheduled)"><input type="datetime-local" value={form.interview_date} onChange={e=>setForm(p=>({...p,interview_date:e.target.value}))} /></F>
            <F label="Interview Type"><input value={form.interview_type} onChange={e=>setForm(p=>({...p,interview_type:e.target.value}))} placeholder="e.g. Technical Round, HR, Online Assessment" /></F>
            <F label="Recruiter / Contact Name"><input value={form.contact_name} onChange={e=>setForm(p=>({...p,contact_name:e.target.value}))} placeholder="e.g. Priya Sharma" /></F>
            <F label="Contact Email"><input type="email" value={form.contact_email} onChange={e=>setForm(p=>({...p,contact_email:e.target.value}))} placeholder="recruiter@company.com" /></F>
            <F label="Notes" full>
              <textarea rows={3} value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder="Round details, recruiter contact, deadlines…" />
            </F>
          </div>
          <div className="app-modal__ft">
            <button type="button" className="page-btn page-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="page-btn page-btn--primary">{editApp ? "Save Changes" : "Add Application"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════ DETAIL DRAWER ══════════════════ */
function AppDrawer({ app, onClose, onEdit, onDelete, onStatusChange }) {
  if (!app) return null;
  const m = STATUS_META[app.status] || STATUS_META.Applied;
  return (
    <div className="app-overlay" onClick={onClose}>
      <div className="app-drawer" onClick={e => e.stopPropagation()}>
        <button className="app-modal__x app-drawer__x" onClick={onClose}>✕</button>

        <div className="app-drawer__header">
          <div className="app-drawer__logo" style={{ background:`${m.color}18`, color:m.color }}>
            {app.company.charAt(0)}
          </div>
          <div>
            <h2 className="app-drawer__title">{app.role}</h2>
            <p className="app-drawer__company">{app.company} · {app.location}</p>
          </div>
        </div>

        <div className="app-drawer__badges">
          <StatusBadge status={app.status} />
          <span className="app-drawer__priority"
            style={{ background:`${PRIORITY_COLOR[app.priority]}18`, color:PRIORITY_COLOR[app.priority], border:`1px solid ${PRIORITY_COLOR[app.priority]}44` }}>
            {app.priority} priority
          </span>
          {app.salary && <span className="app-drawer__salary">💰 {app.salary}</span>}
        </div>

        {/* quick status update */}
        <div className="app-drawer__section">
          <p className="app-drawer__section-title">Move to Stage</p>
          <div className="app-drawer__status-row">
            {ALL_STATUSES.map(s => (
              <button key={s}
                className={`app-stage-btn${app.status === s ? " active" : ""}`}
                style={app.status === s ? { background:STATUS_META[s].bg, borderColor:STATUS_META[s].border, color:STATUS_META[s].color } : {}}
                onClick={() => onStatusChange(app.id, s)}>
                {STATUS_META[s].icon} {s}
              </button>
            ))}
          </div>
        </div>

        {/* interview info */}
        {(app.interview_date || app.contact_name) && (
          <div className="app-drawer__section">
            <p className="app-drawer__section-title">Interview Details</p>
            {app.interview_date && (
              <div className="app-drawer__interview">
                <span>📅</span>
                <div>
                  <p style={{fontWeight:700,fontSize:14,color:"#0f172a"}}>
                    {new Date(app.interview_date).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}
                  </p>
                  {app.interview_type && <p style={{fontSize:13,color:"#64748b"}}>{app.interview_type}</p>}
                </div>
              </div>
            )}
            {app.contact_name && (
              <div className="app-drawer__interview" style={{marginTop:8}}>
                <span>👤</span>
                <div>
                  <p style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{app.contact_name}</p>
                  {app.contact_email && <a href={`mailto:${app.contact_email}`} style={{fontSize:12,color:"#6366f1"}}>{app.contact_email}</a>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* skills */}
        {app.tags?.length > 0 && (
          <div className="app-drawer__section">
            <p className="app-drawer__section-title">Required Skills</p>
            <div className="app-drawer__tags">
              {app.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
            </div>
          </div>
        )}

        {/* notes */}
        {app.note && (
          <div className="app-drawer__section">
            <p className="app-drawer__section-title">Notes</p>
            <p className="app-drawer__note">{app.note}</p>
          </div>
        )}

        {/* timeline */}
        {app.timeline?.length > 0 && (
          <div className="app-drawer__section">
            <p className="app-drawer__section-title">Timeline</p>
            <div className="app-timeline">
              {app.timeline.map((t, i) => (
                <div key={i} className="app-timeline-item">
                  <div className="app-timeline-item__dot" />
                  <div className="app-timeline-item__content">
                    <p className="app-timeline-item__event">{t.event}</p>
                    <p className="app-timeline-item__date">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="app-drawer__footer">
          <button className="page-btn page-btn--ghost" onClick={() => onEdit(app)}>✏️ Edit</button>
          <button className="page-btn page-btn--danger" onClick={() => { onClose(); onDelete(app.id); }}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ KANBAN COLUMN ══════════════════ */
function KanbanColumn({ status, apps, onCardClick, onStatusChange }) {
  const m = STATUS_META[status];
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`kanban-col${dragOver ? " kanban-col--dragover" : ""}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault(); setDragOver(false);
        const id = Number(e.dataTransfer.getData("appId"));
        if (id) onStatusChange(id, status);
      }}
    >
      <div className="kanban-col__header" style={{ borderTop:`3px solid ${m.color}` }}>
        <span className="kanban-col__icon">{m.icon}</span>
        <span className="kanban-col__title">{status}</span>
        <span className="kanban-col__count" style={{ background:m.bg, color:m.color }}>{apps.length}</span>
      </div>
      <div className="kanban-col__body">
        {apps.length === 0 ? (
          <div className="kanban-empty">
            <p>Drop cards here</p>
          </div>
        ) : apps.map(app => (
          <div
            key={app.id}
            className="kanban-card"
            draggable
            onDragStart={e => e.dataTransfer.setData("appId", String(app.id))}
            onClick={() => onCardClick(app)}
          >
            <div className="kanban-card__header">
              <PriorityDot priority={app.priority} />
              <span className="kanban-card__company">{app.company}</span>
              <span className="kanban-card__date">{app.date?.slice(5)}</span>
            </div>
            <p className="kanban-card__role">{app.role}</p>
            {app.salary && <p className="kanban-card__salary">💰 {app.salary}</p>}
            {app.tags?.length > 0 && (
              <div className="kanban-card__tags">
                {app.tags.slice(0,3).map(t=><span key={t} className="kanban-tag">{t}</span>)}
              </div>
            )}
            {app.note && <p className="kanban-card__note">{app.note.slice(0,60)}{app.note.length>60?"…":""}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ MAIN COMPONENT ══════════════════ */
export default function Applications() {
  const [apps,      setApps]      = useState(seed);
  const [view,      setView]      = useState("kanban"); // "kanban" | "table"
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp,   setEditApp]   = useState(null);
  const [detailApp, setDetailApp] = useState(null);
  const [delConfirm,setDelConfirm]= useState(null);
  const [sortCol,   setSortCol]   = useState("date");
  const [sortDir,   setSortDir]   = useState("desc");

  /* persist to localStorage */
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(apps));
  }, [apps]);

  /* CRUD */
  const saveApp = (form) => {
    if (editApp) {
      setApps(prev => prev.map(a => a.id === editApp.id
        ? { ...a, ...form, timeline: a.timeline || [] }
        : a));
    } else {
      const newApp = {
        id: Date.now(), ...form,
        timeline: [{ date: form.date || new Date().toISOString().slice(0,10), event:"Applied" }],
      };
      setApps(prev => [...prev, newApp]);
    }
    setModalOpen(false); setEditApp(null);
  };

  const deleteApp = (id) => {
    setApps(prev => prev.filter(a => a.id !== id));
    setDelConfirm(null);
    if (detailApp?.id === id) setDetailApp(null);
  };

  const updateStatus = (id, status) => {
    setApps(prev => prev.map(a => {
      if (a.id !== id) return a;
      const newEvent = { date: new Date().toISOString().slice(0,10), event: `Moved to ${status}` };
      return { ...a, status, timeline: [...(a.timeline||[]), newEvent] };
    }));
    setDetailApp(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const openEdit = (app) => {
    setDetailApp(null);
    setEditApp(app);
    setModalOpen(true);
  };

  const openAdd = () => { setEditApp(null); setModalOpen(true); };

  /* sort / filter */
  const sortTable = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const displayed = apps
    .filter(a => {
      const q = search.toLowerCase();
      const ms = !q || a.role.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
      const mf = filter === "All" || a.status === filter;
      return ms && mf;
    })
    .sort((a, b) => {
      let va = a[sortCol] || "", vb = b[sortCol] || "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length; return acc;
  }, {});

  const SortIcon = ({ col }) => sortCol === col
    ? <span className="app-sort-icon">{sortDir === "asc" ? "▲" : "▼"}</span>
    : <span className="app-sort-icon app-sort-icon--dim">⇅</span>;

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">APPLICATIONS</p>
        <h1 className="page-shell__title">Application Tracker</h1>
        <p className="page-shell__sub">Track every application from submission to offer. Drag cards between columns to update status.</p>
      </div>

      {/* stats */}
      <StatsPanel apps={apps} />

      {/* goal tracker */}
      <GoalTracker apps={apps} />

      {/* upcoming interviews */}
      {apps.some(a => a.interview_date) && (
        <div className="page-card app-upcoming">
          <h3 className="app-upcoming__title">📅 Upcoming Interviews</h3>
          <div className="app-upcoming__list">
            {apps
              .filter(a => a.interview_date && new Date(a.interview_date) >= new Date())
              .sort((a,b) => new Date(a.interview_date) - new Date(b.interview_date))
              .slice(0,5)
              .map(a => (
                <div key={a.id} className="app-upcoming__item" onClick={() => setDetailApp(a)}>
                  <div className="app-upcoming__item-left">
                    <span className="app-upcoming__date">
                      {new Date(a.interview_date).toLocaleDateString("en-IN",{month:"short",day:"numeric"})}
                    </span>
                    <span className="app-upcoming__time">
                      {new Date(a.interview_date).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
                    </span>
                  </div>
                  <div className="app-upcoming__item-right">
                    <p className="app-upcoming__role">{a.role}</p>
                    <p className="app-upcoming__company">{a.company}{a.interview_type ? ` · ${a.interview_type}` : ""}</p>
                  </div>
                  <span className="app-upcoming__arrow">→</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* toolbar */}
      <div className="app-toolbar">
        <div className="app-search-wrap">
          <span>🔍</span>
          <input className="app-search" placeholder="Search role or company…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="app-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <div className="app-filter-tabs">
          {["All",...ALL_STATUSES].map(s => (
            <button key={s}
              className={`app-filter-btn${filter===s?" app-filter-btn--active":""}`}
              onClick={() => setFilter(s)}>
              {s}{s !== "All" && <span className="app-filter-count">{counts[s]}</span>}
            </button>
          ))}
        </div>

        <div className="app-toolbar__right">
          <div className="app-view-toggle">
            <button className={`app-view-btn${view==="kanban"?" active":""}`} onClick={() => setView("kanban")} title="Kanban board">⊞</button>
            <button className={`app-view-btn${view==="table"?" active":""}`}  onClick={() => setView("table")}  title="Table view">☰</button>
          </div>
          <button className="page-btn page-btn--primary" onClick={openAdd}>+ Add Application</button>
        </div>
      </div>

      {/* ── KANBAN VIEW ── */}
      {view === "kanban" && (
        <div className="kanban-board">
          {ALL_STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              apps={displayed.filter(a => a.status === status)}
              onCardClick={setDetailApp}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {view === "table" && (
        displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <h3>{apps.length === 0 ? "No applications yet" : "No results"}</h3>
            <p>{apps.length === 0 ? "Add your first application to start tracking." : "Try a different search or filter."}</p>
            {apps.length === 0 && <button className="page-btn page-btn--primary" style={{marginTop:16}} onClick={openAdd}>Add Application</button>}
          </div>
        ) : (
          <div className="app-table-wrap page-card">
            <table className="app-table">
              <thead>
                <tr>
                  <th onClick={() => sortTable("role")} className="app-th-sort">Role <SortIcon col="role" /></th>
                  <th onClick={() => sortTable("company")} className="app-th-sort">Company <SortIcon col="company" /></th>
                  <th onClick={() => sortTable("location")} className="app-th-sort">Location <SortIcon col="location" /></th>
                  <th onClick={() => sortTable("date")} className="app-th-sort">Applied <SortIcon col="date" /></th>
                  <th onClick={() => sortTable("status")} className="app-th-sort">Status <SortIcon col="status" /></th>
                  <th onClick={() => sortTable("priority")} className="app-th-sort">Priority <SortIcon col="priority" /></th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(a => (
                  <tr key={a.id} onClick={() => setDetailApp(a)} className="app-table-row">
                    <td className="app-table__role">
                      <PriorityDot priority={a.priority} /> {a.role}
                    </td>
                    <td className="app-table__company">{a.company}</td>
                    <td className="app-table__loc">📍 {a.location}</td>
                    <td className="app-table__date">{a.date}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <select className="app-status-select"
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}>
                        {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <span className="app-priority-pill"
                        style={{ color:PRIORITY_COLOR[a.priority], background:`${PRIORITY_COLOR[a.priority]}14`, border:`1px solid ${PRIORITY_COLOR[a.priority]}33` }}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="app-table__note">{a.note ? a.note.slice(0,60)+(a.note.length>60?"…":"") : <span className="app-table__empty">—</span>}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="app-table__actions">
                        <button className="app-action-btn" onClick={() => openEdit(a)} title="Edit">✏️</button>
                        <button className="app-action-btn app-action-btn--del" onClick={() => setDelConfirm(a.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Add/Edit modal */}
      <AppModal open={modalOpen} editApp={editApp} onClose={() => { setModalOpen(false); setEditApp(null); }} onSave={saveApp} />

      {/* Detail drawer */}
      <AppDrawer app={detailApp} onClose={() => setDetailApp(null)}
        onEdit={openEdit} onDelete={deleteApp} onStatusChange={updateStatus} />

      {/* Delete confirm */}
      {delConfirm && (
        <div className="app-overlay" onClick={() => setDelConfirm(null)}>
          <div className="app-modal app-modal--sm" onClick={e=>e.stopPropagation()}>
            <h3>Delete Application?</h3>
            <p>This cannot be undone.</p>
            <div className="app-modal__ft">
              <button className="page-btn page-btn--ghost" onClick={() => setDelConfirm(null)}>Cancel</button>
              <button className="page-btn page-btn--danger" onClick={() => deleteApp(delConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
