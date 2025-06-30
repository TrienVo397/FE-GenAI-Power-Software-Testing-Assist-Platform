import { useState, useEffect } from "react";
import FormDialog from "../ui/FormDialog";
import { getDocumentVersionsByProject } from "../../services/documentVersionService";
import _ from "lodash";

const ProjectDialog = ({ open, initialProject = {}, onSave, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  
  // Fetch document versions when editing an existing project
  useEffect(() => {
    const fetchVersions = async () => {
      if (initialProject.id) {
        setIsLoadingVersions(true);
        try {
          const versionsList = await getDocumentVersionsByProject(initialProject.id);
          setVersions(versionsList);
        } catch (error) {
          console.error("Failed to load document versions:", error);
        } finally {
          setIsLoadingVersions(false);
        }
      }
    };
    
    fetchVersions();
  }, [initialProject.id]);
  
  const schema = {
    name: {
      label: "Project Name",
      validate: (v) => (!v || v.length < 3 ? "Project name must be at least 3 characters" : null),
      defaultValue: "",
    },
    meta_data: {
      label: "Project Metadata",
      type: "text",
      defaultValue: "",
    },
    note: {
      label: "Project Notes",
      type: "textarea",
      defaultValue: "",
    }
  };

  const handleSubmit = async (formData) => {
    // Create a clean copy of the form data with only the allowed fields
    const allowedFields = ["name", "current_version", "meta_data", "note"];
    const data = _.pick(formData, allowedFields);
    
    // Preserve the ID if we're editing an existing project
    if (initialProject.id) {
      data.id = initialProject.id;
    }
    
    // Add updated_by field (this would normally come from the authentication context)
    // This is just a placeholder - in a real app, get this from auth context
    data.updated_by = localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000";
    
    // Clean up empty values
    _.forEach(data, (value, key) => {
      if (_.isEmpty(value) && value !== false && value !== 0) {
        data[key] = null;
      }
    });
    
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
