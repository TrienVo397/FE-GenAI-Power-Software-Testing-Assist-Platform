import React from "react";

export interface TabItem {
  label: string;
  value: string;
}

interface TabProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Tab: React.FC<TabProps> = ({ tabs, activeTab, onTabChange }) => {
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
