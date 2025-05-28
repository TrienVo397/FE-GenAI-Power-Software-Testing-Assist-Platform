import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadCSV = (testCases, metadata) => {
  const headers = [
    "Test ID",
    "Test Case Description",
    "Test Steps",
    "Expected Result",
    "Requirement ID",
    "Priority",
  ];

  const rows = testCases.map((test) =>
    headers.map((h) => `"${(test[h] || "").replace(/\n/g, " ")}"`)
  );

  let csvContent = `Test Name:,${metadata.testName}\nDescription:,${metadata.testDescription}\n\n`;
  csvContent += [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "test_cases.csv";
  link.click();
};

export const downloadPDF = (testCases, metadata) => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`Test Name: ${metadata.testName}`, 14, 16);
  doc.text(`Description: ${metadata.testDescription}`, 14, 24);

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
