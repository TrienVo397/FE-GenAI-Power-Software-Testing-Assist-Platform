import { useNavigate } from "react-router-dom";

const mockProjects = [
  { id: 1, name: "GenAI Test Assist" },
  { id: 2, name: "QA Dashboard" },
  { id: 3, name: "ML Dataset Validator" },
];

const ProjectsPage = ({ onProjectSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (project) => {
    // TODO: Replace with actual API selection in future
    localStorage.setItem("mockProject", JSON.stringify(project));
    if (onProjectSelect) onProjectSelect();
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#2b416a]">Select a Project</h2>
      <ul className="space-y-4">
        {mockProjects.map((project) => (
          <li
            key={project.id}
            className="border p-4 rounded-md shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelect(project)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
