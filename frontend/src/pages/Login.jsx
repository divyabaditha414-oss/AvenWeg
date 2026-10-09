import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import API from "../api";
import "../auth.css";

/* ── eye icon helpers ── */
function EyeOpen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── map backend errors to user-friendly messages ── */
function mapError(err) {
  if (!err?.response) {
    return "Unable to connect to the server. Check your connection and try again.";
  }
  const status = err.response.status;
  if (status === 401 || status === 400) {
    return "Invalid email or password.";
  }
  if (status === 422) {
    return "Please enter a valid email and password.";
  }
  if (status >= 500) {
    return "A server error occurred. Please try again shortly.";
  }
  return "Sign in failed. Please try again.";
}

function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();

  /* success message passed from Register on redirect */
  const successMsg = location.state?.message || "";

  const [form, setForm]       = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /* ── field-level errors (only after blur) ── */
  const errors = {
    email:    touched.email    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                ? "Enter a valid email address." : "",
    password: touched.password && form.password.length === 0
                ? "Password is required."        : "",
  };

  const isFormValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length > 0;

  /* ── handlers ── */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setServerError("");
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError("");

    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await API.post("/login", {
        email:    form.email.toLowerCase().trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── LEFT BRAND PANEL ── */}
      <section className="auth-brand">
        <div className="auth-brand__logo">
  <span className="auth-brand__logo-mark">✦</span>
  AvenWeg
</div>

        <div className="auth-brand__body">
          <h1>Welcome back.<br />Keep building.</h1>
          <p>
            Sign in to access your personalised dashboard — track applications,
            improve your resume, and prepare for your next opportunity.
          </p>

          <div className="auth-brand__features">
            {[
              "AI resume analysis & feedback",
              "Smart job matching",
              "Application pipeline tracking",
              "Mock interview preparation",
            ].map((f) => (
              <div className="auth-brand__feature" key={f}>
                <span className="auth-brand__feature-icon">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIGHT FORM PANEL ── */}
      <section className="auth-form-panel">
        <div className="auth-card">
          <h1 className="auth-card__heading">Sign in to your account</h1>
          <p className="auth-card__sub">Enter your credentials to continue your career journey.</p>

          {/* success banner from registration redirect */}
          {successMsg && !serverError && (
            <div className="auth-alert auth-alert--success" role="status">
              {successMsg}
            </div>
          )}

          {/* server-level error */}
          {serverError && (
            <div className="auth-alert auth-alert--error" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className={`form-input${errors.email ? " input-error" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              {errors.email && (
                <p className="field-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="input-wrap">
                <input
                  id="login-password"
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-wrap__toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-card__footer">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-card__link">Create a free account</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Login;
