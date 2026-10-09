import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout      from "./components/AppLayout";

/* public pages */
import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Register       from "./pages/Register";

/* protected pages */
import Dashboard      from "./pages/Dashboard";
import Profile        from "./pages/Profile";
import Resume         from "./pages/Resume";
import Jobs           from "./pages/Jobs";
import Applications   from "./pages/Applications";
import SkillGap       from "./pages/SkillGap";
import Preparation    from "./pages/Preparation";
import MockInterview  from "./pages/MockInterview";
import AIAssistant    from "./pages/AIAssistant";
import Notifications  from "./pages/Notifications";
import Settings       from "./pages/Settings";

/**
 * ProtectedRoute — wraps children in AppLayout (sidebar shell).
 * Unauthenticated users are redirected to /login.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

/**
 * PublicOnlyRoute — redirects logged-in users to /dashboard.
 */
function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<Home />} />

        <Route path="/login"    element={<PublicOnlyRoute><Login    /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* ── Protected ── */}
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard     /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><Profile       /></ProtectedRoute>} />
        <Route path="/resume"         element={<ProtectedRoute><Resume        /></ProtectedRoute>} />
        <Route path="/jobs"           element={<ProtectedRoute><Jobs          /></ProtectedRoute>} />
        <Route path="/applications"   element={<ProtectedRoute><Applications  /></ProtectedRoute>} />
        <Route path="/skill-gap"      element={<ProtectedRoute><SkillGap      /></ProtectedRoute>} />
        <Route path="/preparation"    element={<ProtectedRoute><Preparation   /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
        <Route path="/ai-assistant"   element={<ProtectedRoute><AIAssistant   /></ProtectedRoute>} />
        <Route path="/notifications"  element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings"       element={<ProtectedRoute><Settings      /></ProtectedRoute>} />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
