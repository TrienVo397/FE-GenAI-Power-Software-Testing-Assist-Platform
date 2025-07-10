// filepath: src/components/fileexplorer/SimpleDialog.jsx
import React, { ReactNode } from 'react';
import _ from 'lodash';

type SimpleDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  showCancel?: boolean;
  children?: ReactNode;
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({
  open,
  onClose,
  title,
  onConfirm,
  confirmLabel = 'Save',
  showCancel = true,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div>{children}</div>

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
  );
};

export default SimpleDialog;
