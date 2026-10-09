import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api";
import "../auth.css";

/* ── password requirement rules ── */
const REQUIREMENTS = [
  { id: "len",   label: "At least 8 characters",   test: (p) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter",     test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter",     test: (p) => /[a-z]/.test(p) },
  { id: "digit", label: "One number",               test: (p) => /[0-9]/.test(p) },
];

/* ── eye icon helpers ── */
function EyeOpen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── map backend error messages to user-friendly text ── */
function mapError(err) {
  const detail = err?.response?.data?.detail || "";
  if (detail.toLowerCase().includes("already registered") || detail.toLowerCase().includes("already exists")) {
    return "An account with this email already exists.";
  }
  if (err?.response?.status === 422) {
    return "Please check your details and try again.";
  }
  if (err?.response?.status >= 500) {
    return "A server error occurred. Please try again shortly.";
  }
  if (!err?.response) {
    return "Unable to connect to the server. Check your connection.";
  }
  return "Registration failed. Please try again.";
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched]   = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState("");

  /* ── derived state ── */
  const pwMet = REQUIREMENTS.map((r) => ({ ...r, passed: r.test(form.password) }));
  const allPwMet = pwMet.every((r) => r.passed);

  /* ── field-level errors (only after blur) ── */
  const errors = {
    name:    touched.name    && !form.name.trim()           ? "Full name is required."            : "",
    email:   touched.email   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                                                            ? "Enter a valid email address."      : "",
    password: touched.password && !allPwMet                 ? "Password does not meet requirements." : "",
    confirm: touched.confirm && form.confirm !== form.password ? "Passwords do not match."        : "",
  };

  const isFormValid =
    form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    allPwMet &&
    form.confirm === form.password;

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

    /* mark all fields touched so errors show */
    setTouched({ name: true, email: true, password: true, confirm: true });
    setServerError("");

    if (!isFormValid) return;

    setLoading(true);
    try {
      await API.post("/register", {
        name:     form.name.trim(),
        email:    form.email.toLowerCase().trim(),
        password: form.password,
      });

      navigate("/login", { state: { message: "Account created successfully. Please sign in." } });
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
          <h1>Start your career<br />journey today.</h1>
          <p>
            Create your free account and get personalised guidance to prepare
            for your dream job — from resume analysis to mock interviews.
          </p>

          <div className="auth-brand__features">
            {[
              "AI-powered resume analysis",
              "Smart job matching",
              "Application tracking",
              "Personalised interview prep",
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
          <h1 className="auth-card__heading">Create your account</h1>
          <p className="auth-card__sub">
  Join AvenWeg and take the next step in your career.
</p>

          {/* server-level error */}
          {serverError && (
            <div className="auth-alert auth-alert--error" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                className={`form-input${errors.name ? " input-error" : ""}`}
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                className={`form-input${errors.email ? " input-error" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrap">
                <input
                  id="reg-password"
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
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

              {/* live password requirements — shown once user starts typing */}
              {form.password.length > 0 && (
                <div className="pw-requirements">
                  <p className="pw-requirements__title">Password must have</p>
                  <div className="pw-req-list">
                    {pwMet.map((r) => (
                      <div className={`pw-req${r.passed ? " met" : ""}`} key={r.id}>
                        <span className="pw-req__dot">{r.passed ? "✓" : ""}</span>
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && form.password.length === 0 && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm password</label>
              <div className="input-wrap">
                <input
                  id="reg-confirm"
                  className={`form-input${errors.confirm ? " input-error" : ""}`}
                  type={showCf ? "text" : "password"}
                  name="confirm"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-wrap__toggle"
                  onClick={() => setShowCf(!showCf)}
                  aria-label={showCf ? "Hide password" : "Show password"}
                >
                  {showCf ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.confirm && <p className="field-error">{errors.confirm}</p>}
            </div>

            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-card__link">Sign in</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Register;
