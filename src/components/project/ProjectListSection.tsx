import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ProjectDialog from "./ProjectDialog";
import ProjectTable from "./ProjectTable";
import {
  getProjects,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import _ from "lodash";

// Define the shape of a Project
export type Project = {
  id: string;
  name: string;
  meta_data?: string;
  note?: string;
  current_version?: string;
};

type ProjectListSectionProps = {
  onProjectSelect?: (project: Project) => void;
};

export type ProjectListSectionRef = {
  addProject: (project: Project) => void;
};

const ProjectListSection = forwardRef<ProjectListSectionRef, ProjectListSectionProps>(
  ({ onProjectSelect }, ref) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useImperativeHandle(ref, () => ({
      addProject: (project: Project) => {
        setProjects((prev) => [project, ...prev]);
      },
    }));

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchProjects();
    }, []);

    const handleCreate = async () => {
      setIsDialogOpen(false);
    };

    const handleEdit = (project: Project) => {
      setEditing(project);
      setIsDialogOpen(true);
    };

    const handleUpdate = async (updates: Partial<Project>) => {
      if (!editing?.id) return;

      try {
        const updated = await updateProject(editing.id, updates);
        setProjects((prev) =>
          prev.map((p) => (p.id === editing.id ? updated : p))
        );
      } catch (error) {
        console.error("Failed to update project:", error);
        alert("Failed to update project. Please try again.");
      } finally {
        setEditing(null);
        setIsDialogOpen(false);
      }
    };

    const handleDelete = async (project: Project) => {
      if (!window.confirm(`Delete project "${project.name}"?`)) return;
      try {
        await deleteProject(project.id);
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
      }
    };

    const handleSelect = (project: Project) => {
      onProjectSelect?.(project);
    };

    return (
      <>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        )}

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
  }
);

ProjectListSection.displayName = "ProjectListSection";
export default ProjectListSection;
