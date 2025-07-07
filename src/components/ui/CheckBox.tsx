import React from "react";

export interface CheckBoxProps {
  /** Unique identifier for the checkbox input and its label */
  id: string;
  /** Name attribute for form submission */
  name: string;
  /** Controlled checked state */
  checked: boolean;
  /** Change handler for checkbox state */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  /** Label text displayed next to the checkbox */
  label: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-muted-foreground">
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
