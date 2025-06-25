import FormContainer from "../ui/FormContainer";
import CheckBox from "../ui/CheckBox";

const LoginForm = ({ onSubmit, isLoading }) => {
  const formSchema = {
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
      initialFormData={{ username: "", password: "", remember: false }}
      onSubmit={onSubmit}
      submitLabel="Login"
      isSubmitting={isLoading}
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
