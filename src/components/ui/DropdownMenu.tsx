// filepath: src/components/ui/DropdownMenu.tsx
import React, {
  ReactNode,
  ReactElement,
  MouseEvent,
  useState,
  useRef,
  useEffect,
  useId,
  HTMLAttributes,
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  useCallback,
} from 'react';
import DropdownMenuContext, { DropdownMenuContextType } from './DropdownMenuContext';

/**
 * Root dropdown wrapper, provides open/close state via context.
 */
export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative text-left" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

/**
 * Trigger for the dropdown: button or custom child.
 */
export interface DropdownMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  disabled?: boolean;
  children: ReactNode;
  [key: string]: any; // allow custom data-* and aria-* props
}
export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  asChild = false,
  children,
  disabled = false,
  onClick,
  ...props
}) => {
  const { isOpen, setIsOpen } = React.useContext<DropdownMenuContextType>(DropdownMenuContext);
  const triggerId = useId();

  const toggle = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsOpen(prev => !prev);
    onClick?.(e as any);
  }, [disabled, onClick, setIsOpen]);

  if (asChild) {
    const child = Children.only(children) as ReactElement;
    return cloneElement(child, {
      ...props,
      onClick: toggle,
      disabled,
      id: triggerId,
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
    });
  }

  return (
    <button
      type="button"
      {...props}
      onClick={toggle}
      disabled={disabled}
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
};

/**
 * Content panel for the dropdown; closes on outside click or ESC key.
 */
export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'end';
}
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  className = '',
  ...props
}) => {
  const { isOpen, setIsOpen } = React.useContext<DropdownMenuContextType>(DropdownMenuContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown as EventListener);
    return () => document.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      ref={ref}
      className={`z-50 mt-2 w-full rounded-md border bg-white shadow-md ${
        align === 'end' ? 'origin-top-right right-0' : 'origin-top-left left-0'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * An interactive item in the dropdown; closes menu on click.
 */
export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className = '',
  ...props
}) => {
  const { setIsOpen } = React.useContext<DropdownMenuContextType>(DropdownMenuContext);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsOpen(false);
    onClick?.(e);
  };

  return (
    <button
      role="menuitem"
      type="button"
      onClick={handleClick}
      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default DropdownMenu;
