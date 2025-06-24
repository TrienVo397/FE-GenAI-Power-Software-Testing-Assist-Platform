import React from "react";

const CheckBox = ({ id, name, checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="Checkbox"
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