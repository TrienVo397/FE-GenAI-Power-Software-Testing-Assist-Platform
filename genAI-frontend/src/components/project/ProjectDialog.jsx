import FormDialog from "../ui/FormDialog";

const ProjectDialog = ({ open, initialProject = {}, onSave, onClose }) => {
  const schema = {
    name: {
      label: "Project Name",
      validate: (v) => (!v || v.length < 3 ? "Project name must be at least 3 characters" : null),
      defaultValue: "",
    },
  };

  const handleSubmit = async (formData) => {
    const data = { ...formData };
    if (initialProject.id) data.id = initialProject.id;
    await onSave(data);
  };

  return (
    open && (
      <FormDialog
        title={initialProject.id ? "Edit Project" : "Create Project"}
        formSchema={schema}
        initialFormData={initialProject}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    )
  );
};

export default ProjectDialog;
