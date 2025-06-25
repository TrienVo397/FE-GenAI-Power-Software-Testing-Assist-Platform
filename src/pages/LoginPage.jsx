// filepath: src/pages/LoginPage.jsx
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import GoogleLoginButton from "../components/login/GoogleLoginButton";
import { login } from "../services/authService";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  const handleSubmit = async (data) => {
    setIsLoading(true);
    setLoginError("");

    try {
      // OAuth2 password flow credentials
      const credentials = {
        username: data.username,
        password: data.password,
      };      const response = await login(credentials);
        
      if (response.corsError) {
        // Special handling for CORS errors
        setLoginError(
          "Unable to connect to the authentication server due to CORS restrictions. " +
          "Please ensure the backend server is configured to accept requests from this application."
        );
        console.error("CORS error during login attempt - Backend server needs CORS configuration");
        return;
      }
        
      if (response.error || response.status !== 200) {
        // FastAPI OAuth2 errors usually come in the 'detail' field
        setLoginError(
          response.json?.detail || 
          response.message ||
          "Invalid username or password. Please try again."
        );
        return;
      }

      // Login successful
      if (onLogin) onLogin();
      navigate("/projects");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center text-[#2b416a] mb-8">
        Login to your account
      </h1>

      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          {loginError}
        </div>
      )}

      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="flex items-center justify-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <GoogleLoginButton />

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
