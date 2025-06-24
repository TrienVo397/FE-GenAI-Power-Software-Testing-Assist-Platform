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

const ProjectsPage = ({ onProjectSelect }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sectionRef = useRef();

  const handleCreate = async (projectData) => {
    // TODO: Replace with API call
    const newProject = { id: Date.now(), ...projectData };
    sectionRef.current?.addProject(newProject);
    setIsDialogOpen(false);
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
        <ProjectListSection ref={sectionRef} onProjectSelect={onProjectSelect} />
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
