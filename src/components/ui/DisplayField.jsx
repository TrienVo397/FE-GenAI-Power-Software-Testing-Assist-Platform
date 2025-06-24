import React from "react";

const DisplayField = ({
  id,
  label,
  value,
}) => {
  return (
    <div className="space-y-1">
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
