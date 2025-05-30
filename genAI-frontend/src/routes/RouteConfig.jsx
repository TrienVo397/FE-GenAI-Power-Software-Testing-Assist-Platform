import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout.jsx";
import HomePage from "../pages/HomePage";
import NewTestPage from "../pages/NewTestPage";
import AllTestsPage from "../pages/AllTestsPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";

const RouteConfig = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("mockUser"));
  const [selectedProject, setSelectedProject] = useState(localStorage.getItem("mockProject"));

  // Listen for localStorage changes from login/project selection/logout
  useEffect(() => {
    const syncState = () => {
      setIsAuthenticated(!!localStorage.getItem("mockUser"));
      setSelectedProject(localStorage.getItem("mockProject"));
    };

    window.addEventListener("storage", syncState);
    return () => window.removeEventListener("storage", syncState);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAuthenticated(!!localStorage.getItem("mockUser"));
      setSelectedProject(localStorage.getItem("mockProject"));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : !selectedProject ? (
        <>
          <Route
            path="/projects"
            element={<ProjectsPage onProjectSelect={() => setSelectedProject(localStorage.getItem("mockProject"))} />}
          />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </>
      ) : (
        <>
          <Route element={<AppLayout onLogout={() => {
            localStorage.removeItem("mockUser");
            localStorage.removeItem("mockProject");
            setIsAuthenticated(false);
            setSelectedProject(null);
          }} />}>
            <Route index element={<HomePage />} />
            <Route path="new-test" element={<NewTestPage />} />
            <Route path="all-tests" element={<AllTestsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/login" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default RouteConfig;
