// filepath: src/components/fileexplorer/FileEditorDialog.jsx
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button, LoadingButton } from '../ui';

type FileEditorDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (content: string, description: string) => void;
  file?: {
    name: string;
    path: string;
  };
  content?: string;
  loading?: boolean;
};

const FileEditorDialog: React.FC<FileEditorDialogProps> = ({
  open,
  onClose,
  onSave,
  file,
  content = '',
  loading = false,
}) => {
  const [editedContent, setEditedContent] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedContent(content);
    setHasChanges(false);
  }, [content]);

  useEffect(() => {
    setHasChanges(editedContent !== content);
  }, [editedContent, content]);

  const handleSave = () => {
    if (onSave && hasChanges) {
      onSave(editedContent, description);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getFileLanguage = (filename: string): string => {
    const extension = _.toLower(_.last(filename.split('.')));
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      txt: 'text',
    };
    return languageMap[extension ?? ''] || 'text';
  };

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Edit File: {file.name}</h2>
            <p className="text-sm text-gray-600">
              {file.path} • {getFileLanguage(file.name)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-orange-600">Unsaved changes</span>
            )}
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          <textarea
            value={editedContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditedContent(e.target.value)
            }
            className="flex-1 w-full p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
            placeholder="File content..."
          />
        </div>

        {/* Description field */}
        <div className="px-4 pb-2 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your changes..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">
            Lines: {editedContent.split('\n').length} • Characters: {editedContent.length}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            {loading ? (
              <LoadingButton
                isLoading={true}
                loadingText="Saving..."
                variant="default"
                disabled={true}
              >
                Saving...
              </LoadingButton>
            ) : (
              <Button onClick={handleSave} disabled={!hasChanges} variant="default">
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEditorDialog;
