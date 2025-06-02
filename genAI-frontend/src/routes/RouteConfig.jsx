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

  // Keep state in sync with localStorage
  useEffect(() => {
    const syncState = () => {
      setIsAuthenticated(!!localStorage.getItem("mockUser"));
      setSelectedProject(localStorage.getItem("mockProject"));
    };

    window.addEventListener("storage", syncState);
    const interval = setInterval(syncState, 300);

    return () => {
      window.removeEventListener("storage", syncState);
      clearInterval(interval);
    };
  }, []);

  return (
    <Routes>
      {/* 🔐 NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* 📁 PROJECT NOT SELECTED */}
          {!selectedProject ? (
            <>
              <Route
                path="/projects"
                element={
                  <ProjectsPage
                    onProjectSelect={() => setSelectedProject(localStorage.getItem("mockProject"))}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </>
          ) : (
            <>
              {/* ✅ PROJECT SELECTED */}
              <Route
                element={
                  <AppLayout
                    onLogout={() => {
                      localStorage.removeItem("mockUser");
                      localStorage.removeItem("mockProject");
                      setIsAuthenticated(false);
                      setSelectedProject(null);
                    }}
                  />
                }
              >
                <Route index element={<HomePage />} />
                <Route path="new-test" element={<NewTestPage />} />
                <Route path="all-tests" element={<AllTestsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 👈 Allow visiting /projects again even after selecting */}
              <Route
                path="/projects"
                element={
                  <ProjectsPage
                    onProjectSelect={() => setSelectedProject(localStorage.getItem("mockProject"))}
                  />
                }
              />

              {/* Optional: redirect /login and /signup to homepage if already logged in */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
            </>
          )}
        </>
      )}
    </Routes>
  );
};

export default RouteConfig;
