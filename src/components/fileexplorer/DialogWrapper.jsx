// filepath: src/components/fileexplorer/DialogWrapper.jsx
import React from 'react';
import FormDialog from '../ui/FormDialog';
import _ from 'lodash';

/**
 * A wrapper around FormDialog that makes it compatible with the FileExplorer dialogs
 * This adapts the existing FormDialog component to work with the open/close pattern
 * used in the file explorer components
 */
const DialogWrapper = ({
  open,
  onClose,
  title,
  onConfirm,
  confirmLabel = "Save",
  showCancel = true,
  // size prop is currently unused
  children
}) => {
  // If the dialog is not open, don't render anything
  if (!open) return null;

  // Create a simple form schema that only contains a custom component
  const formSchema = {
    content: {
      type: 'custom',
      render: () => children
    }
  };  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div>
          {children}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          {showCancel && (
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              if (_.isFunction(onConfirm)) {
                onConfirm();
              }
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
    />
  );
};

export default DialogWrapper;
