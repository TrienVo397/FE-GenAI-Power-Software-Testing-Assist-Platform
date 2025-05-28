import FormContainer from "../ui/FormContainer";
import CheckBox from "../ui/CheckBox";

const SignUpForm = ({ onSubmit }) => {
  const formSchema = {
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
    email: {
      label: "Email Address",
      type: "email",
      required: true,
      validate: (val) => (!val ? "Email is required." : null),
    },
    password: {
      label: "Password",
      type: "password",
      required: true,
      validate: (val) =>
        !val
          ? "Password is required."
          : val.length < 6
          ? "Password must be at least 6 characters."
          : null,
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
