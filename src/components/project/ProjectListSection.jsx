import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import ProjectDialog from "./ProjectDialog";
import ProjectTable from "./ProjectTable";

const ProjectListSection = forwardRef(({ onProjectSelect }, ref) => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    addProject: (project) => {
      setProjects((prev) => [project, ...prev]);
    },
  }));

  useEffect(() => {
    // TODO: Replace with API call
    const mockProjects = [
      { id: 1, name: "GenAI Test Assist" },
      { id: 2, name: "QA Dashboard" },
      { id: 3, name: "ML Dataset Validator" },
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreate = async (project) => {
    // TODO: Create via API
    setProjects((prev) => [{ id: Date.now(), ...project }, ...prev]);
    setIsDialogOpen(false);
  };

  const handleEdit = (project) => {
    setEditing(project);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (updates) => {
    // TODO: Update via API
    setProjects((prev) =>
      prev.map((p) => (p.id === editing.id ? { ...p, ...updates } : p))
    );
    setEditing(null);
    setIsDialogOpen(false);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project “${project.name}”?`)) return;
    // TODO: Delete via API
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const handleSelect = (project) => {
    localStorage.setItem("mockProject", JSON.stringify(project));  // Set project to localStorage
    onProjectSelect?.();  // Notify parent
    navigate("/");  // Redirect to home
  };

  return (
    <>
      <ProjectTable
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect} // use local handler with navigate
      />

      {isDialogOpen && (
        <ProjectDialog
          open={true}
          initialProject={editing || {}}
          onSave={editing ? handleUpdate : handleCreate}
          onClose={() => {
            setIsDialogOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
});

ProjectListSection.displayName = "ProjectListSection";
export default ProjectListSection;
