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
    validate: (val) => {
      if (!val) return "Password is required.";
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      return passwordRegex.test(val)
        ? null
        : "Password must be at least 8 characters and include letters, numbers, and symbols.";
    },
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
