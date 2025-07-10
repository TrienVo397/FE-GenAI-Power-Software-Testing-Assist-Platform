import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { ChevronDown, Search } from "lucide-react";
import clsx from "clsx";
import _ from "lodash";

type SelectItem = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  id?: string;
  label?: string;
  items?: SelectItem[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  filterable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  isInvalid?: boolean;
  helperText?: string;
  disabled?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  items = [],
  value,
  onChange,
  placeholder = "Select…",
  filterable = false,
  searchPlaceholder = "Search…",
  className = "",
  isInvalid = false,
  helperText = "",
  disabled = false,
}) => {
  const [query, setQuery] = useState("");

  const filtered = filterable
    ? _.filter(items, (item) =>
        _.includes(_.toLower(item.label), _.toLower(query))
      )
    : items;

  const selectedItem = _.find(items, (item) => item.value === value);
  const selectedLabel = selectedItem ? selectedItem.label : placeholder;

  return (
    <div className="relative overflow-visible space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            id={id}
            disabled={disabled}
            className={clsx(
              "mt-1 w-full rounded-md border px-3 py-2 text-left text-sm flex justify-between items-center focus:outline-none focus:ring-2",
              isInvalid
                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                : disabled
                ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-800 focus:ring-blue-200 focus:border-blue-500",
              className
            )}
          >
            <span>{selectedLabel}</span>
            <ChevronDown className={clsx("h-4 w-4", disabled ? "text-gray-400" : "text-gray-500")} />
          </button>
        </DropdownMenuTrigger>

        {!disabled && (
          <DropdownMenuContent className="absolute z-50 mt-1 w-full max-h-80 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
            {filterable && (
              <div className="relative px-3 py-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:border-blue-300"
                />
              </div>
            )}

            <div className="max-h-60 overflow-auto">
              {filtered.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => {
                    onChange(item.value);
                    setQuery("");
                  }}
                  className={clsx(
                    value === item.value && "bg-[#1e325a] text-white"
                  )}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
              {!filtered.length && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results
                </div>
              )}
            </div>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      {isInvalid && helperText && (
        <p className="mt-1 text-sm text-red-500">{helperText}</p>
      )}
    </div>
  );
};

export default SelectField;
