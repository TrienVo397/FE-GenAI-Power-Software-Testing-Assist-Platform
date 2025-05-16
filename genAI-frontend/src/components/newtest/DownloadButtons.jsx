const DownloadButtons = ({ downloadCSV, downloadPDF }) => (
  <div className="mt-4 flex gap-4">
    <button
      onClick={downloadCSV}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
    >
      Download CSV
    </button>
    <button
      onClick={downloadPDF}
      className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
    >
      Download PDF
    </button>
  </div>
);

export default DownloadButtons;
