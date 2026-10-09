import { useState } from "react";
import "./PageShell.css";
import "./Notifications.css";

const INITIAL = [
  { id:1, icon:"🎉", title:"Welcome to AI Career Assistant!",     body:"Your account is set up. Complete your profile to unlock personalised features.", time:"Just now",    read:false, type:"info"    },
  { id:2, icon:"👤", title:"Complete your profile",               body:"Add your education, branch, and preferred role to get personalised job matches.",  time:"2 hrs ago",  read:false, type:"action"  },
  { id:3, icon:"📄", title:"Resume upload available",             body:"Go to the Resume section to upload your PDF or DOCX and get AI-powered feedback.", time:"5 hrs ago",  read:false, type:"action"  },
  { id:4, icon:"💼", title:"24 job matches ready",                body:"We found 24 sample job listings that match your profile. Browse them in Jobs.",    time:"1 day ago",  read:true,  type:"update"  },
  { id:5, icon:"🎤", title:"Mock interview practice unlocked",    body:"Practice with 60+ real interview questions across DSA, System Design, HR, and more.", time:"1 day ago", read:true,  type:"feature" },
  { id:6, icon:"📚", title:"4-week study plan ready",             body:"Your placement preparation plan is ready in the Preparation section.",             time:"2 days ago", read:true,  type:"feature" },
  { id:7, icon:"🧠", title:"Skill gap analysis available",        body:"See how your skills compare to your target role requirements in Skill Gap.",       time:"2 days ago", read:true,  type:"feature" },
  { id:8, icon:"🤖", title:"AI Assistant available",              body:"Ask career questions and get guidance in the AI Assistant section.",               time:"3 days ago", read:true,  type:"feature" },
];

const TYPE_STYLE = {
  info:    { bg:"#eff6ff", border:"#bfdbfe", color:"#1d4ed8" },
  action:  { bg:"#fffbeb", border:"#fde68a", color:"#b45309" },
  update:  { bg:"#f0fdf4", border:"#bbf7d0", color:"#15803d" },
  feature: { bg:"#f5f3ff", border:"#ddd6fe", color:"#6d28d9" },
};

const FILTER_TABS = ["All", "Unread", "Actions", "Features"];

export default function Notifications() {
  const [notes,  setNotes]  = useState(INITIAL);
  const [filter, setFilter] = useState("All");

  const unread = notes.filter(n => !n.read).length;

  const markAll   = () => setNotes(prev => prev.map(n => ({ ...n, read:true })));
  const markOne   = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read:true } : n));
  const deleteOne = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const deleteAll = () => setNotes([]);

  const filtered = notes.filter(n => {
    if (filter === "All")      return true;
    if (filter === "Unread")   return !n.read;
    if (filter === "Actions")  return n.type === "action";
    if (filter === "Features") return n.type === "feature";
    return true;
  });

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">NOTIFICATIONS</p>
        <h1 className="page-shell__title">Notifications</h1>
        <p className="page-shell__sub">Stay updated on your career progress, new features, and action items.</p>
      </div>

      {/* toolbar */}
      <div className="notif-toolbar">
        <div className="notif-tabs">
          {FILTER_TABS.map(f => (
            <button key={f}
              className={`notif-tab${filter===f?" notif-tab--active":""}`}
              onClick={() => setFilter(f)}>
              {f}{f === "Unread" && unread > 0 && <span className="notif-tab__badge">{unread}</span>}
            </button>
          ))}
        </div>
        <div className="notif-toolbar__actions">
          {unread > 0 && (
            <button className="notif-action-text" onClick={markAll}>Mark all read</button>
          )}
          {notes.length > 0 && (
            <button className="notif-action-text notif-action-text--danger" onClick={deleteAll}>Clear all</button>
          )}
        </div>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔔</div>
          <h3>{notes.length === 0 ? "All caught up!" : "No notifications here"}</h3>
          <p>{notes.length === 0 ? "No notifications right now. Check back later." : "Try a different filter."}</p>
        </div>
      ) : (
        <div className="notif-list">
          {filtered.map(n => {
            const s = TYPE_STYLE[n.type] || TYPE_STYLE.info;
            return (
              <div key={n.id} className={`notif-item${n.read?" notif-item--read":""}`}>
                <div className="notif-item__icon-wrap"
                  style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
                  {n.icon}
                </div>
                <div className="notif-item__body">
                  <div className="notif-item__head">
                    <span className="notif-item__title">{n.title}</span>
                    {!n.read && <span className="notif-dot" />}
                  </div>
                  <p className="notif-item__text">{n.body}</p>
                  <span className="notif-item__time">{n.time}</span>
                </div>
                <div className="notif-item__actions">
                  {!n.read && (
                    <button className="notif-btn" onClick={() => markOne(n.id)} title="Mark as read">✓</button>
                  )}
                  <button className="notif-btn notif-btn--del" onClick={() => deleteOne(n.id)} title="Delete">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
