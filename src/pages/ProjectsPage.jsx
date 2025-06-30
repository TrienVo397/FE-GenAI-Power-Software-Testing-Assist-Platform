import { useRef, useState } from "react";
import ProjectListSection from "../components/project/ProjectListSection";
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

const ProjectsPage = ({ onProjectSelect }) => {  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sectionRef = useRef();
  
  // Handle project selection and navigation  // Empty line (removing the unused function)

  const handleCreate = async (projectData) => {
    try {
      const newProject = await createProject(projectData);
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
          onProjectSelect={(project) => {
            // Log project selection
            console.log("Project selected in ProjectsPage:", project);
            
            // Store project data including ID and version information
            const projectId = _.get(project, 'id', '');
            const projectInfo = {
              id: projectId,
              name: _.get(project, 'name', 'Unnamed Project'),
              version: _.get(project, 'current_version_label', 'v0')
            };
            
            localStorage.setItem("projectInfo", JSON.stringify(projectInfo));
            console.log("Set localStorage projectInfo to:", projectInfo);
            
            // Force navigation after a brief delay to ensure localStorage is set
            _.delay(() => {
              console.log("Navigating to homepage from ProjectsPage");
              window.location.href = "/"; // Use direct location change for harder redirect
            }, 50);
            
            // Also call parent handler for state updates
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

      <CardFooter />
    </Card>
  );
};

export default ProjectsPage;
