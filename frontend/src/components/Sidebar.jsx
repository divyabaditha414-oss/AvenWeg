import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard",      path: "/dashboard"       },
  { icon: "👤", label: "My Profile",     path: "/profile"         },
  { icon: "📄", label: "Resume",         path: "/resume"          },
  { icon: "💼", label: "Jobs",           path: "/jobs"            },
  { icon: "📋", label: "Applications",   path: "/applications"    },
  { icon: "🎯", label: "Skill Gap",      path: "/skill-gap"       },
  { icon: "📚", label: "Preparation",    path: "/preparation"     },
  { icon: "🎤", label: "Mock Interview", path: "/mock-interview"  },
  { icon: "🤖", label: "AI Assistant",   path: "/ai-assistant"    },
  { icon: "🔔", label: "Notifications",  path: "/notifications"   },
  { icon: "⚙️", label: "Settings",       path: "/settings"        },
];

function Sidebar({ user, onClose }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const initial   = user?.name?.charAt(0).toUpperCase() ?? "?";
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <aside className="sidebar">

      {/* ── LOGO ── */}
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">✦</span>
        <span className="sidebar__logo-text">AI Career</span>

        {onClose && (
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        )}
      </div>

      {/* ── NAV ── */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ icon, label, path }) => (
            <li key={path} className="sidebar__item">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  "sidebar__link" + (isActive ? " sidebar__link--active" : "")
                }
                onClick={onClose}
              >
                <span className="sidebar__icon">{icon}</span>
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── USER / SIGN OUT ── */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{initial}</div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{firstName}</p>
            <p className="sidebar__user-email">{user?.email ?? ""}</p>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout}>
          Sign out
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
