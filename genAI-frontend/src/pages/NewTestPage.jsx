import { useState } from "react";
import { generateTestCases } from "../components/newtest/api/testCaseService";
import { downloadCSV, downloadPDF } from "../components/newtest/utils/exportUtils";

import NewTestForm from "../components/newtest/NewTestForm";
import TestCaseTable from "../components/newtest/TestCaseTable";
import DownloadButtons from "../components/newtest/DownloadButtons";

const NewTestPage = () => {
  const [header, setHeader] = useState("Get Started");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testCases, setTestCases] = useState(null);
  const [submittedForm, setSubmittedForm] = useState(null);

  const handleSubmit = async ({ testName, testDescription, testFile }) => {
    setIsLoading(true);
    setHeader("Generating test cases...");
    setError(null);

    try {
      const result = await generateTestCases(testFile);
      setTestCases(result);
      setSubmittedForm({ testName, testDescription });
      setHeader("Generated Test Cases");
    } catch (err) {
      console.error("API error:", err);
      setError(err.response?.data?.error || "Failed to generate test cases.");
      setHeader("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{header}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600 mt-4">Please wait while we generate your test cases...</p>
      ) : testCases ? (
        <>
          <TestCaseTable testCases={testCases} />
          <DownloadButtons
            downloadCSV={() => downloadCSV(testCases, submittedForm)}
            downloadPDF={() => downloadPDF(testCases, submittedForm)}
          />
        </>
      ) : (
        <NewTestForm onFormSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default NewTestPage;
