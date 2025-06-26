// filepath: src/components/fileexplorer/FileItem.jsx
import React from 'react';
import _ from 'lodash';

// File icons based on extension
const getFileIcon = (fileName) => {
  const extension = _.toLower(_.last(fileName.split('.')));
  
  // Map of file extensions to material icons
  const iconMap = {
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
  
  // Return the appropriate icon or default
  return iconMap[extension] || '📄 file';
};

const FileItem = ({ item, onSelect, isSelected, onContextMenu }) => {
  const icon = item.type === 'directory' ? '📁 folder' : getFileIcon(item.name);
  
  return (
    <div 
      className={`flex items-center p-2 cursor-pointer rounded hover:bg-gray-100 ${isSelected ? 'bg-blue-100' : ''}`}
      onClick={() => onSelect(item)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, item);
      }}
    >
      <div className="mr-2">{icon}</div>
      <div className="flex-grow truncate">{item.name}</div>
      {item.type !== 'directory' && (
        <div className="text-xs text-gray-500">
          {_.get(item, 'size') ? _.parseInt(item.size).toLocaleString() + ' B' : ''}
        </div>
      )}
    </div>
  );
};

export default FileItem;
