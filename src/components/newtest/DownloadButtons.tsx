import React from "react";
import Button from "../ui/Button";

type DownloadButtonsProps = {
  downloadCSV: () => void;
  downloadPDF: () => void;
};

const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  downloadCSV,
  downloadPDF,
}) => (
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
