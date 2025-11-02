import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspaces from "./pages/workspaces/Workspaces";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import WorkspaceDetail from "./pages/workspaces/WorkspaceDetail";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* First page (Landing Page) */}
        <Route path="/" element={<Login />} />

        {/* Each page all has sidebar (setup in Layout) */}
        <Route element={<Layout />}>
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspace/:id" element={<WorkspaceDetail />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
