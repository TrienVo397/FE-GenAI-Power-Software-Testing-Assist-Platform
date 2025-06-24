import Button from "../ui/Button";

const DownloadButtons = ({ downloadCSV, downloadPDF }) => (
  <div className="mt-4 flex gap-4">
    <Button onClick={downloadCSV} variant="success">
      Download CSV
    </Button>
    <Button onClick={downloadPDF} variant="destructive">
      Download PDF
    </Button>
  </div>
);

export default DownloadButtons;
