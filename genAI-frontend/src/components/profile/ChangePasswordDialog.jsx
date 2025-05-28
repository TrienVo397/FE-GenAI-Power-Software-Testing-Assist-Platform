import FormDialog from "../ui/FormDialog";

const passwordSchema = {
  currentPassword: {
    label: "Current Password",
    type: "password",
    required: true,
    validate: (val) => (!val ? "Enter your current password." : null),
  },
  newPassword: {
    label: "New Password",
    type: "password",
    required: true,
    validate: (val) =>
      !val
        ? "Enter a new password."
        : val.length < 6
        ? "Password must be at least 6 characters."
        : null,
  },
  confirmPassword: {
    label: "Confirm New Password",
    type: "password",
    required: true,
    validate: (val, all) =>
      !val
        ? "Confirm your new password."
        : val !== all.newPassword
        ? "Passwords do not match."
        : null,
  },
};

const ChangePasswordDialog = ({ onSubmit, onClose }) => {
  return (
    <FormDialog
      title="Change Password"
      formSchema={passwordSchema}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default ChangePasswordDialog;
