// filepath: src/components/login/GoogleLoginButton.jsx
import Button from "../ui/Button";
import { FEATURES } from "@@/configs/EnvConfig";

const GoogleLoginButton: React.FC = () => {
  // Hide button if Google login is disabled in environment
  if (!FEATURES.googleLogin) {
    return null;
  }

  return (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
      <span className="flex items-center gap-2">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />
        <span>Continue with Google</span>
      </span>
    </Button>
  );
};

export default GoogleLoginButton;
