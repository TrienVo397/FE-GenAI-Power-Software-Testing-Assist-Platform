import FormContainer from "../ui/FormContainer";
import Button from "../ui/Button";

const profileSchema = {
  firstName: {
    label: "First Name",
    type: "text",
    required: true,
    validate: (val) => (!val ? "First name is required." : null),
  },
  lastName: {
    label: "Last Name",
    type: "text",
    required: true,
    validate: (val) => (!val ? "Last name is required." : null),
  },
  username: {
    label: "Username",
    type: "text",
    required: true,
    validate: (val) => (!val ? "Username is required." : null),
  },
};

const ProfileForm = ({ initialData, onSubmit, onChangePassword }) => {
  return (
    <FormContainer
      title="Profile Details"
      formSchema={profileSchema}
      initialFormData={initialData}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      extraButtons={
        <Button
          type="button"
          variant="secondary"
          onClick={onChangePassword}
        >
          Change Password
        </Button>
      }
    />
  );
};

export default ProfileForm;
