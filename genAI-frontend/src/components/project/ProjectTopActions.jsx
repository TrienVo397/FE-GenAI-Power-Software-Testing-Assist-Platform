import Button from "../ui/Button";
import { CirclePlus } from "lucide-react";

const ProjectTopActions = ({ onAddClick }) => {
  return (
    <div className="flex gap-2">
      <Button icon={CirclePlus} onClick={onAddClick}>
        Add Project
      </Button>
    </div>
  );
};

export default ProjectTopActions;
