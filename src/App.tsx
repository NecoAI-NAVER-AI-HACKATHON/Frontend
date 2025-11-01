import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspaces from "./pages/workspaces/Workspaces";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* First page (Landing Page) */}
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/workspaces" element={<Workspaces />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
