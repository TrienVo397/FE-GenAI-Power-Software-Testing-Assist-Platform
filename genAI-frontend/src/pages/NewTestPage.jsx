import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

import NewTestForm from '../components/newtest/NewTestForm';
import TestCaseTable from '../components/newtest/TestCaseTable';
import DownloadButtons from '../components/newtest/DownloadButtons';

const NewTestPage = () => {
  const [header, setHeader] = useState('Get Started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testCases, setTestCases] = useState(null);

  const [submittedForm, setSubmittedForm] = useState(null); // to hold testName, testDescription, testFile

  const handleSubmit = async (formData) => {
    const { testName, testDescription, testFile } = formData;

    setIsLoading(true);
    setHeader('Generating test cases...');
    setError(null);

    try {
      const payload = new FormData();
      payload.append('file', testFile);
      // Add these if API supports
      // payload.append('test_name', testName);
      // payload.append('description', testDescription);

      const response = await axios.post('http://localhost:5000/generate-test-cases', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTestCases(response.data);
      setSubmittedForm({ testName, testDescription });
      setHeader('Generated Test Cases');
    } catch (err) {
      console.error('API error:', err);
      setError(err.response?.data?.error || 'Failed to generate test cases.');
      setHeader('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!submittedForm || !testCases) return;
    const headers = [
      "Test ID",
      "Test Case Description",
      "Test Steps",
      "Expected Result",
      "Requirement ID",
      "Priority",
    ];
    const rows = testCases.map((test) =>
      headers.map((h) => `"${(test[h] || '').replace(/\n/g, ' ')}"`)
    );

    let csvContent = `Test Name:,${submittedForm.testName}\nDescription:,${submittedForm.testDescription}\n\n`;
    csvContent += [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "test_cases.csv");
    link.click();
  };

  const downloadPDF = () => {
    if (!submittedForm || !testCases) return;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Test Name: ${submittedForm.testName}`, 14, 16);
    doc.text(`Description: ${submittedForm.testDescription}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [[
        "Test ID",
        "Test Case Description",
        "Test Steps",
        "Expected Result",
        "Requirement ID",
        "Priority",
      ]],
      body: testCases.map((test) => [
        test["Test ID"],
        test["Test Case Description"],
        test["Test Steps"],
        test["Expected Result"],
        test["Requirement ID"],
        test["Priority"],
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 72, 108] },
    });

    doc.save("test_cases.pdf");
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
          <DownloadButtons downloadCSV={downloadCSV} downloadPDF={downloadPDF} />
        </>
      ) : (
        <NewTestForm onFormSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default NewTestPage;
