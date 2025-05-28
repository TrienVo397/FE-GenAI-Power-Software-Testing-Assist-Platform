import React from "react";

export default function RadioButton({ id, label, checked, onSelect }) {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          id={id}
          type="radio"
          name="passengerType"
          checked={checked}
          onChange={onSelect}
          className="opacity-0 absolute inset-0 h-full w-full cursor-pointer"
        />
        <div
          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            checked ? "border-blue-600" : "border-gray-300"
          }`}
        >
          {checked && <div className="h-2 w-2 rounded-full bg-blue-500" />}
        </div>
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
};