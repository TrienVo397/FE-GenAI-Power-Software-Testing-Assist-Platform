// filepath: src/components/fileexplorer/FileCreateDialog.jsx
import React, { useState } from 'react';
import SimpleDialog from './SimpleDialog';
import InputField from '../ui/InputField';
import _ from 'lodash';

const FileCreateDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  isFolder = false,
  currentPath = ''
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const handleConfirm = () => {
    // Basic validation
    if (_.isEmpty(name)) {
      setError('Name cannot be empty');
      return;
    }
    
    // Check for invalid characters in filename
    const invalidChars = /[\\/:*?"<>|]/;
    if (invalidChars.test(name)) {
      setError('Name contains invalid characters');
      return;
    }
    
    // Clear error and submit
    setError('');
    onConfirm(name, currentPath);
    
    // Reset and close
    setName('');
    onClose();
  };
  return (
    <SimpleDialog
      open={open}
      onClose={() => {
        setName('');
        setError('');
        onClose();
      }}
      title={title}
      onConfirm={handleConfirm}
      confirmLabel={isFolder ? "Create Folder" : "Create File"}
    >
      <div className="w-full">
        <InputField
          label={isFolder ? "Folder Name" : "File Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isFolder ? "Enter folder name" : "Enter file name"}
          error={error}
          autoFocus
        />
        {currentPath && (
          <div className="mt-2 text-sm text-gray-500">
            Will be created in: <span className="italic">{currentPath}</span>
          </div>        )}
      </div>
    </SimpleDialog>
  );
};

export default FileCreateDialog;
