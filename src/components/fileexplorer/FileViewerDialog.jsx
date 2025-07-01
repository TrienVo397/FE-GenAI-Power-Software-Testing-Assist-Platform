// filepath: src/components/fileexplorer/FileViewerDialog.jsx
import React, { useState, useEffect } from 'react';
import SimpleDialog from './SimpleDialog';
import _ from 'lodash';

// Determine if a file is text-based by extension
const isTextFile = (filename) => {
  const textExtensions = [
    'txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 
    'py', 'java', 'c', 'cpp', 'h', 'yml', 'yaml', 'xml', 'svg', 
    'sh', 'bat', 'ps1', 'ini', 'conf', 'log'
  ];
  
  const extension = _.toLower(_.last(filename.split('.')));
  return _.includes(textExtensions, extension);
};

// Determine if a file is an image by extension
const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const extension = _.toLower(_.last(filename.split('.')));
  return _.includes(imageExtensions, extension);
};

const FileViewerDialog = ({ 
  open, 
  onClose, 
  file,
  content,
  onEdit
}) => {
  const [viewMode, setViewMode] = useState('text'); // 'text', 'image', 'binary'
  
  useEffect(() => {
    if (!file) return;
    
    if (isImageFile(file.name)) {
      setViewMode('image');
    } else if (isTextFile(file.name)) {
      setViewMode('text');
    } else {
      setViewMode('binary');
    }
  }, [file]);
  
  // Determine if file is editable
  const isEditable = file && isTextFile(file.name) && ['md', 'yml', 'yaml', 'txt', 'json', 'csv', 'html', 'js', 'py', 'xml'].includes(_.toLower(_.last(file.name.split('.'))));

  if (!file) return null;
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title={`File: ${file.name}`}
      size="lg"
      confirmLabel={isEditable ? "Edit" : "Close"}
      onConfirm={isEditable && onEdit ? () => onEdit(file) : onClose}
      showCancel={isEditable}
      cancelLabel={isEditable ? "Close" : undefined}
      onCancel={isEditable ? onClose : undefined}
    >
      <div className="w-full">
        {viewMode === 'text' && (
          <div className="border border-gray-300 rounded bg-gray-50 p-4 max-h-96 overflow-y-auto font-mono text-sm">
            <pre>{content}</pre>
          </div>
        )}
        
        {viewMode === 'image' && content && (
          <div className="flex justify-center">
            <img 
              src={`data:image/${_.toLower(_.last(file.name.split('.')))};base64,${content}`} 
              alt={file.name}
              className="max-h-96 max-w-full"
            />
          </div>
        )}
        
        {viewMode === 'binary' && (
          <div className="text-center p-4">
            <div className="mb-2">Binary file - preview not available</div>
            <div className="text-sm text-gray-500">
              File size: {_.parseInt(file.size).toLocaleString()} bytes
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm">
          <div><strong>Type:</strong> {file.type}</div>
          <div><strong>Path:</strong> {file.path}</div>
          <div><strong>Size:</strong> {_.parseInt(file.size).toLocaleString()} bytes</div>
          <div><strong>Last modified:</strong> {new Date(file.last_modified).toLocaleString()}</div>        </div>
      </div>
    </SimpleDialog>
  );
};

export default FileViewerDialog;
