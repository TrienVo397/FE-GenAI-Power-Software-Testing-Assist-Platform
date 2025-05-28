import FormContainer from '../ui/FormContainer';

const NewTestForm = ({ onFormSubmit }) => {
  const formSchema = {
    testName: {
      label: "Test Name",
      type: "text",
      required: true,
      validate: (val) => (!val ? "Test name is required." : null),
    },
    testDescription: {
      label: "Description",
      type: "text",
      required: true,
      validate: (val) => (!val ? "Description is required." : null),
    },
    testFile: {
      label: "Upload Document",
      type: "upload",
      maxSizeMB: 5,
      required: true,
      validate: (file) => {
        if (!file) return "Please upload a file.";
        // if (!file.name.toLowerCase().endsWith('.pdf')) return "Only PDF files are supported.";
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
