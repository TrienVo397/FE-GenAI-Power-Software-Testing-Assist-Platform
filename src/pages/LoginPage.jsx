import { useNavigate } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";
import GoogleLoginButton from "../components/login/GoogleLoginButton";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    console.log("Login payload:", data);
    // TODO: Replace with actual login API
    localStorage.setItem("mockUser", JSON.stringify({ email: data.email }));
    if (onLogin) onLogin();
    navigate("/projects");
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center text-[#2b416a] mb-8">
        Welcome back!
      </h1>

      <LoginForm onSubmit={handleSubmit} />

      <div className="flex items-center justify-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <GoogleLoginButton />

      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
