import { useState, useEffect } from "react";
import FormDialog from "../ui/FormDialog";
import { getDocumentVersionsByProject } from "../../services/documentVersionService";
import _ from "lodash";

type Project = {
  id?: string;
  name?: string;
  meta_data?: string;
  note?: string;
  current_version?: string;
};

type ProjectDialogProps = {
  open: boolean;
  initialProject?: Project;
  onSave: (data: Project) => Promise<void>;
  onClose: () => void;
};

const ProjectDialog = ({
  open,
  initialProject = {},
  onSave,
  onClose,
}: ProjectDialogProps) => {
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

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
      validate: (v: string) =>
        !v || v.length < 3 ? "Project name must be at least 3 characters" : null,
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
    },
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    const allowedFields = ["name", "current_version", "meta_data", "note"];
    const data: Project = _.pick(formData, allowedFields);

    if (initialProject.id) {
      data.id = initialProject.id;
    }

    data.updated_by =
      localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000";

    _.forEach(data, (value, key) => {
      if (_.isEmpty(value) && value !== false && value !== 0) {
        (data as any)[key] = null;
      }
    });

    await onSave(data);
  };

  if (!open) return null;

  return (
    <FormDialog
      title={initialProject.id ? "Edit Project" : "Create Project"}
      formSchema={schema}
      initialFormData={initialProject}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

export default ProjectDialog;
