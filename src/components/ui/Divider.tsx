import React from 'react';

export interface DividerProps {
  /** Optional text to display in the center of the divider */
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  if (!text) {
    return <div className="my-4 border-t border-gray-300" />;
  }

  return (
    <div className="relative my-4">
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300" />
        <span className="mx-2 bg-white px-2 text-sm text-gray-500">{text}</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>
    </div>
  );
};

export default Divider;
