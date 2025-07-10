import React from "react";
import FormContainer from "../ui/FormContainer";
import CheckBox from "../ui/CheckBox";

type LoginFormData = {
  username: string;
  password: string;
  remember: boolean;
};

type LoginFormProps = {
  onSubmit: (formData: LoginFormData) => void;
  isLoading: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const formSchema = {
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
    password: {
      label: "Password",
      type: "password",
      required: true,
      validate: (val: string) => (!val ? "Password is required." : null),
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
        remember: (
          key: string,
          cfg: { label: string },
          form: LoginFormData,
          setForm: (val: LoginFormData) => void
        ) => (
          <CheckBox
            id={key}
            name={key}
            label={cfg.label}
            checked={form[key as keyof LoginFormData] as boolean}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.checked })
            }
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
