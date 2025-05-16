import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import NewTestForm from '../components/newtest/NewTestForm';
import TestCaseTable from '../components/newtest/TestCaseTable';
import DownloadButtons from '../components/newtest/DownloadButtons';

const mockApiResponse = {
  "File Operations": [
    {
      "Test ID": "FO-001",
      "Test Case Description": "Create a new empty document",
      "Test Steps": "1. Launch application\n2. Select option to create new document",
      "Expected Result": "A new empty document is created successfully",
      "Requirement ID": "DEMO-SRS-53",
      "Priority": "High"
    },
    {
      "Test ID": "FO-002",
      "Test Case Description": "Save changes before closing document",
      "Test Steps": "1. Make changes to document\n2. Attempt to close document",
      "Expected Result": "Application prompts user to save changes before closing",
      "Requirement ID": "DEMO-SRS-54",
      "Priority": "High"
    }
  ]
};

const NewTestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testCases, setTestCases] = useState(null);
  const [header, setHeader] = useState('Get Started');

  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please upload a document.');
      return;
    }

    setIsLoading(true);
    setHeader('Generating test cases...');

    // Simulate API call
    setTimeout(() => {
      setTestCases(mockApiResponse['File Operations']);
      setIsLoading(false);
      setHeader('Generated Test Cases');
    }, 2000);
  };

  const downloadCSV = () => {
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

    let csvContent = `Test Name:,${testName}\nDescription:,${testDescription}\n\n`;
    csvContent += [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "test_cases.csv");
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Test Name: ${testName}`, 14, 16);
    doc.text(`Description: ${testDescription}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Test ID",
          "Test Case Description",
          "Test Steps",
          "Expected Result",
          "Requirement ID",
          "Priority",
        ],
      ],
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

      {isLoading ? (
        <p className="text-gray-600 mt-4">Please wait while we generate your test cases...</p>
      ) : testCases ? (
        <>
          <TestCaseTable testCases={testCases} />
          <DownloadButtons downloadCSV={downloadCSV} downloadPDF={downloadPDF} />
        </>
      ) : (
        <NewTestForm
          testName={testName}
          setTestName={setTestName}
          testDescription={testDescription}
          setTestDescription={setTestDescription}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default NewTestPage;
