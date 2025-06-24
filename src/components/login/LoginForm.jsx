import FormContainer from "../ui/FormContainer";
import CheckBox from "../ui/CheckBox";

const LoginForm = ({ onSubmit }) => {
  const formSchema = {
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
      validate: (val) => (!val ? "Password is required." : null),
    },
    remember: {
      label: "Remember Me",
      type: "checkbox",
      defaultValue: false,
    },
  };

  return (
    <FormContainer
      formSchema={formSchema}
      initialFormData={{ email: "", password: "", remember: false }}
      onSubmit={onSubmit}
      submitLabel="Login"
      renderFieldOverride={{
        remember: (key, cfg, form, setForm) => (
          <CheckBox
            id={key}
            name={key}
            label={cfg.label}
            checked={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
          />
        ),
      }}
      extraButtons={
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      }
    />
  );
};

export default LoginForm;
