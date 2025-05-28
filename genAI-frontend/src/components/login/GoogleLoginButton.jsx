import Button from "../ui/Button";

const GoogleLoginButton = () => (
  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
      className="h-5 w-5"
    />
    Continue with Google
  </Button>
);

export default GoogleLoginButton;
