import { ReactNode, ElementType } from "react";
import Button, { ButtonProps } from "./Button";

interface LoadingButtonProps extends Omit<ButtonProps, "icon"> {
  isLoading: boolean;
  loadingText?: string;
  icon?: ElementType; // 👈 phải là component constructor
  label?: string;
  children?: ReactNode;
}
const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText = "Loading...",
  icon,
  label,
  children,
  ...props
}) => {
  const Spinner = (
    <div className="flex items-center justify-center space-x-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span>{loadingText}</span>
    </div>
  );

  return (
    <Button
      {...props}
      icon={isLoading ? undefined : icon}
      label={isLoading ? undefined : label}
    >
      {isLoading ? Spinner : children}
    </Button>
  );
};

export default LoadingButton;
