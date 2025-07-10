// filepath: src/components/fileexplorer/FileContextMenu.jsx
import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

type Action = {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any) => void;
};

type Position = {
  x: number;
  y: number;
};

type FileContextMenuProps = {
  visible: boolean;
  position: Position;
  onClose: () => void;
  actions: Action[];
  item: any;
};

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  visible,
  position,
  onClose,
  actions,
  item,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded shadow-lg z-50 min-w-[180px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="py-1">
        {_.map(actions, (action, index) => (
          <div
            key={index}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => {
              action.onClick(item);
              onClose();
            }}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileContextMenu;
