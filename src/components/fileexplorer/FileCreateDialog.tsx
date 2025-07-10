// filepath: src/components/fileexplorer/FileCreateDialog.jsx
import React, { useState } from 'react';
import SimpleDialog from './SimpleDialog';
import InputField from '../ui/InputField';
import _ from 'lodash';

type FileCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, currentPath: string) => void;
  title: string;
  isFolder?: boolean;
  currentPath?: string;
};

const FileCreateDialog: React.FC<FileCreateDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  isFolder = false,
  currentPath = '',
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (_.isEmpty(name)) {
      setError('Name cannot be empty');
      return;
    }

    const invalidChars = /[\\/:*?"<>|]/;
    if (invalidChars.test(name)) {
      setError('Name contains invalid characters');
      return;
    }

    setError('');
    onConfirm(name, currentPath);
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
      confirmLabel={isFolder ? 'Create Folder' : 'Create File'}
    >
      <div className="w-full">
        <InputField
          label={isFolder ? 'Folder Name' : 'File Name'}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder={isFolder ? 'Enter folder name' : 'Enter file name'}
          error={error}
          autoFocus
        />
        {currentPath && (
          <div className="mt-2 text-sm text-gray-500">
            Will be created in: <span className="italic">{currentPath}</span>
          </div>
        )}
      </div>
    </SimpleDialog>
  );
};

export default FileCreateDialog;
