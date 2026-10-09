import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./PageShell.css";
import "./Settings.css";

function Toggle({ on, onChange, label, desc }) {
  return (
    <div className="st-toggle-row">
      <div>
        <p className="st-toggle-label">{label}</p>
        {desc && <p className="st-toggle-desc">{desc}</p>}
      </div>
      <button className={`st-toggle${on?" st-toggle--on":""}`}
        onClick={() => onChange(!on)} role="switch" aria-checked={on} aria-label={label}>
        <span className="st-toggle__thumb" />
      </button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [user,       setUser]       = useState(null);
  const [name,       setName]       = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState({ text:"", type:"" });
  const [activeTab,  setActiveTab]  = useState("account");

  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("settings_prefs")) || {
      emailNotifs: true, jobAlerts: true, weeklyDigest: false,
      prepReminders: true, profileVisibility: "private", theme: "light",
    }; } catch { return { emailNotifs:true, jobAlerts:true, weeklyDigest:false, prepReminders:true, profileVisibility:"private", theme:"light" }; }
  });

  useEffect(() => {
    API.get("/me").then(r => { setUser(r.data); setName(r.data.name); }).catch(() => {});
  }, []);

  const savePrefs = (update) => {
    const next = { ...prefs, ...update };
    setPrefs(next);
    localStorage.setItem("settings_prefs", JSON.stringify(next));
  };

  const saveAccount = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setSaveMsg({ text:"", type:"" });
    /* No PUT /me endpoint yet — show informative message */
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaveMsg({ text:"Display name saved locally. Full account update API coming soon.", type:"info" });
    setUser(prev => ({ ...prev, name: name.trim() }));
    localStorage.setItem("display_name_override", name.trim());
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace:true });
  };

  const TABS = [
    { id:"account",       icon:"👤", label:"Account"       },
    { id:"password",      icon:"🔒", label:"Password"      },
    { id:"notifications", icon:"🔔", label:"Notifications" },
    { id:"privacy",       icon:"🛡️", label:"Privacy"       },
    { id:"appearance",    icon:"🎨", label:"Appearance"    },
    { id:"danger",        icon:"⚠️", label:"Danger Zone"   },
  ];

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">SETTINGS</p>
        <h1 className="page-shell__title">Settings</h1>
        <p className="page-shell__sub">Manage your account, preferences, notifications, and privacy.</p>
      </div>

      <div className="st-layout">
        {/* left menu */}
        <nav className="st-menu">
          {TABS.map(t => (
            <button key={t.id}
              className={`st-menu-btn${activeTab===t.id?" st-menu-btn--active":""}`}
              onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* content panel */}
        <div className="page-card st-content">

          {/* ── ACCOUNT ── */}
          {activeTab === "account" && (
            <>
              <h3 className="st-content__title">👤 Account</h3>
              <hr className="st-divider" />
              {saveMsg.text && (
                <div className={`st-alert st-alert--${saveMsg.type}`}>{saveMsg.text}</div>
              )}
              <form onSubmit={saveAccount} className="st-form">
                <div className="st-grid">
                  <div className="st-field">
                    <label>Display Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                  </div>
                  <div className="st-field">
                    <label>Email Address</label>
                    <input value={user?.email || ""} disabled
                      style={{ opacity:.6, cursor:"not-allowed" }} />
                    <p className="st-field__hint">Email changes require verification (coming soon).</p>
                  </div>
                  <div className="st-field">
                    <label>Account ID</label>
                    <input value={user?.id ? `#${user.id}` : "—"} disabled
                      style={{ opacity:.6, cursor:"not-allowed" }} />
                  </div>
                </div>
                <div className="st-actions">
                  <button type="submit" className="page-btn page-btn--primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── PASSWORD ── */}
          {activeTab === "password" && (
            <>
              <h3 className="st-content__title">🔒 Password</h3>
              <hr className="st-divider" />
              <div className="st-grid">
                <div className="st-field">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" disabled style={{ opacity:.6 }} />
                </div>
                <div className="st-field">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" disabled style={{ opacity:.6 }} />
                </div>
                <div className="st-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" disabled style={{ opacity:.6 }} />
                </div>
              </div>
              <div className="coming-soon-banner" style={{ marginTop:16 }}>
                <span className="coming-soon-banner__icon">🔐</span>
                <span>Password change is coming soon. For security questions contact support.</span>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <>
              <h3 className="st-content__title">🔔 Notifications</h3>
              <hr className="st-divider" />
              <div className="st-toggles">
                <Toggle on={prefs.emailNotifs}   onChange={v => savePrefs({ emailNotifs:v })}   label="Email notifications"  desc="Receive important updates and alerts by email." />
                <Toggle on={prefs.jobAlerts}     onChange={v => savePrefs({ jobAlerts:v })}     label="Job match alerts"     desc="Get notified when new matching jobs are found." />
                <Toggle on={prefs.weeklyDigest}  onChange={v => savePrefs({ weeklyDigest:v })}  label="Weekly digest"        desc="A summary of your career progress every Monday." />
                <Toggle on={prefs.prepReminders} onChange={v => savePrefs({ prepReminders:v })} label="Preparation reminders" desc="Daily reminders to complete your preparation plan topics." />
              </div>
              <p className="st-hint">Notification preferences are saved locally to this browser.</p>
            </>
          )}

          {/* ── PRIVACY ── */}
          {activeTab === "privacy" && (
            <>
              <h3 className="st-content__title">🛡️ Privacy</h3>
              <hr className="st-divider" />
              <div className="st-field" style={{ maxWidth:360 }}>
                <label>Profile Visibility</label>
                <select value={prefs.profileVisibility}
                  onChange={e => savePrefs({ profileVisibility:e.target.value })}>
                  <option value="private">Private — only visible to me</option>
                  <option value="recruiters">Recruiters — visible to registered recruiters</option>
                  <option value="public">Public — visible to everyone</option>
                </select>
              </div>
              <div className="st-toggles" style={{ marginTop:20 }}>
                <Toggle on={true} onChange={() => {}} label="Data Privacy"
                  desc="Your data is never sold to third parties. Stored securely in our database." />
              </div>
              <div className="coming-soon-banner" style={{ marginTop:16 }}>
                <span className="coming-soon-banner__icon">🛡️</span>
                <span>Full privacy controls and data export are coming soon.</span>
              </div>
            </>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === "appearance" && (
            <>
              <h3 className="st-content__title">🎨 Appearance</h3>
              <hr className="st-divider" />
              <div className="st-field" style={{ maxWidth:280 }}>
                <label>Theme</label>
                <select value={prefs.theme} onChange={e => savePrefs({ theme:e.target.value })}>
                  <option value="light">Light (Default)</option>
                  <option value="dark">Dark (Coming Soon)</option>
                  <option value="system">Follow System (Coming Soon)</option>
                </select>
              </div>
              <div className="coming-soon-banner" style={{ marginTop:16 }}>
                <span className="coming-soon-banner__icon">🎨</span>
                <span>Dark mode and custom themes are coming soon.</span>
              </div>
            </>
          )}

          {/* ── DANGER ── */}
          {activeTab === "danger" && (
            <>
              <h3 className="st-content__title" style={{ color:"#b91c1c" }}>⚠️ Danger Zone</h3>
              <hr className="st-divider" />
              <div className="st-danger-section">
                <div className="st-danger-row">
                  <div>
                    <p className="st-danger-title">Sign Out</p>
                    <p className="st-danger-desc">Sign out of this device. You can sign back in at any time.</p>
                  </div>
                  <button className="page-btn page-btn--ghost" onClick={logout}>Sign Out</button>
                </div>
                <div className="st-danger-row">
                  <div>
                    <p className="st-danger-title">Delete Account</p>
                    <p className="st-danger-desc">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button className="page-btn page-btn--danger" disabled>Delete Account (Coming Soon)</button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
