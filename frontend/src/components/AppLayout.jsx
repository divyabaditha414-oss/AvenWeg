import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

/**
 * AppLayout
 * Shared shell for every authenticated page.
 * Fetches the current user once and passes it to Sidebar.
 * Children receive the full content area.
 */
function AppLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [drawerOpen, setDrawer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    API.get("/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  /* close drawer when viewport widens past mobile breakpoint */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => { if (e.matches) setDrawer(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="app-shell">

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="app-shell__sidebar">
        <Sidebar user={user} />
      </div>

      {/* ── MOBILE OVERLAY DRAWER ── */}
      {drawerOpen && (
        <div
          className="app-shell__overlay"
          onClick={() => setDrawer(false)}
          aria-hidden="true"
        />
      )}
      <div className={`app-shell__drawer${drawerOpen ? " app-shell__drawer--open" : ""}`}>
        <Sidebar user={user} onClose={() => setDrawer(false)} />
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="app-shell__content">

        {/* mobile top bar */}
        <header className="app-shell__topbar">
          <button
            className="app-shell__hamburger"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <div className="app-shell__topbar-brand">
            <span className="app-shell__topbar-mark">✦</span>
            AI Career Assistant
          </div>
        </header>

        {/* page content injected here */}
        <main className="app-shell__main">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AppLayout;
