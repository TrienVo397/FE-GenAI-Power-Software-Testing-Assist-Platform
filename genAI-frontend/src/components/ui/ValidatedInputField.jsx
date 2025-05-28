import React from "react";

const ValidatedInputField = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  isInvalid = false,
  helperText = "",
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full rounded-md px-3 py-2 text-sm placeholder-gray-400
          focus:outline-none focus:ring-2 
          ${isInvalid
            ? "border border-red-500 focus:ring-red-200 focus:border-red-500"
            : "border border-gray-300 focus:ring-blue-200 focus:border-blue-500"}
        `}
      />
      {isInvalid && helperText && (
        <p className="text-sm text-red-600">❌ {helperText}</p>
      )}
    </div>
  );
};

export default ValidatedInputField;
