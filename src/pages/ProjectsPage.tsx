import { useRef, useState } from "react";
import ProjectListSection, { ProjectListSectionRef } from "../components/project/ProjectListSection";
import ProjectDialog from "../components/project/ProjectDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import ProjectTopActions from "../components/project/ProjectTopActions";
import { createProject } from "../services/projectService";
import _ from "lodash";

// -------------------------
// Type Definitions
// -------------------------

interface Project {
  id: string;
  name: string;
  current_version_label?: string;
  [key: string]: any;
}

interface ProjectInfo {
  id: string;
  name: string;
  version: string;
}

interface ProjectsPageProps {
  onProjectSelect?: (projectInfo: ProjectInfo) => void;
}

// -------------------------
// Component
// -------------------------

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onProjectSelect }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const sectionRef = useRef<ProjectListSectionRef>(null);

  const handleCreate = async (projectData: any) => {
    try {
      const newProject: Project = await createProject(projectData);
      sectionRef.current?.addProject(newProject);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  return (
    <Card className="max-w-[60%] mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Management</CardTitle>
          <ProjectTopActions onAddClick={() => setIsDialogOpen(true)} />
        </div>
      </CardHeader>

      <CardContent>
        <ProjectListSection
          ref={sectionRef}
          onProjectSelect={(project: Project) => {
            console.log("Project selected in ProjectsPage:", project);

            const projectId = _.get(project, "id", "");
            const projectInfo: ProjectInfo = {
              id: projectId,
              name: _.get(project, "name", "Unnamed Project"),
              version: _.get(project, "current_version_label", "v0"),
            };

            localStorage.setItem("projectInfo", JSON.stringify(projectInfo));
            console.log("Set localStorage projectInfo to:", projectInfo);

            _.delay(() => {
              console.log("Navigating to homepage from ProjectsPage");
              window.location.href = "/";
            }, 50);

            if (onProjectSelect) {
              onProjectSelect(projectInfo);
            }
          }}
        />
      </CardContent>

      {isDialogOpen && (
        <ProjectDialog
          open={true}
          initialProject={{}}
          onSave={handleCreate}
          onClose={() => setIsDialogOpen(false)}
        />
      )}

      <CardFooter children={undefined} />
    </Card>
  );
};

export default ProjectsPage;
