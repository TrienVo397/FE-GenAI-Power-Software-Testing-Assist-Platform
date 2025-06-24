import React from "react";

/**
 * Reusable tab in-page component.
 * @param {Array} tabs - List of tab objects with `label` and `value`.
 * @param {string} activeTab - Currently selected tab value.
 * @param {function} onTabChange - Callback when a tab is selected.
 */
const Tab = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`pb-3 text-base font-medium transition-all duration-200 ${
              isActive
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black hover:border-b-2 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;
