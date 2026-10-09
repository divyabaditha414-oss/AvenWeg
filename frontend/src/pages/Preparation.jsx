import { useEffect, useState } from "react";
import "./PageShell.css";
import "./Preparation.css";

const LS_KEY = "prep_plan";

const DEFAULT_PLAN = [
  {
    week:"Week 1", theme:"Data Structures Foundations",
    topics:[
      { title:"Arrays & Strings",              duration:"2 hrs",   done:false },
      { title:"Linked Lists",                  duration:"2 hrs",   done:false },
      { title:"Stacks & Queues",               duration:"1.5 hrs", done:false },
      { title:"Hash Maps & Sets",              duration:"2 hrs",   done:false },
    ],
  },
  {
    week:"Week 2", theme:"Core Algorithms",
    topics:[
      { title:"Sorting Algorithms (Merge, Quick, Heap)", duration:"2 hrs",   done:false },
      { title:"Binary Search & Variants",      duration:"1.5 hrs", done:false },
      { title:"Two Pointer & Sliding Window",  duration:"1.5 hrs", done:false },
      { title:"Recursion & Backtracking",      duration:"2 hrs",   done:false },
    ],
  },
  {
    week:"Week 3", theme:"Advanced DSA",
    topics:[
      { title:"Trees — BFS / DFS / Height",    duration:"2 hrs",   done:false },
      { title:"Graphs — Topological Sort, Union Find", duration:"2.5 hrs", done:false },
      { title:"Heaps & Priority Queue",        duration:"1.5 hrs", done:false },
      { title:"Dynamic Programming Patterns",  duration:"3 hrs",   done:false },
    ],
  },
  {
    week:"Week 4", theme:"Web & Backend Development",
    topics:[
      { title:"REST API Design Best Practices",duration:"1.5 hrs", done:false },
      { title:"SQL — Joins, Window Functions, CTEs", duration:"2 hrs", done:false },
      { title:"Authentication: JWT & OAuth2",  duration:"1.5 hrs", done:false },
      { title:"Docker & Containerisation",     duration:"2 hrs",   done:false },
    ],
  },
  {
    week:"Week 5", theme:"Frontend Development",
    topics:[
      { title:"React — Hooks, State, Context", duration:"2 hrs",   done:false },
      { title:"TypeScript Fundamentals",       duration:"1.5 hrs", done:false },
      { title:"CSS Layouts — Flexbox & Grid",  duration:"1.5 hrs", done:false },
      { title:"Web Performance & Core Web Vitals", duration:"1.5 hrs", done:false },
    ],
  },
  {
    week:"Week 6", theme:"System Design",
    topics:[
      { title:"Scalability & Load Balancing",  duration:"2 hrs",   done:false },
      { title:"Databases: SQL vs NoSQL + Caching", duration:"2 hrs", done:false },
      { title:"Design: URL Shortener / Rate Limiter", duration:"2 hrs", done:false },
      { title:"Microservices & Message Queues", duration:"2 hrs",  done:false },
    ],
  },
  {
    week:"Week 7", theme:"Soft Skills & Communication",
    topics:[
      { title:"STAR Method for Behavioural Questions", duration:"2 hrs", done:false },
      { title:"Tell Me About Yourself (2-min pitch)", duration:"1 hr",  done:false },
      { title:"Salary Negotiation Strategies", duration:"1 hr",   done:false },
      { title:"LinkedIn Profile Optimisation", duration:"1 hr",   done:false },
    ],
  },
  {
    week:"Week 8", theme:"Interview Readiness",
    topics:[
      { title:"Company Research Template",     duration:"1 hr",    done:false },
      { title:"Mock Technical Interview",      duration:"2.5 hrs", done:false },
      { title:"Resume Final Review",           duration:"1 hr",    done:false },
      { title:"HR Round Mock + Debrief",       duration:"2 hrs",   done:false },
    ],
  },
];

const RESOURCES = [
  { icon:"📘", title:"NeetCode 150",                  desc:"Curated DSA problem list — best starting point",   tag:"DSA",        url:"https://neetcode.io" },
  { icon:"📗", title:"System Design Primer",           desc:"Free GitHub guide, comprehensive HLD/LLD",         tag:"Design",     url:"https://github.com/donnemartin/system-design-primer" },
  { icon:"📕", title:"Cracking the Coding Interview",  desc:"Classic interview prep book — still relevant",     tag:"Book",       url:"https://www.crackingthecodinginterview.com" },
  { icon:"🎥", title:"Abdul Bari — Algorithms",        desc:"YouTube — clear algorithm explanations",            tag:"Video",      url:"https://www.youtube.com/@abdul_bari" },
  { icon:"💻", title:"LeetCode",                       desc:"Practice problems organised by company & topic",   tag:"Practice",   url:"https://leetcode.com" },
  { icon:"📓", title:"STAR Method Guide",              desc:"Behavioural interview framework by Indeed",         tag:"Soft Skills",url:"https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique" },
  { icon:"🌐", title:"roadmap.sh",                     desc:"Interactive developer skill roadmaps by role",      tag:"Roadmap",    url:"https://roadmap.sh" },
  { icon:"🏗️", title:"ByteByteGo Blog",               desc:"System design visual explanations",                 tag:"Design",     url:"https://blog.bytebytego.com" },
  { icon:"📐", title:"FastAPI Official Tutorial",      desc:"Build REST APIs with Python in minutes",            tag:"Backend",    url:"https://fastapi.tiangolo.com/tutorial" },
  { icon:"🐍", title:"Real Python",                    desc:"Practical Python tutorials and deep-dives",         tag:"Python",     url:"https://realpython.com" },
  { icon:"⚛️", title:"React Official Docs",            desc:"Latest React documentation with examples",          tag:"Frontend",   url:"https://react.dev" },
  { icon:"🔑", title:"Levels.fyi",                     desc:"Research salary ranges before negotiating",         tag:"Career",     url:"https://levels.fyi" },
];

export default function Preparation() {
  const [plan, setPlan]           = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || DEFAULT_PLAN; }
    catch { return DEFAULT_PLAN; }
  });
  const [activeWeek, setWeek]     = useState(0);
  const [justReset,  setJustReset]= useState(false);

  /* persist to localStorage whenever plan changes */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(plan));
  }, [plan]);

  const toggleTopic = (wIdx, tIdx) => {
    setPlan(prev => prev.map((w, wi) =>
      wi !== wIdx ? w : {
        ...w,
        topics: w.topics.map((t, ti) =>
          ti !== tIdx ? t : { ...t, done: !t.done }
        ),
      }
    ));
  };

  const resetPlan = () => {
    setPlan(DEFAULT_PLAN);
    localStorage.removeItem(LS_KEY);
    setJustReset(true);
    setTimeout(() => setJustReset(false), 2000);
  };

  /* derived */
  const allTopics  = plan.flatMap(w => w.topics);
  const doneCount  = allTopics.filter(t => t.done).length;
  const totalCount = allTopics.length;
  const pct        = Math.round((doneCount / totalCount) * 100);

  const pctColor = pct >= 70 ? "#16a34a" : pct >= 40 ? "#d97706" : "#6366f1";

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">PREPARATION</p>
        <h1 className="page-shell__title">Placement Preparation</h1>
        <p className="page-shell__sub">Follow your 8-week study plan covering DSA, Web Dev, System Design, Soft Skills & Interview Readiness. Progress is saved automatically.</p>
      </div>

      {justReset && (
        <div className="page-card" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#15803d", padding:"12px 16px", fontSize:14 }}>
          ✓ Plan reset to default.
        </div>
      )}

      {/* overall progress */}
      <div className="page-card prep-progress">
        <div className="prep-progress__head">
          <div>
            <p className="page-shell__eyebrow">OVERALL PROGRESS</p>
            <h3 className="prep-progress__title">{doneCount} of {totalCount} topics complete</h3>
          </div>
          <span className="prep-progress__pct" style={{ color: pctColor }}>{pct}%</span>
        </div>
        <div className="prep-bar"><div className="prep-bar__fill" style={{ width:`${pct}%`, background: pctColor }} /></div>
        <div className="prep-progress__foot">
          <span className="prep-progress__tip">
            {pct === 0 && "🚀 Start with Week 1 — Data Structures Foundations"}
            {pct > 0 && pct < 30 && "💪 Good start! Keep the momentum going."}
            {pct >= 30 && pct < 60 && "🔥 Past the halfway mark — great work!"}
            {pct >= 60 && pct < 85 && "⭐ Almost there — push through the final weeks!"}
            {pct >= 85 && pct < 100 && "🏁 Final stretch — you're nearly interview-ready!"}
            {pct === 100 && "🎉 8-week plan complete! You're ready to ace any interview."}
          </span>
          <button className="prep-reset-btn" onClick={resetPlan}>Reset Plan</button>
        </div>
      </div>

      {/* week tabs */}
      <div className="prep-tabs">
        {plan.map((w, i) => {
          const d = w.topics.filter(t => t.done).length;
          const allDone = d === w.topics.length;
          return (
            <button key={w.week}
              className={`prep-tab${activeWeek===i?" prep-tab--active":""}${allDone?" prep-tab--done":""}`}
              onClick={() => setWeek(i)}>
              <span>{w.week}</span>
              <span className="prep-tab__count">{d}/{w.topics.length}</span>
              {allDone && <span className="prep-tab__check">✓</span>}
            </button>
          );
        })}
      </div>

      {/* topic list */}
      <div className="page-card prep-week">
        <div className="prep-week__head">
          <h3 className="prep-week__title">{plan[activeWeek].theme}</h3>
          <span className="prep-week__week">{plan[activeWeek].week}</span>
        </div>
        <div className="prep-topics">
          {plan[activeWeek].topics.map((topic, ti) => (
            <div key={topic.title}
              className={`prep-topic${topic.done?" prep-topic--done":""}`}
              onClick={() => toggleTopic(activeWeek, ti)}
              role="checkbox" aria-checked={topic.done} tabIndex={0}
              onKeyDown={e => e.key===" " && toggleTopic(activeWeek, ti)}>
              <div className={`prep-topic__check${topic.done?" prep-topic__check--done":""}`}>
                {topic.done ? "✓" : ""}
              </div>
              <div className="prep-topic__body">
                <span className="prep-topic__title">{topic.title}</span>
                <span className="prep-topic__dur">⏱ {topic.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* resources */}
      <div>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a", marginBottom:14 }}>📚 Recommended Resources</h3>
        <div className="prep-resources">
          {RESOURCES.map(r => (
            <a key={r.title} className="prep-resource" href={r.url} target="_blank" rel="noreferrer">
              <span className="prep-resource__icon">{r.icon}</span>
              <div>
                <p className="prep-resource__title">{r.title}</p>
                <p className="prep-resource__desc">{r.desc}</p>
              </div>
              <span className="prep-resource__tag">{r.tag}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
