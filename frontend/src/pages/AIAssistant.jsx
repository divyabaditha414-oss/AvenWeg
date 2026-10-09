import { useEffect, useRef, useState } from "react";
import API from "../api";
import "./PageShell.css";
import "./AIAssistant.css";

/* ═══════════════════════════════════════════════
   TOPIC META
═══════════════════════════════════════════════ */
const TOPIC_META = {
  "Resume":        { color: "#6366f1", icon: "📄" },
  "DSA":           { color: "#10b981", icon: "🧮" },
  "System Design": { color: "#0ea5e9", icon: "🏗️" },
  "Interview":     { color: "#f59e0b", icon: "🎤" },
  "Salary":        { color: "#8b5cf6", icon: "💰" },
  "Skills":        { color: "#ec4899", icon: "🧠" },
  "Placement":     { color: "#14b8a6", icon: "🎓" },
  "Study Plan":    { color: "#f97316", icon: "📚" },
  "Career Switch": { color: "#64748b", icon: "🔄" },
  "Career":        { color: "#6366f1", icon: "✦"  },
  "Off-Topic":     { color: "#ef4444", icon: "🚫" },
};

/* ═══════════════════════════════════════════════
   SUGGESTION CHIPS
═══════════════════════════════════════════════ */
const SUGGESTIONS = [
  { text: "How do I write an ATS-friendly resume?",           topic: "Resume"        },
  { text: "What DSA topics should I focus on for placements?", topic: "DSA"           },
  { text: "How do I prepare for a system design interview?",  topic: "System Design" },
  { text: "What is the STAR method for HR rounds?",           topic: "Interview"     },
  { text: "Give me a 12-week placement study plan",           topic: "Study Plan"    },
  { text: "How do I negotiate my first salary offer?",        topic: "Salary"        },
  { text: "What skills should I learn for a DevOps role?",    topic: "Skills"        },
  { text: "How do I switch from service to product company?", topic: "Career Switch" },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */

/** Format AI answer text into styled paragraphs / bullet lines */
function FormattedAnswer({ text }) {
  const lines = text.split("\n");
  return (
    <div className="ai-answer-body">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="ai-answer-spacer" />;
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={i} className="ai-answer-bullet">
              <span className="ai-answer-bullet__dot">•</span>
              <span>{line.trim().replace(/^[•\-]\s*/, "")}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(line.trim())) {
          const [num, ...rest] = line.trim().split(/\.\s/);
          return (
            <div key={i} className="ai-answer-numbered">
              <span className="ai-answer-numbered__n">{num}.</span>
              <span>{rest.join(". ")}</span>
            </div>
          );
        }
        // Section headers (all-caps lines, emoji lines)
        if (/^[🔥🌐☁️🤖📅🔑✍️💡⚡🎓📊🚀⚙️]/.test(line.trim()) || /^[A-Z\s]{6,}:/.test(line.trim())) {
          return <p key={i} className="ai-answer-section">{line.trim()}</p>;
        }
        return <p key={i} className="ai-answer-para">{line.trim()}</p>;
      })}
    </div>
  );
}

/** Source link card */
function SourceCard({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="ai-source-card">
      <span className="ai-source-card__icon">🔗</span>
      <span className="ai-source-card__label">{label}</span>
      <span className="ai-source-card__arrow">→</span>
    </a>
  );
}

/** Confidence bar */
function ConfidenceBar({ value }) {
  const pct   = Math.round(value * 100);
  const color = pct >= 90 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="ai-confidence">
      <span className="ai-confidence__label">Confidence</span>
      <div className="ai-confidence__track">
        <div className="ai-confidence__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ai-confidence__pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

/** Topic pill */
function TopicPill({ topic }) {
  const meta = TOPIC_META[topic] || TOPIC_META["Career"];
  return (
    <span className="ai-topic-pill"
      style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
      {meta.icon} {topic}
    </span>
  );
}

/** Ollama status badge */
function OllamaStatus({ available, model }) {
  return (
    <div className={`ai-ollama-status${available ? " ai-ollama-status--on" : " ai-ollama-status--off"}`}>
      <span className="ai-ollama-status__dot" />
      {available
        ? <span>Ollama · <strong>{model}</strong> · Live AI</span>
        : <span>Ollama offline · Using knowledge base</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INTRO MESSAGE
═══════════════════════════════════════════════ */
const INTRO = {
  id: 0, role: "assistant",
  text: "Hi! Welcome to AvenWeg AI Assistant 👋\n\nI can help you with:\n• Resume writing and ATS optimisation\n• DSA and system design preparation\n• Interview tips and STAR method\n• Salary negotiation strategies\n• Skill development roadmaps\n• Placement strategy for freshers\n• Career switch guidance\n\nAsk me anything career-related and I'll give you personalised, actionable advice!",
  topic: "Career",
  sources: [],
  confidence: 1.0,
  ai_powered: false,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function AIAssistant() {
  const [messages,     setMessages]     = useState([INTRO]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ available: null, model: "llama3.2" });
  const [expandedMsg,  setExpandedMsg]  = useState(null);
  const [showSugg,     setShowSugg]     = useState(true);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* ── check Ollama on mount ── */
  useEffect(() => {
    API.get("/ai/health")
      .then(r => setOllamaStatus({ available: r.data.ollama_available, model: r.data.model }))
      .catch(() => setOllamaStatus({ available: false, model: "llama3.2" }));
  }, []);

  /* ── scroll to bottom on new message ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── build history for API ── */
  const buildHistory = () =>
    messages
      .filter(m => m.id !== 0)          // skip intro
      .map(m => ({ role: m.role, content: m.text }));

  /* ── send message ── */
  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setShowSugg(false);

    const userMsg = {
      id: Date.now(), role: "user", text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: msg,
        history: buildHistory(),
      });

      const d = res.data;
      const botMsg = {
        id:            Date.now() + 1,
        role:          "assistant",
        text:          d.answer,
        topic:         d.topic,
        confidence:    d.confidence,
        sources:       d.sources || [],
        is_career:     d.is_career_related,
        ai_powered:    d.ai_powered,
        model:         d.model,
        time:          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, botMsg]);

      /* update ollama status from response */
      if (d.ai_powered && d.model) {
        setOllamaStatus({ available: true, model: d.model });
      }
    } catch (err) {
      const errMsg = {
        id:         Date.now() + 1,
        role:       "assistant",
        text:       err.response?.data?.detail
                    || "Something went wrong. Please make sure the backend is running and try again.",
        topic:      "Career",
        confidence: 0,
        sources:    [],
        is_career:  true,
        ai_powered: false,
        time:       new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError:    true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages([INTRO]);
    setShowSugg(true);
    setExpandedMsg(null);
  };

  /* ── auto-grow textarea ── */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  /* ── copy message ── */
  const copyMsg = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="page-shell ai-shell">

      {/* ── Header ── */}
      <div className="ai-header">
        <div className="page-shell__header" style={{ gap: 4 }}>
          <p className="page-shell__eyebrow">AI ASSISTANT</p>
          <h1 className="page-shell__title">AvenWeg AI Assistant</h1>
          <p className="page-shell__sub">
            Powered by Ollama · Career-domain only · Personalised with your profile
          </p>
        </div>
        <div className="ai-header__actions">
          <OllamaStatus available={ollamaStatus.available} model={ollamaStatus.model} />
          {messages.length > 1 && (
            <button className="ai-clear-btn" onClick={clearChat} title="Clear chat">
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Suggestion chips (shown until user sends first message) ── */}
      {showSugg && (
        <div className="ai-suggestions-section">
          <p className="ai-suggestions-label">💡 Suggested questions — click to ask</p>
          <div className="ai-suggestions-grid">
            {SUGGESTIONS.map(s => {
              const meta = TOPIC_META[s.topic] || TOPIC_META["Career"];
              return (
                <button
                  key={s.text}
                  className="ai-sugg-chip"
                  onClick={() => send(s.text)}
                  style={{ "--chip-color": meta.color }}
                >
                  <span className="ai-sugg-chip__icon">{meta.icon}</span>
                  <span>{s.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Chat window ── */}
      <div className="ai-chat-window">
        {messages.map((m) => (
          <div key={m.id} className={`ai-msg ai-msg--${m.role}${m.isError ? " ai-msg--error" : ""}`}>

            {/* Avatar */}
            {m.role === "assistant" && (
              <div className="ai-avatar ai-avatar--bot">✦</div>
            )}

            {/* Bubble */}
            <div className="ai-bubble">

              {/* Bubble header (assistant only) */}
              {m.role === "assistant" && m.id !== 0 && (
                <div className="ai-bubble__meta">
                  <TopicPill topic={m.topic || "Career"} />
                  {m.ai_powered && (
                    <span className="ai-powered-badge">⚡ {m.model || "AI"}</span>
                  )}
                  {!m.ai_powered && m.id !== 0 && (
                    <span className="ai-kb-badge">📖 Knowledge Base</span>
                  )}
                </div>
              )}

              {/* Message text */}
              {m.role === "assistant"
                ? <FormattedAnswer text={m.text} />
                : <p className="ai-user-text">{m.text}</p>
              }

              {/* Confidence (assistant only, non-intro) */}
              {m.role === "assistant" && m.id !== 0 && typeof m.confidence === "number" && (
                <ConfidenceBar value={m.confidence} />
              )}

              {/* Sources */}
              {m.role === "assistant" && m.sources?.length > 0 && (
                <div className="ai-sources">
                  <p className="ai-sources__label">📚 Useful Resources</p>
                  <div className="ai-sources__grid">
                    {m.sources.map(s => (
                      <SourceCard key={s.url} label={s.label} url={s.url} />
                    ))}
                  </div>
                </div>
              )}

              {/* Bubble footer */}
              <div className="ai-bubble__footer">
                <span className="ai-bubble__time">{m.time}</span>
                {m.role === "assistant" && m.id !== 0 && (
                  <button
                    className="ai-copy-btn"
                    onClick={() => copyMsg(m.text)}
                    title="Copy answer"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
            </div>

            {/* User avatar */}
            {m.role === "user" && (
              <div className="ai-avatar ai-avatar--user">U</div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="ai-msg ai-msg--assistant">
            <div className="ai-avatar ai-avatar--bot">✦</div>
            <div className="ai-bubble ai-bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Off-topic notice ── */}
      {messages.at(-1)?.is_career === false && (
        <div className="ai-offtopic-notice">
          🚫 I only answer career-related questions. Please ask about your job search, resume, interview prep, or skill development.
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="ai-input-bar">
        <div className="ai-input-wrap">
          <textarea
            ref={inputRef}
            className="ai-input"
            rows={1}
            placeholder="Ask a career question… (Enter to send · Shift+Enter for new line)"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKey}
            disabled={loading}
          />
        </div>
        <button
          className="ai-send-btn"
          onClick={() => send()}
          disabled={!input.trim() || loading}
          aria-label="Send"
        >
          {loading
            ? <span className="ai-send-spinner" />
            : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )
          }
        </button>
      </div>

      {/* ── Footer disclaimer ── */}
      <p className="ai-disclaimer">
        {ollamaStatus.available
          ? `⚡ Live AI powered by Ollama · ${ollamaStatus.model} · Responses are AI-generated — verify important information.`
          : "📖 Using knowledge base (Ollama offline). Run Ollama locally with llama3.2 for live AI answers."
        }
      </p>
    </div>
  );
}
