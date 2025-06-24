import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { ChevronDown, Search } from "lucide-react";

export default function DropdownMenuWrapper({
  label,
  items,
  selected,
  onSelect,
  align = "start",
  className = "w-full",
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );
  const buttonText = selected
    ? items.find((i) => i.value === selected)?.label
    : `Select ${label.toLowerCase()}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex w-full justify-between px-3 py-2 border rounded-md bg-white ${className}`}
        >
          <span className="truncate">{buttonText}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="max-h-80 overflow-hidden">
        {/* Search input */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:border-blue-300"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => onSelect(item.value)}
                className={
                  item.value === selected ? "bg-[#2c4270] text-white" : ""
                }
              >
                {item.label}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">No results</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};