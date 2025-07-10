import React from "react";
import FormContainer from "../ui/FormContainer";
import Button from "../ui/Button";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
};

type ProfileFormProps = {
  initialData: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  onChangePassword: () => void;
};

const profileSchema = {
  firstName: {
    label: "First Name",
    type: "text",
    required: true,
    validate: (val: string) => {
      if (!val) return "First name is required.";
      const nameRegex = /^[A-Za-z\s'-]+$/;
      return nameRegex.test(val)
        ? null
        : "First name can only contain letters, spaces, dashes, and apostrophes.";
    },
  },
  lastName: {
    label: "Last Name",
    type: "text",
    required: true,
    validate: (val: string) => {
      if (!val) return "Last name is required.";
      const nameRegex = /^[A-Za-z\s'-]+$/;
      return nameRegex.test(val)
        ? null
        : "Last name can only contain letters, spaces, dashes, and apostrophes.";
    },
  },
  username: {
    label: "Username",
    type: "text",
    required: true,
    validate: (val: string) => {
      if (!val) return "Username is required.";
      if (/\s/.test(val)) return "Username must not contain spaces.";
      return null;
    },
  },
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onChangePassword,
}) => {
  return (
    <FormContainer
      title="Profile Details"
      formSchema={profileSchema}
      initialFormData={initialData}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      extraButtons={
        <Button type="button" variant="secondary" onClick={onChangePassword}>
          Change Password
        </Button>
      }
    />
  );
};

export default ProfileForm;
