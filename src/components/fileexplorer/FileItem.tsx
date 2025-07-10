// filepath: src/components/fileexplorer/FileItem.jsx
import React from 'react';
import _ from 'lodash';

type FileItemType = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number | string;
  [key: string]: any;
};

type FileItemProps = {
  item: FileItemType;
  onSelect: (item: FileItemType) => void;
  isSelected: boolean;
  onContextMenu: (event: React.MouseEvent, item: FileItemType) => void;
};

// File icons based on extension
const getFileIcon = (fileName: string): string => {
  const extension = _.toLower(_.last(fileName.split('.')) || '');

  const iconMap: Record<string, string> = {
    // Code files
    js: '📄 code',
    jsx: '📄 code',
    ts: '📄 code',
    tsx: '📄 code',
    py: '📄 code',
    java: '📄 code',
    html: '📄 code',
    css: '📄 code',
    php: '📄 code',

    // Text files
    txt: '📝 text',
    md: '📝 text',
    json: '📝 text',
    yaml: '📝 text',
    yml: '📝 text',

    // Documents
    pdf: '📕 doc',
    doc: '📘 doc',
    docx: '📘 doc',
    xls: '📗 doc',
    xlsx: '📗 doc',
    ppt: '📙 doc',
    pptx: '📙 doc',

    // Images
    jpg: '🖼️ image',
    jpeg: '🖼️ image',
    png: '🖼️ image',
    gif: '🖼️ image',
    svg: '🖼️ image',

    // Archives
    zip: '📦 archive',
    rar: '📦 archive',
    tar: '📦 archive',
    gz: '📦 archive',
  };

  return iconMap[extension] || '📄 file';
};

const FileItem: React.FC<FileItemProps> = ({
  item,
  onSelect,
  isSelected,
  onContextMenu
}) => {
  const icon = item.type === 'directory' ? '📁 folder' : getFileIcon(item.name);
  const fileSize = _.get(item, 'size');

  return (
    <div
      className={`flex items-center p-2 cursor-pointer rounded hover:bg-gray-100 ${isSelected ? 'bg-blue-100' : ''}`}
      onClick={() => onSelect(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <div className="mr-2">{icon}</div>
      <div className="flex-grow truncate">{item.name}</div>
      {item.type !== 'directory' && fileSize && (
        <div className="text-xs text-gray-500">
          {parseInt(fileSize.toString()).toLocaleString()} B
        </div>
      )}
    </div>
  );
};

export default FileItem;
