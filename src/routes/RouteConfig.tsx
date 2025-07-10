// filepath: c:\Users\dorem\Documents\GitHub\FE-GenAI-Power-Software-Testing-Assist-Platform\src\routes\RouteConfig.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/authService";
import _ from "lodash";

import AppLayout from "../components/layouts/AppLayout";
import HomePage from "../pages/HomePage";
import NewTestPage from "../pages/NewTestPage";
import AllTestsPage from "../pages/AllTestsPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import ProjectsPage from "../pages/ProjectsPage";
import FileExplorerPage from "../pages/FileExplorerPage";
import ProjectSettingsPage from "../pages/ProjectSettingsPage";
import ProjectArtifactsPage from "../pages/ProjectArtifactsPage";

// -------------------------
// Types
// -------------------------

interface ProjectInfo {
  id: string;
  name?: string;
  version?: string;
}

// -------------------------
// Component
// -------------------------

const RouteConfig: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());

  const initializeSelectedProject = (): ProjectInfo | null => {
    const storedProject = localStorage.getItem("projectInfo");
    if (!storedProject) return null;

    const parsed = _.attempt(() => JSON.parse(storedProject));
    if (!_.isError(parsed) && _.has(parsed, "id")) {
      return parsed as ProjectInfo;
    }

    return _.isError(parsed)
      ? { id: storedProject }
      : { id: parsed as string }; // fallback for string-only format
  };

  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(
    initializeSelectedProject()
  );
  const navigate = useNavigate();

  // Sync authentication state
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
  };

  const handleProjectSelect = (project: ProjectInfo) => {
    console.log("Project selected:", project);
    setSelectedProject(project);
    navigate("/");
  };

  return (
    <Routes>
      {!authenticated ? (
        <>
          <Route path="/login" element={<LoginPage onLogin={() => setAuthenticated(true)} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : !selectedProject ? (
        <>
          <Route
            path="/projects"
            element={<ProjectsPage onProjectSelect={handleProjectSelect} />}
          />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </>
      ) : (
        <>
          <Route
            element={<AppLayout onLogout={handleLogout} projectInfo={selectedProject} />}
          >
            <Route index element={<HomePage />} />
            <Route path="/files" element={<FileExplorerPage />} />
            <Route path="/files/:projectId" element={<FileExplorerPage />} />
            <Route path="dashboard" element={<HomePage />} />
            <Route path="new-test" element={<NewTestPage />} />
            <Route path="all-tests" element={<AllTestsPage />} />
            <Route path="project-settings" element={<ProjectSettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
            <Route path="artifacts" element={<ProjectArtifactsPage />} />
            <Route path="artifacts/:projectId" element={<ProjectArtifactsPage />} />
          </Route>

          <Route
            path="/projects"
            element={<ProjectsPage onProjectSelect={handleProjectSelect} />}
          />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default RouteConfig;
