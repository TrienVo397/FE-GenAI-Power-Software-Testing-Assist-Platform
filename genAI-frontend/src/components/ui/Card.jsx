
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`
        rounded-lg
        border border-gray-200
        bg-white
        text-gray-900
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export function CardTitle({ children, icon: Icon, className = "", ...props }) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-gray-500" />}
      {children}
    </h3>
  );
}


export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
};

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};