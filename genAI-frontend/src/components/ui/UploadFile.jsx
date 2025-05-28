import { useState, useEffect } from "react";

const UploadFile = ({
  label,
  maxSizeMB,
  onUpload,
  isInvalid = false,
  helperText = "",
}) => {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      setFileName(null);
      setPreviewUrl(null);
    } else {
      setError(null);
      setFileName(file.name);
      onUpload?.(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const hasError = isInvalid || error;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <label
        className={`block w-full border-2 rounded-md p-6 text-center h-60 flex flex-col items-center justify-center cursor-pointer transition
        ${hasError
          ? 'border-red-500 text-red-600 bg-red-50'
          : 'border-dashed border-gray-300 text-gray-500 hover:bg-gray-50'}
        `}
      >
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 rounded-lg object-contain mb-2"
            />
            <span className="text-xs">{fileName}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">Click or drag file</span>
            <span className="text-xs text-gray-400">Only .pdf, .doc, .docx, .txt</span>
          </div>
        )}
      </label>

      {hasError && (
        <p className="text-sm text-red-600 mt-1">
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default UploadFile;
