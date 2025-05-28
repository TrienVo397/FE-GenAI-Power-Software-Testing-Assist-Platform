import React from "react";
import Select from "react-select";

const MultiSelectField = ({
  id,
  label,
  value = [],
  onChange,
  options = [],
  error,
  placeholder = "Select stations...",
}) => {
  // Convert value array of IDs to react-select format
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleChange = (selected) => {
    const selectedIds = selected.map((item) => item.value);
    onChange(selectedIds);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select
        id={id}
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="react-select"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelectField;
