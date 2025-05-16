import { UploadCloud } from "lucide-react";

const NewTestForm = ({
  testName,
  setTestName,
  testDescription,
  setTestDescription,
  selectedFile,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {/* Test Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Test Name</label>
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Enter test name"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows="4"
          value={testDescription}
          onChange={(e) => setTestDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        ></textarea>
      </div>

      {/* Upload Field */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Document
        </label>
        <label
          htmlFor="file-upload"
          className="w-full border-2 border-dashed border-gray-300 rounded p-6 flex flex-col items-center text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition"
        >
          <UploadCloud size={32} className="text-gray-400 mb-2" />
          {selectedFile ? (
            <span>{selectedFile.name}</span>
          ) : (
            <>
              <p>Drag your file here</p>
              <p className="text-xs text-gray-400 mt-1">(or click to select)</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-900 text-white text-sm rounded hover:bg-blue-800 transition"
      >
        Create
      </button>
    </form>
  );
};

export default NewTestForm;
