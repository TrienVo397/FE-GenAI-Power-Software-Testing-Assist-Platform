import React, { ReactNode, HTMLAttributes } from 'react';

export interface DisplayFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for the field container and label association */
  id: string;
  /** Label text displayed above the value */
  label: string;
  /** Value or content to display (read-only) */
  value: ReactNode;
}

export const DisplayField: React.FC<DisplayFieldProps> = ({
  id,
  label,
  value,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        id={id}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 bg-gray-100"
      >
        {value}
      </div>
    </div>
  );
};

export default DisplayField;
