import FormContainer from "../ui/FormContainer";

const NewTestForm = ({ onFormSubmit }) => {
  const formSchema = {
    testName: {
      label: "Test Name",
      type: "text",
      required: true,
      validate: (val) => {
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
      validate: (val) => {
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
      validate: (file) => {
        if (!file) return "Please upload a file.";
        return null;
      },
    },
  };

  return (
    <FormContainer
      // title="Get Started"
      formSchema={formSchema}
      onSubmit={onFormSubmit}
    />
  );
};

export default NewTestForm;
