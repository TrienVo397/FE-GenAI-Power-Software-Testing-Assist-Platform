import React from "react";
import Select, { MultiValue, Options } from "react-select";

interface OptionType {
  label: string;
  value: string | number;
}

interface MultiSelectFieldProps {
  id: string;
  label: string;
  value: (string | number)[];
  onChange: (selectedIds: (string | number)[]) => void;
  options: Options<OptionType>;
  error?: string;
  placeholder?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  id,
  label,
  value = [],
  onChange,
  options = [],
  error,
  placeholder = "Select stations...",
}) => {
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleChange = (selected: MultiValue<OptionType>) => {
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

