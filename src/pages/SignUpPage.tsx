import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignUpForm from "../components/signup/SignUpForm";
import { register } from "../services/authService";

// -------------------------
// Type Definitions
// -------------------------

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  status: number;
  error?: boolean;
  message?: string;
  [key: string]: any; // allow other optional fields like token, userId etc.
}

// -------------------------
// Component
// -------------------------

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (formData: SignUpFormData) => {
    setIsLoading(true);
    setSignupError("");

    try {
      const response: RegisterResponse = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (response.error || response.status !== 201) {
        setSignupError(response.message || "Registration failed. Please try again.");
        return;
      }

      // Redirect to login on success
      navigate("/login", {
        state: {
          message: "Registration successful! Please login with your new account.",
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-[#2b416a] mb-8">
        Get Started Now
      </h2>

      {signupError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          {signupError}
        </div>
      )}

      <SignUpForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default SignUpPage;
