import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspaces from "./pages/workspaces/Workspaces";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./components/layout/Layout";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import WorkspaceDetail from "./pages/workspaces/WorkspaceDetail";
import Workflow from "./pages/workflow/Workflow";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* First page (Landing Page) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Each page all has sidebar (setup in Layout) */}
        <Route element={<Layout />}>
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
        </Route>
        
        {/* Workflow page (standalone, no Layout) */}
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/workflow/:id" element={<Workflow />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
