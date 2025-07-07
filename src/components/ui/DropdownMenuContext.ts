// filepath: src/components/ui/DropdownMenuContext.ts
import { createContext } from 'react';

/**
 * Context type for DropdownMenu.
 */
export interface DropdownMenuContextType {
  /** Is the dropdown open? */
  isOpen: boolean;
  /** Function to set the open state */
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Default context value: dropdown closed, no-op setter
 */
const defaultContext: DropdownMenuContextType = {
  isOpen: false,
  setIsOpen: () => {},
};

/**
 * Provides open/close state for dropdown menu
 */
const DropdownMenuContext = createContext<DropdownMenuContextType>(defaultContext);

export default DropdownMenuContext;
