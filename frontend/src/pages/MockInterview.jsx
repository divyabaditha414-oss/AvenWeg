import { useEffect, useRef, useState } from "react";
import "./PageShell.css";
import "./MockInterview.css";

/* ═══════════════════════════════════════
   QUESTION BANK  (10 categories)
═══════════════════════════════════════ */
const QUESTION_BANK = {
  dsa: [
    "Given an integer array, return indices of the two numbers that add up to a target sum.",
    "Find the longest substring without repeating characters.",
    "Given a linked list, detect if it contains a cycle.",
    "Implement a stack that supports push, pop, and retrieving the minimum element in O(1).",
    "Given a binary tree, return its level-order traversal.",
    "Find the maximum subarray sum using Kadane's algorithm.",
    "Given two sorted arrays of size m and n, find the median of the merged array.",
    "Implement a Least Recently Used (LRU) cache.",
    "Count the number of islands in a 2D grid of 0s and 1s.",
    "Check if a binary tree is a valid Binary Search Tree.",
    "Find all permutations of a string.",
    "Given a graph, detect if there is a cycle using DFS.",
  ],
  system: [
    "Design a URL shortener like bit.ly. Walk through storage, hashing, and scalability.",
    "Design a rate limiter for a high-traffic REST API.",
    "How would you design Twitter's tweet timeline for 100 million users?",
    "Design a distributed cache like Redis. How would you handle cache invalidation?",
    "How would you design a notification service that delivers push, email, and SMS?",
    "Design a file storage system similar to Google Drive.",
    "Explain the CAP theorem. When would you choose consistency over availability?",
    "How would you design a ride-sharing system like Ola or Uber?",
    "Design a leaderboard for a gaming platform with millions of concurrent users.",
    "How would you horizontally scale a monolithic application to microservices?",
    "Design a real-time collaborative document editor like Google Docs.",
    "How would you implement a search autocomplete feature at scale?",
  ],
  web: [
    "Explain the difference between server-side rendering (SSR) and client-side rendering (CSR).",
    "What is the virtual DOM in React and why does it improve performance?",
    "Explain the JavaScript event loop — call stack, callback queue, and microtask queue.",
    "What is the difference between null, undefined, and undeclared in JavaScript?",
    "How does HTTP/2 differ from HTTP/1.1? What are the main improvements?",
    "Explain REST vs GraphQL. When would you choose one over the other?",
    "What is CORS? How do you handle it in a FastAPI backend?",
    "Explain the difference between cookies, sessionStorage, and localStorage.",
    "What is debouncing and throttling? Provide a use case for each.",
    "How does React's useEffect work? Explain the cleanup function.",
    "What are React hooks? Name 5 and explain when you'd use each.",
    "What is the difference between controlled and uncontrolled components in React?",
  ],
  sql: [
    "Write a SQL query to find the second-highest salary from an Employees table.",
    "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
    "What is database normalisation? Explain 1NF, 2NF, and 3NF with examples.",
    "Write a query to find all duplicate email addresses in a Users table.",
    "What is the difference between WHERE and HAVING clauses?",
    "Explain database indexing. When would adding an index hurt performance?",
    "Write a query using a window function to rank employees by salary within each department.",
    "What is a transaction? Explain ACID properties with an example.",
    "What is the difference between a clustered and a non-clustered index?",
    "Write a recursive CTE to find all employees in a reporting hierarchy.",
    "What is query optimisation? How would you improve a slow SQL query?",
    "Explain the difference between UNION and UNION ALL.",
  ],
  hr: [
    "Tell me about yourself in 2 minutes. Walk me through your background.",
    "Describe a time when you faced a difficult technical challenge. How did you overcome it?",
    "What are your greatest strengths? Give a specific example of each in action.",
    "Where do you see yourself in 5 years?",
    "Describe a time you worked in a team and faced a conflict. How did you resolve it?",
    "Why are you interested in this role and this company?",
    "Tell me about a project you are most proud of. What was your specific contribution?",
    "How do you handle pressure and tight deadlines?",
    "What is your biggest professional weakness and how are you actively improving it?",
    "Do you have any questions for us?",
    "Tell me about a time you failed and what you learned from it.",
    "How do you stay updated with the latest technology trends?",
  ],
  cs: [
    "Explain the difference between a process and a thread. What is context switching?",
    "What is deadlock? What are the four necessary conditions for it?",
    "Explain the OSI model. What happens when you type a URL in a browser?",
    "What is virtual memory and how does the operating system manage it?",
    "Explain the four pillars of Object-Oriented Programming with code examples.",
    "What is the difference between TCP and UDP? When would you use each?",
    "What is a semaphore? How is it different from a mutex?",
    "Explain how a hash table works. What is a collision and how is it resolved?",
    "What is the time complexity of common sorting algorithms? When is each optimal?",
    "Explain garbage collection. How does Python manage memory?",
    "What is the difference between stack memory and heap memory?",
    "Explain SOLID principles with a real-world example.",
  ],
  python: [
    "What is the difference between a list and a tuple in Python? When do you use each?",
    "Explain Python decorators with a practical example.",
    "What are generators in Python? How are they different from regular functions?",
    "Explain the difference between *args and **kwargs.",
    "What is the Global Interpreter Lock (GIL) and how does it affect multithreading?",
    "How does Python's garbage collection work? What is reference counting?",
    "What is a context manager? Write an example using __enter__ and __exit__.",
    "Explain list comprehensions vs generator expressions. When would you prefer each?",
    "What is the difference between deepcopy and copy in Python?",
    "How does Python's with statement work? Give a practical use case.",
  ],
  backend: [
    "What is the difference between authentication and authorisation?",
    "Explain JWT tokens — structure, signing, validation, and expiry handling.",
    "What is database connection pooling and why is it important?",
    "Explain the difference between SQL and NoSQL databases with use cases for each.",
    "What is REST? List the 6 constraints of a RESTful system.",
    "What is an API gateway and what problems does it solve?",
    "Explain database indexing — B-tree vs hash index. When would you use each?",
    "What is N+1 query problem in ORMs? How do you fix it?",
    "Explain idempotency in HTTP methods. Which methods are idempotent?",
    "What is caching? Explain different caching strategies (write-through, write-back, read-through).",
  ],
  aptitude: [
    "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    "If 12 workers can complete a task in 8 days, how many days will 16 workers take?",
    "What is 15% of 240? If a price increases by 20% and then decreases by 20%, what is the net change?",
    "A person walks 4 km North, then 3 km East. What is the straight-line distance from the start?",
    "In a group of 40 students, 25 play cricket, 20 play football, and 10 play both. How many play neither?",
    "If today is Wednesday, what day will it be after 100 days?",
    "A number when divided by 3 leaves remainder 1, and by 4 leaves remainder 3. Find the smallest such number.",
    "Two trains of length 100m and 200m travel towards each other at 40 km/h and 60 km/h. How long to pass each other?",
    "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    "A shopkeeper sells at 10% profit. If cost price is ₹500, what is the selling price?",
  ],
  projects: [
    "Explain a project you built from scratch — what problem did it solve, and what tech stack did you use?",
    "What was the hardest technical challenge in your most recent project and how did you overcome it?",
    "How did you handle database design decisions in your project? What trade-offs did you make?",
    "Describe how you would add authentication and authorisation to a project you've built.",
    "How did you deploy your project? What would you improve about the deployment process?",
    "What testing approach did you use in your projects? How would you improve test coverage?",
    "How would you scale your project to handle 10x more users than it currently supports?",
    "Explain a bug that took a long time to find in one of your projects. What was the root cause?",
    "How did you handle API error handling and validation in your project?",
    "If you had to rebuild your best project with what you know today, what would you do differently?",
  ],
};

/* ═══════════════════════════════════════
   CATEGORIES
═══════════════════════════════════════ */
const CATEGORIES = [
  { id:"dsa",     icon:"🧮", title:"Data Structures & Algorithms", desc:"Arrays, trees, graphs, DP, Kadane's, LRU.",          difficulty:"Medium–Hard", color:"#6366f1" },
  { id:"system",  icon:"🏗️", title:"System Design",               desc:"Design scalable, distributed architectures.",         difficulty:"Hard",        color:"#0ea5e9" },
  { id:"web",     icon:"🌐", title:"Web Development",             desc:"React, JavaScript, REST APIs, HTTP basics.",           difficulty:"Easy–Medium",  color:"#10b981" },
  { id:"sql",     icon:"🗄️", title:"SQL & Databases",            desc:"Queries, joins, indexing, transactions, CTEs.",        difficulty:"Easy–Medium",  color:"#f59e0b" },
  { id:"hr",      icon:"🤝", title:"HR & Behavioural",            desc:"STAR method, tell me about yourself, conflict.",      difficulty:"Easy",         color:"#ec4899" },
  { id:"cs",      icon:"🖥️", title:"Core CS Concepts",           desc:"OS, networking, OOP, memory, SOLID.",                 difficulty:"Medium",       color:"#8b5cf6" },
  { id:"python",  icon:"🐍", title:"Python",                      desc:"Decorators, generators, GIL, memory model.",          difficulty:"Medium",       color:"#3b82f6" },
  { id:"backend", icon:"⚙️", title:"Backend Engineering",        desc:"Auth, JWT, APIs, databases, caching, N+1.",           difficulty:"Medium–Hard",  color:"#14b8a6" },
  { id:"aptitude",icon:"🔢", title:"Aptitude & Reasoning",        desc:"Quantitative, logical, series, word problems.",       difficulty:"Easy–Medium",  color:"#f97316" },
  { id:"projects",icon:"🛠️", title:"Project-Based Questions",    desc:"Explain your projects, challenges, design decisions.", difficulty:"Easy–Medium",  color:"#64748b" },
];

/* ═══════════════════════════════════════
   ANSWER SUGGESTIONS PER CATEGORY
═══════════════════════════════════════ */
const ANSWER_SUGGESTIONS = {
  dsa: [
    "Start by stating the brute-force approach and its time complexity before optimising.",
    "Mention edge cases: empty array, single element, all duplicates, negative numbers.",
    "Use the pattern name: Two Pointer / Sliding Window / BFS / DP etc.",
    "State time complexity O(?) and space complexity O(?) before finishing.",
  ],
  system: [
    "Always clarify requirements first: functional (what) + non-functional (scale, latency).",
    "Estimate DAU and QPS before drawing the architecture.",
    "Cover: API design → Database choice → Caching → Load balancing → CDN.",
    "Discuss trade-offs for every major decision (SQL vs NoSQL, consistency vs availability).",
  ],
  web: [
    "Give a definition, then a practical example from a project or real scenario.",
    "Compare with the alternative (e.g., SSR vs CSR — when to use each).",
    "Mention performance or security implications where relevant.",
    "Reference browser behaviour or the JavaScript spec where applicable.",
  ],
  sql: [
    "Write the query step by step — SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.",
    "Explain what the query does in plain English before or after writing it.",
    "Mention the impact on performance (indexes, full table scan vs index seek).",
    "Consider NULL handling and edge cases in your answer.",
  ],
  hr: [
    "Use the STAR method: Situation → Task → Action → Result (with numbers).",
    "Keep your answer under 2 minutes — be specific, not vague.",
    "End with what you learned or how it changed your approach.",
    "Avoid speaking negatively about previous employers or teammates.",
  ],
  cs: [
    "Start with the definition, then give a real-world analogy.",
    "Use code snippets or pseudocode to make abstract concepts concrete.",
    "Connect to practical implications (e.g., deadlock prevention in production systems).",
    "Compare with related concepts (e.g., mutex vs semaphore — key difference).",
  ],
  python: [
    "Show code examples — Python interview answers benefit from short working snippets.",
    "Mention Python-specific behaviour (mutable defaults, GIL, duck typing).",
    "Connect to production use cases (e.g., decorators in Flask/FastAPI routing).",
    "Explain why Python made this design decision (readability, philosophy).",
  ],
  backend: [
    "Explain the concept, then describe how you've implemented or used it in a project.",
    "Discuss security implications for auth-related questions.",
    "Mention real-world consequences of getting it wrong (e.g., N+1 causing slow APIs).",
    "Reference specific technologies/tools you've used (FastAPI, PostgreSQL, Redis).",
  ],
  aptitude: [
    "Write down the formula first, then substitute values step by step.",
    "State your assumptions clearly (e.g., 'assuming constant speed').",
    "Double-check your answer by working backwards.",
    "For series questions, look for differences, ratios, or alternating patterns.",
  ],
  projects: [
    "Follow the structure: Problem → Approach → Tech stack → Challenges → Outcome.",
    "Quantify your impact: '200 users', '40% faster', '3-second load time reduced to 0.8s'.",
    "Be honest about limitations and what you would improve with more time.",
    "Connect every answer back to skills the interviewer cares about for this role.",
  ],
};

/* ═══════════════════════════════════════
   MODEL ANSWERS (first question per category)
═══════════════════════════════════════ */
const MODEL_ANSWERS = {
  dsa: "Approach: Hash map solution in O(n) time and O(n) space.\n\nCreate an empty hash map. Iterate through the array with index i.\nFor each element nums[i], calculate complement = target - nums[i].\nIf complement exists in the hash map, return [hash_map[complement], i].\nOtherwise, store nums[i] → i in the hash map.\n\nEdge cases: No solution exists (return [] or raise), duplicate values (use index, not value as key).\n\nTime: O(n) — single pass. Space: O(n) — hash map stores up to n elements.",
  system: "Framework: Requirements → Estimation → Architecture → Deep Dive → Trade-offs.\n\n1. Requirements: Shorten long URLs, redirect user, track clicks (analytics optional).\n2. Estimate: 100M URLs/day, read-heavy (100:1 read:write ratio), ~1KB per URL.\n3. Architecture: Client → API Gateway → App Server → DB (SQL for URL mapping) + Cache (Redis for hot URLs).\n4. Short URL generation: Base62 encoding of auto-increment ID or MD5 hash (first 7 chars).\n5. DB schema: id, long_url, short_code, created_at, expiry.\n6. Trade-offs: Hash collision handling, custom aliases, TTL/expiry, analytics pipeline.",
  web: "SSR (Server-Side Rendering): HTML is generated on the server for every request. Browser receives fully rendered HTML immediately.\nPros: Better SEO, faster First Contentful Paint for slow devices.\nCons: Higher server load, full page reload on navigation.\nWhen: Content-heavy sites, blogs, e-commerce product pages.\n\nCSR (Client-Side Rendering): Browser downloads a minimal HTML shell and JavaScript renders the page.\nPros: Rich interactivity, faster navigation after initial load.\nCons: Slower initial load, poor SEO without workarounds.\nWhen: Dashboards, SPAs, authenticated apps.\n\nHybrid: Next.js supports both — SSR per page or static generation.",
  sql: "SELECT e1.salary FROM employees e1\nWHERE 1 = (\n  SELECT COUNT(DISTINCT e2.salary)\n  FROM employees e2\n  WHERE e2.salary > e1.salary\n);\n\nAlternative with DENSE_RANK():\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) ranked WHERE rnk = 2;\n\nEdge case: Return NULL if fewer than 2 distinct salaries exist.\nWrap in: SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
  hr: "Present: 'I'm a final-year B.Tech CSE student at [College], passionate about full-stack development and AI.\n\nPast: Over the last 2 years I've built 3 full-stack projects using React and FastAPI, including a placement assistant platform with JWT auth, PostgreSQL, and AI resume analysis. I also completed an internship at [Company] where I reduced API response time by 40% through Redis caching.\n\nFuture: I'm looking for a software engineering role where I can work on impactful products, grow in system design, and contribute to a collaborative engineering culture — which is exactly what drew me to [Company].'",
  cs: "A process is an independent program in execution with its own memory space (code, stack, heap, data).\nA thread is a lightweight unit within a process — threads of the same process share memory.\n\nKey differences:\n• Memory: Processes are isolated; threads share the same heap.\n• Creation: Creating a process is expensive; threads are cheaper.\n• Communication: Processes use IPC (pipes, sockets); threads share variables directly.\n• Failure isolation: A crashed process doesn't affect others; a crashed thread can crash the whole process.\n\nContext switching: The OS saves CPU registers and process state (PCB) before switching. Thread switching is faster because no page table swap is needed.\n\nPractical: Web servers use threads (or coroutines) for concurrent requests; browser tabs are separate processes for isolation.",
  python: "A decorator is a function that wraps another function to add behaviour without modifying the original.\n\nExample:\ndef log_calls(func):\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__}')\n        result = func(*args, **kwargs)\n        print(f'Done {func.__name__}')\n        return result\n    return wrapper\n\n@log_calls\ndef add(a, b):\n    return a + b\n\nReal-world uses: @app.get('/') in FastAPI, @property, @staticmethod, @cache (functools.lru_cache), authentication middleware in Flask/Django.",
  backend: "Authentication: Verifying identity — who are you? (username + password → JWT).\nAuthorisation: Verifying permissions — what can you do? (admin vs regular user).\n\nJWT Flow:\n1. User logs in → server verifies credentials → issues JWT signed with SECRET_KEY.\n2. JWT contains: header (algorithm), payload (user_id, exp), signature.\n3. Client stores JWT in localStorage or httpOnly cookie.\n4. On each request: client sends 'Authorization: Bearer <token>'.\n5. Server decodes token, verifies signature, checks expiry, extracts user_id.\n\nCommon mistakes: Storing sensitive data in JWT payload (it's base64-encoded, not encrypted), no expiry on tokens, not invalidating tokens on logout.",
  aptitude: "Speed = Distance / Time = 60 km / (45/60 hr) = 60 / 0.75 = 80 km/h.\n\nStep by step:\n- Time = 45 minutes = 45/60 hours = 0.75 hours\n- Speed = 60 km ÷ 0.75 h = 80 km/h\n\nVerification: 80 km/h × 0.75 h = 60 km ✓",
  projects: "Structure your answer using the STAR format adapted for projects:\n\nSituation: 'I built an AI Career Assistant platform to help students with placement preparation.'\nTask: 'I was responsible for the entire full-stack development — React frontend, FastAPI backend, PostgreSQL database, and AI integration.'\nAction: 'I designed the database schema (users, profiles, resumes), implemented JWT authentication, built 11 sidebar pages with React Router, integrated Ollama for resume analysis and chat, and deployed everything with Docker.'\nResult: 'The platform processes PDF/DOCX resumes, gives AI-powered feedback, tracks job applications in a Kanban board, and has a 4-week prep plan — all persisted to PostgreSQL.'\n\nAlways quantify: 'Reduced resume analysis response time from 4s to 1.2s by pre-extracting text on upload.'",
};

/* ═══════════════════════════════════════
   VOICE INPUT HOOK
═══════════════════════════════════════ */
function useVoiceInput(onTranscript) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous      = true;
      recognition.interimResults  = true;
      recognition.lang            = "en-IN";
      recognition.maxAlternatives = 1;

      recognition.onresult = (e) => {
        let interim = "", final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t + " ";
          else interim += t;
        }
        onTranscript(final, interim);
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setListening(false);
      };
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const start = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };
  const stop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { listening, supported, start, stop };
}

/* ═══════════════════════════════════════
   SPEAKING TIPS (shown during voice mode)
═══════════════════════════════════════ */
const SPEAKING_TIPS = [
  "🎙️ Speak clearly and at a moderate pace.",
  "📌 Structure your answer: define → explain → example → conclude.",
  "⏱️ Aim for 1–2 minutes per answer — not too short, not too long.",
  "💡 Start with the key point, then elaborate — don't bury the answer.",
  "🔢 Use numbers and metrics wherever possible.",
  "🤝 Say 'In my project…' or 'For example…' to ground abstract answers.",
];

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function MockInterview() {
  const [selected,     setSelected]    = useState(null);
  const [qIndex,       setQIndex]      = useState(0);
  const [answer,       setAnswer]      = useState("");
  const [interimText,  setInterimText] = useState("");
  const [inputMode,    setInputMode]   = useState("type"); // "type" | "voice"
  const [submitted,    setSubmitted]   = useState(false);
  const [score,        setScore]       = useState(null);
  const [showModel,    setShowModel]   = useState(false);
  const [showSugg,     setShowSugg]    = useState(true);
  const [history,      setHistory]     = useState([]);
  const [showHistory,  setShowHistory] = useState(false);
  const textareaRef = useRef(null);

  const handleTranscript = (finalText, interimText) => {
    if (finalText) setAnswer(prev => prev + finalText);
    setInterimText(interimText);
  };

  const { listening, supported, start, stop } = useVoiceInput(handleTranscript);

  const cat       = CATEGORIES.find(c => c.id === selected);
  const questions = selected ? QUESTION_BANK[selected] : [];
  const question  = questions[qIndex] || "";
  const suggestions = selected ? ANSWER_SUGGESTIONS[selected] || [] : [];
  const modelAnswer = selected ? MODEL_ANSWERS[selected] : null;

  const start_cat = (id) => {
    setSelected(id); setQIndex(0); setAnswer(""); setInterimText("");
    setSubmitted(false); setScore(null); setShowModel(false); setShowSugg(true);
    if (listening) stop();
  };

  const submit = () => {
    const combined = (answer + " " + interimText).trim();
    if (combined.length < 20) return;
    if (listening) stop();
    const wordCount = combined.trim().split(/\s+/).length;
    const fakeScore = Math.min(100, Math.max(40,
      50 + Math.floor(wordCount / 3)
      + (combined.toLowerCase().includes("example") || combined.toLowerCase().includes("e.g.") ? 10 : 0)
      + (combined.toLowerCase().includes("time complexity") || combined.toLowerCase().includes("o(") ? 10 : 0)
      + (combined.toLowerCase().includes("trade") || combined.toLowerCase().includes("alternative") ? 8 : 0)
      + (wordCount >= 80 ? 5 : 0)
    ));
    setScore(fakeScore);
    setSubmitted(true);
    setInterimText("");
    setHistory(prev => [
      { q: question, a: combined, score: fakeScore, cat: cat?.title, mode: inputMode },
      ...prev,
    ].slice(0, 30));
  };

  const next = () => {
    const nextIdx = (qIndex + 1) % questions.length;
    setQIndex(nextIdx); setAnswer(""); setInterimText("");
    setSubmitted(false); setScore(null); setShowModel(false); setShowSugg(true);
    if (listening) stop();
  };

  const retry = () => {
    setAnswer(""); setInterimText("");
    setSubmitted(false); setScore(null); setShowModel(false);
    if (listening) stop();
  };

  const toggleVoice = () => {
    if (!supported) return;
    if (listening) { stop(); setInputMode("type"); }
    else           { start(); setInputMode("voice"); }
  };

  const totalQ = CATEGORIES.reduce((a,c) => a + QUESTION_BANK[c.id].length, 0);
  const scoreColor = score >= 80 ? "#15803d" : score >= 60 ? "#b45309" : "#b91c1c";
  const scoreBg    = score >= 80 ? "#f0fdf4"  : score >= 60 ? "#fffbeb"  : "#fef2f2";
  const combinedAnswer = answer + (interimText ? `[…${interimText}]` : "");
  const wordCount = combinedAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <p className="page-shell__eyebrow">MOCK INTERVIEW</p>
        <h1 className="page-shell__title">Mock Interview Practice</h1>
        <p className="page-shell__sub">
          {totalQ} questions across {CATEGORIES.length} categories.
          Type <strong>or speak</strong> your answer — get instant feedback with suggestions.
        </p>
      </div>

      {/* history toggle */}
      {history.length > 0 && (
        <button className="mi-history-toggle" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "▲ Hide" : "▼ Show"} Practice History ({history.length})
        </button>
      )}
      {showHistory && (
        <div className="page-card mi-history">
          <h3 className="mi-history__title">Practice History</h3>
          <div className="mi-history__list">
            {history.map((h, i) => (
              <div key={i} className="mi-history__row">
                <span className="mi-history__cat">{h.cat}</span>
                <span className="mi-history__mode">{h.mode === "voice" ? "🎙️" : "⌨️"}</span>
                <span className="mi-history__q">{h.q.slice(0, 70)}…</span>
                <span className="mi-history__score"
                  style={{ color: h.score>=80?"#15803d":h.score>=60?"#b45309":"#b91c1c" }}>
                  {h.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORY GRID ── */}
      {!selected && (
        <div className="mi-categories">
          {CATEGORIES.map(cat => (
            <div className="mi-cat-card" key={cat.id} onClick={() => start_cat(cat.id)}
              style={{ "--cat-color": cat.color }}>
              <div className="mi-cat-card__icon"
                style={{ background:`${cat.color}18`, border:`1px solid ${cat.color}33` }}>
                {cat.icon}
              </div>
              <div className="mi-cat-card__body">
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <div className="mi-cat-card__meta">
                  <span>🎯 {QUESTION_BANK[cat.id].length} questions</span>
                  <span className="mi-difficulty">{cat.difficulty}</span>
                </div>
              </div>
              <span className="mi-cat-card__arrow" style={{ color: cat.color }}>→</span>
            </div>
          ))}
        </div>
      )}

      {/* ── PRACTICE VIEW ── */}
      {selected && (
        <div className="page-card mi-practice">

          {/* header */}
          <div className="mi-practice__header">
            <button className="mi-back" onClick={() => { setSelected(null); if (listening) stop(); }}>
              ← Back
            </button>
            <div className="mi-practice__meta">
              <span style={{ color: cat.color }}>{cat.icon} {cat.title}</span>
              <span className="mi-qnum">Q {qIndex + 1}/{questions.length}</span>
            </div>
            <button className="mi-next-btn" onClick={next}>Next →</button>
          </div>

          {/* progress dots */}
          <div className="mi-progress-dots">
            {questions.map((_, i) => (
              <div key={i}
                className={`mi-dot${i===qIndex?" mi-dot--active":""}`}
                onClick={() => { setQIndex(i); setAnswer(""); setInterimText(""); setSubmitted(false); setScore(null); setShowModel(false); }} />
            ))}
          </div>

          {/* question */}
          <div className="mi-question">
            <p className="mi-question__label">QUESTION {qIndex + 1}</p>
            <p className="mi-question__text">{question}</p>
          </div>

          {!submitted ? (
            <>
              {/* ── INPUT MODE TOGGLE ── */}
              <div className="mi-input-mode-bar">
                <button
                  className={`mi-mode-btn${inputMode==="type"?" active":""}`}
                  onClick={() => { setInputMode("type"); if (listening) stop(); }}>
                  ⌨️ Type Answer
                </button>
                <button
                  className={`mi-mode-btn${inputMode==="voice"?" active":""}`}
                  onClick={() => setInputMode("voice")}
                  disabled={!supported}>
                  🎙️ Voice Answer
                  {!supported && <span className="mi-mode-unsupported"> (not supported)</span>}
                </button>
              </div>

              {/* ── SUGGESTIONS PANEL ── */}
              {showSugg && suggestions.length > 0 && (
                <div className="mi-suggestions-panel">
                  <div className="mi-suggestions-panel__head">
                    <p className="mi-suggestions-panel__title">💡 How to structure your answer</p>
                    <button className="mi-suggestions-panel__close" onClick={() => setShowSugg(false)}>×</button>
                  </div>
                  <div className="mi-suggestions-list">
                    {suggestions.map((s,i) => (
                      <div key={i} className="mi-suggestion-item">
                        <span className="mi-suggestion-item__num">{i+1}</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!showSugg && (
                <button className="mi-show-sugg" onClick={() => setShowSugg(true)}>
                  💡 Show answer tips
                </button>
              )}

              {/* ── TYPE MODE ── */}
              {inputMode === "type" && (
                <>
                  <label className="mi-answer-label">Your Answer</label>
                  <textarea
                    ref={textareaRef}
                    className="mi-answer"
                    rows={8}
                    placeholder="Type your answer here. Be specific — use examples, mention edge cases, and structure your response clearly."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                </>
              )}

              {/* ── VOICE MODE ── */}
              {inputMode === "voice" && (
                <div className="mi-voice-panel">
                  <div className="mi-voice-controls">
                    <button
                      className={`mi-voice-btn${listening?" mi-voice-btn--active":""}`}
                      onClick={toggleVoice}
                    >
                      {listening ? (
                        <>
                          <span className="mi-voice-pulse" />
                          Stop Recording
                        </>
                      ) : (
                        <>🎙️ Start Speaking</>
                      )}
                    </button>
                    {(answer || interimText) && (
                      <button className="mi-voice-clear"
                        onClick={() => { setAnswer(""); setInterimText(""); }}>
                        ✕ Clear
                      </button>
                    )}
                  </div>

                  {/* live transcript display */}
                  <div className={`mi-transcript${listening?" mi-transcript--listening":""}`}>
                    {!answer && !interimText ? (
                      <p className="mi-transcript__placeholder">
                        {listening ? "Listening… speak your answer now" : "Press 'Start Speaking' and answer out loud"}
                      </p>
                    ) : (
                      <p>
                        <span className="mi-transcript__final">{answer}</span>
                        {interimText && <span className="mi-transcript__interim">{interimText}</span>}
                      </p>
                    )}
                  </div>

                  {/* speaking tips */}
                  <div className="mi-speaking-tips">
                    <p className="mi-speaking-tips__title">🎤 Speaking Tips</p>
                    <div className="mi-speaking-tips__list">
                      {SPEAKING_TIPS.map((t,i) => (
                        <span key={i} className="mi-speaking-tip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ACTIONS ── */}
              <div className="mi-actions">
                <span className="mi-char">{wordCount} words</span>
                <div className="mi-actions__right">
                  {modelAnswer && (
                    <button className="mi-model-toggle" onClick={() => setShowModel(!showModel)}>
                      {showModel ? "▲ Hide" : "📖 Model Answer"}
                    </button>
                  )}
                  <button className="page-btn page-btn--primary" onClick={submit}
                    disabled={(answer + interimText).trim().length < 20}>
                    Submit Answer
                  </button>
                </div>
              </div>

              {/* ── MODEL ANSWER ── */}
              {showModel && modelAnswer && (
                <div className="mi-model-answer">
                  <p className="mi-model-answer__title">📖 Model Answer (Q1 of this category)</p>
                  <pre className="mi-model-answer__text">{modelAnswer}</pre>
                </div>
              )}
            </>
          ) : (
            /* ── FEEDBACK ── */
            <div className="mi-feedback">
              <div className="mi-feedback__score"
                style={{ background: scoreBg, border:`1px solid ${scoreColor}22`, color: scoreColor }}>
                <div className="mi-score-ring">
                  <svg viewBox="0 0 80 80" width="80" height="80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke={`${scoreColor}22`} strokeWidth="8" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor}
                      strokeWidth="8" strokeDasharray={`${(score/100)*201} 201`}
                      strokeLinecap="round" transform="rotate(-90 40 40)" />
                  </svg>
                  <span>{score}</span>
                </div>
                <div>
                  <p className="mi-feedback__title">
                    {score >= 80 ? "Excellent! 🎉" : score >= 60 ? "Good Answer 👍" : "Needs Improvement ⚠️"}
                  </p>
                  <p className="mi-feedback__mode">
                    Input: {inputMode === "voice" ? "🎙️ Voice" : "⌨️ Typed"} · {wordCount} words
                  </p>
                  <p className="mi-feedback__hint">
                    {score >= 80 ? "Strong, structured answer. Keep practising to stay consistent." :
                     score >= 60 ? "Good attempt! More specific examples and metrics would push this higher." :
                     "Try the STAR method. Be specific — name technologies, give numbers, explain trade-offs."}
                  </p>
                </div>
              </div>

              {/* your answer */}
              <div className="mi-feedback__answer">
                <p className="mi-feedback__answer-label">Your Answer:</p>
                <p className="mi-feedback__answer-text">{answer}</p>
              </div>

              {/* suggestions for improvement */}
              <div className="mi-feedback__sugg-panel">
                <p className="mi-feedback__sugg-title">💡 How to improve this answer</p>
                {suggestions.map((s,i) => (
                  <div key={i} className="mi-suggestion-item mi-suggestion-item--feedback">
                    <span className="mi-suggestion-item__num">{i+1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {/* model answer */}
              {modelAnswer && (
                <div className="mi-model-answer">
                  <p className="mi-model-answer__title">📖 Model Answer (Q1 of this category)</p>
                  <pre className="mi-model-answer__text">{modelAnswer}</pre>
                </div>
              )}

              <div className="mi-feedback__actions">
                <button className="page-btn page-btn--ghost" onClick={retry}>↺ Try Again</button>
                <button className="page-btn page-btn--primary" onClick={next}>Next Question →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
