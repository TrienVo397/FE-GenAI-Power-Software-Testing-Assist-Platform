import FormContainer from "../ui/FormContainer";
import CheckBox from "../ui/CheckBox";

const SignUpForm = ({ onSubmit, isLoading }) => {
  const formSchema = {
    firstName: {
      label: "First Name",
      type: "text",
      required: true,
      validate: (val) => {
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
      validate: (val) => {
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
      validate: (val) => {
        if (!val) return "Username is required.";
        if (/\s/.test(val)) return "Username must not contain spaces.";
        return null;
      },
    },
    email: {
      label: "Email Address",
      type: "email",
      required: true,
      validate: (val) => {
        if (!val) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val)
          ? null
          : "Please enter a valid email address.";
      },
    },
    password: {
      label: "Password",
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
      label: "Confirm Password",
      type: "password",
      required: true,
      validate: (val, all) =>
        !val
          ? "Please confirm your password."
          : val !== all.password
          ? "Passwords do not match."
          : null,
    },
    agree: {
      label: "I agree to the Terms & Conditions",
      type: "checkbox",
      defaultValue: false,
      validate: (val) => (!val ? "You must agree to continue." : null),
    },
  };

  return (
    <FormContainer
      title=""
      formSchema={formSchema}
      initialFormData={{
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      }}
      onSubmit={onSubmit}
      submitLabel="Sign Up"
      isSubmitting={isLoading}
      renderFieldOverride={{
        agree: (key, cfg, form, setForm) => (
          <CheckBox
            id={key}
            name={key}
            label={cfg.label}
            checked={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
          />
        ),
      }}
    />
  );
};

export default SignUpForm;
