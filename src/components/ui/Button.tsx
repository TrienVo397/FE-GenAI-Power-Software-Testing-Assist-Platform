import React, { ButtonHTMLAttributes, ReactNode, ElementType } from "react";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "warning"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Left-sided icon component */
  icon?: ElementType;
  /** Button label (rendered if provided) */
  label?: string;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Should the button take full width? */
  fullWidth?: boolean;
  /** Size of the button */
  size?: ButtonSize;
  /** Additional CSS classes to apply */
  className?: string;
  /** Button disabled state */
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  label,
  variant = "default",
  fullWidth = false,
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles: Record<ButtonVariant, string> = {
    default: "bg-[#24416d] text-white hover:bg-[#1e325a]",
    secondary: "bg-gray-200 text-black border border-gray-300 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-400 text-black hover:bg-yellow-500",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md text-sm",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10 justify-center",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const styles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={styles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      <span>{label || children}</span>
    </button>
  );
};

export default Button;
