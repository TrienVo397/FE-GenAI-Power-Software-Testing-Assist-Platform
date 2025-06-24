import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

export const DropdownMenuContext = createContext(null);

export function DropdownMenu({ children, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative text-left" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export function DropdownMenuTrigger({ asChild = false, children, ...props }) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const toggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    props.onClick?.(e);
  };

  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      "aria-expanded": isOpen,
      "data-state": isOpen ? "open" : "closed",
      onClick: toggle,
      ...props,
    });
  }

  return (
    <button
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      onClick={toggle}
      {...props}
    >
      {children}
    </button>
  );
};

export function DropdownMenuContent({
  children,
  align = "start",
  className = "",
  ...props
}) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`z-50 mt-2 w-full rounded-md border bg-white shadow-md ${
        align === "end" ? "origin-top-right right-0" : "origin-top-left left-0"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export function DropdownMenuItem({
  children,
  onClick,
  className = "",
  ...props
}) {
  const { setIsOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    setIsOpen(false);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};