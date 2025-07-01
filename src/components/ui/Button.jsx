import React from "react";

export function Button({
  children,
  icon: Icon, // left-sided icon
  label, // for icon + label button
  variant = "default",
  fullWidth = false,
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    default: "bg-[#24416d] text-white hover:bg-[#1e325a]",
    secondary: "bg-gray-200 text-black border border-gray-300 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-400 text-black hover:bg-yellow-500",
    // outline: "border border-input hover:bg-gray-100 hover:text-black",
    // ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md text-sm",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10 justify-center",
  };

  // handle full width btn
  const widthStyle = fullWidth ? "w-full" : "";

  const styles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(" "); // if widthStyle = false -> remove empty widthStyle

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
}

export default Button;
