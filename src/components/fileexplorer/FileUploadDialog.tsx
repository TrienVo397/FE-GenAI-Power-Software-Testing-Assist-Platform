// filepath: src/components/fileexplorer/FileUploadDialog.jsx
import React, { useState, useRef, ChangeEvent } from 'react';
import SimpleDialog from './SimpleDialog';
import _ from 'lodash';

type FileUploadDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (files: File[], currentPath: string) => void;
  currentPath?: string;
};

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onConfirm,
  currentPath = ''
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError('');
    }
  };

  const handleConfirm = () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    onConfirm(files, currentPath);
    clearAndClose();
  };

  const clearAndClose = () => {
    setFiles([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <SimpleDialog
      open={open}
      onClose={clearAndClose}
      title="Upload Files"
      onConfirm={handleConfirm}
      confirmLabel="Upload"
    >
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {error && <div className="text-red-500 mt-2">{error}</div>}

        {files.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Selected files:</div>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
              {_.map(files, (file, index) => (
                <div key={index} className="text-sm py-1">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPath && (
          <div className="mt-4 text-sm text-gray-500">
            Destination: <span className="italic">{currentPath}</span>
          </div>
        )}
      </div>
    </SimpleDialog>
  );
};

export default FileUploadDialog;
