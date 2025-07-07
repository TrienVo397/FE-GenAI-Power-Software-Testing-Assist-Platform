import React, { FC, ReactNode } from "react";
import { clsx } from "clsx";
import { Funnel } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  /** Label displayed before the dropdown */
  label?: string;
  /** Icon displayed alongside the label */
  icon?: ReactNode;
  /** List of filter options */
  options: FilterOption[];
  /** Current selected value */
  value: string;
  /** Change handler called with new value */
  onChange: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export const FilterDropdown: FC<FilterDropdownProps> = ({
  label = "Filter by:",
  icon = <Funnel className="w-4 h-4 mr-1 text-gray-400" />,
  options = [],
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={clsx("flex items-center gap-2 text-sm text-gray-600", className)}>
      <div className="flex items-center font-medium">
        {icon}
        {label}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm text-gray-800"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
