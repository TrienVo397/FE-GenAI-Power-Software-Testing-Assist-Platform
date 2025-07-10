import React from "react";
import FormContainer from "../ui/FormContainer";

type NewTestFormProps = {
  onFormSubmit: (formData: {
    testName: string;
    testDescription: string;
    testFile: File;
  }) => void | Promise<void>;
};

const NewTestForm: React.FC<NewTestFormProps> = ({ onFormSubmit }) => {
  const formSchema = {
    testName: {
      label: "Test Name",
      type: "text",
      required: true,
      validate: (val: string) => {
        if (!val) return "Test name is required.";
        if (val.length > 20)
          return "Test name must be 20 characters or fewer.";
        return null;
      },
    },
    testDescription: {
      label: "Description",
      type: "text",
      required: true,
      validate: (val: string) => {
        if (!val) return "Description is required.";
        if (val.length > 100)
          return "Description must be 100 characters or fewer.";
        return null;
      },
    },
    testFile: {
      label: "Upload Document",
      type: "upload",
      maxSizeMB: 5,
      required: true,
      validate: (file: File | null) => {
        if (!file) return "Please upload a file.";
        return null;
      },
    },
  };

  return (
    <FormContainer
      formSchema={formSchema}
      onSubmit={onFormSubmit}
    />
  );
};

export default NewTestForm;
