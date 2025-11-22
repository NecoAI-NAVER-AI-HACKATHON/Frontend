import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Workspaces from "./pages/workspaces/Workspaces";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./components/layout/Layout";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import WorkspaceDetail from "./pages/workspaces/WorkspaceDetail";
import WorkflowPage from "./pages/workflow/Workflow";
import LandingPage from "./pages/landing/LandingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/settings/Settings";
import { WorkflowsProvider } from "./contexts/WorkflowsContext";
import { WorkspacesProvider } from "./contexts/WorkspacesContext";
import { SystemsProvider } from "./contexts/SystemsContext";
import { UserProvider } from "./contexts/UserContext";

import "./index.css";

function App() {
  return (
    <UserProvider>
    <WorkspacesProvider>
      <SystemsProvider>
        <WorkflowsProvider>
          <Router>
        <Routes>
        {/* First page (Landing Page) */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication pages */}
        {/* Auth page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Each page all has sidebar (setup in Layout) */}
        <Route element={<Layout />}>
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Workflow page (standalone, no Layout) 
            Example: /workflow/wf-feedback-daily
            Or: /workspaces/:workspaceId/systems/:systemId/workflow */}
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/workflow/:id" element={<WorkflowPage />} />
        <Route path="/workspaces/:workspaceId/systems/:systemId/workflow" element={<WorkflowPage />} />

        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
            <Toaster position="top-right" richColors />
        </WorkflowsProvider>
      </SystemsProvider>
    </WorkspacesProvider>
    </UserProvider>
  );
}

export default App;
