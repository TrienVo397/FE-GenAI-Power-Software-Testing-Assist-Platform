import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { ChevronDown, Search } from "lucide-react";
import clsx from "clsx";

export default function SelectField({
  id,
  label,
  items = [],           // [{ value, label }]
  value,
  onChange,
  placeholder = "Select…",
  filterable = false,
  searchPlaceholder = "Search…",
  className = "",
  isInvalid = false,
  helperText = "",
}) {
  const [query, setQuery] = useState("");

  const filtered = filterable
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const selectedLabel =
    items.find((i) => i.value === value)?.label || placeholder;

  return (
    <div className="relative overflow-visible space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            className={clsx(
              "mt-1 w-full rounded-md border px-3 py-2 text-left text-sm text-gray-800 flex justify-between items-center focus:outline-none focus:ring-2",
              isInvalid
                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 bg-white focus:ring-blue-200 focus:border-blue-500",
              className
            )}
          >
            <span>{selectedLabel}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        {/* menu is absolutely positioned and can overflow */}
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
            {filtered.map((i) => (
              <DropdownMenuItem
                key={i.value}
                onClick={() => {
                  onChange(i.value);
                  setQuery("");
                }}
                className={clsx(
                  value === i.value && "bg-[#1e325a] text-white"
                )}
              >
                {i.label}
              </DropdownMenuItem>
            ))}
            {!filtered.length && (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {isInvalid && helperText && (
        <p className="mt-1 text-sm text-red-500">{helperText}</p>
      )}
    </div>
  );
}
