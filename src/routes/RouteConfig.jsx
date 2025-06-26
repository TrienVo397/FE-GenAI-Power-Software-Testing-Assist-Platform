// filepath: c:\Users\dorem\Documents\GitHub\FE-GenAI-Power-Software-Testing-Assist-Platform\src\routes\RouteConfig.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/authService";
import _ from "lodash";

import AppLayout from "../components/layouts/AppLayout.jsx";
import HomePage from "../pages/HomePage";
import NewTestPage from "../pages/NewTestPage";
import AllTestsPage from "../pages/AllTestsPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import FileExplorerPage from "../pages/FileExplorerPage.jsx";

const RouteConfig = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  
  // Handle both string ID and JSON object formats for backward compatibility
  const initializeSelectedProject = () => {
    const storedProject = localStorage.getItem("mockProject");
    if (!storedProject) return null;
    
    // Use lodash's attempt to safely try parsing JSON
    const parsed = _.attempt(JSON.parse, storedProject);
    
    // If parsing succeeded and it's an object with an id property, use that
    if (!_.isError(parsed) && _.has(parsed, 'id')) {
      return parsed.id;
    }
    
    // Otherwise, return the original string or the parsed value
    return _.isError(parsed) ? storedProject : parsed;
  };
  
  const [selectedProject, setSelectedProject] = useState(initializeSelectedProject());
  const navigate = useNavigate();

  // Keep auth state in sync
  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
      setSelectedProject(initializeSelectedProject());
    };

    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 300);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);
  
  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setSelectedProject(null);
    navigate("/login");
  };  // Handle project selection - extract ID from project data
  const handleProjectSelect = (project) => {
    console.log("Project selected:", project); // Debug log
    
    // Get project ID directly from the localStorage
    const storedProjectId = localStorage.getItem("mockProject");
    console.log("Project ID from localStorage:", storedProjectId);
    
    // Update the selected project state
    setSelectedProject(storedProjectId);
    
    // Redirect to homepage/dashboard after selection
    console.log("Navigating to homepage");
    navigate("/");
  };

  return (
    <Routes>
      {/* 🔐 NOT AUTHENTICATED */}
      {!authenticated ? (
        <>
          <Route path="/login" element={<LoginPage onLogin={() => setAuthenticated(true)} />} />
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
                element={<ProjectsPage onProjectSelect={handleProjectSelect} />}
              />
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </>
          ) : (
            <>
              {/* ✅ PROJECT SELECTED */}              <Route element={<AppLayout onLogout={handleLogout} />}>
                <Route index element={<HomePage />} />
                <Route path="/files" element={<FileExplorerPage />} />
                <Route path="/files/:projectId" element={<FileExplorerPage />} />
                <Route path="dashboard" element={<HomePage />} />
                <Route path="new-test" element={<NewTestPage />} />
                <Route path="all-tests" element={<AllTestsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 👈 Allow visiting /projects again even after selecting */}
              <Route
                path="/projects"
                element={<ProjectsPage onProjectSelect={handleProjectSelect} />}
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
