import { useState, useEffect } from "react";

const UploadFile = ({ label, maxSizeMB, onUpload }) => {
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

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="border-2 border-dashed rounded-md p-6 text-center h-60 flex flex-col items-center justify-center space-y-2">
      <label className="block cursor-pointer w-full">
        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
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
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-gray-400">No file selected</span>
          </div>
        )}
        {error && <span className="text-xs text-red-500 mt-2">{error}</span>}
      </label>
    </div>
  );
};

export default UploadFile;
