import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/signup/SignUpForm";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log("Sign up data:", formData);
    // Call API, then redirect
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-[#2b416a] mb-8">
        Get Started Now
      </h2>

      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SignUpPage;
