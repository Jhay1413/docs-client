import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface AddReportProps {
  isOpen: boolean;
  onClose: () => void;
  onAddYear: (year: string, quarter: string, reportType: string) => void;
}

const AddReportFormModal: React.FC<AddReportProps> = ({ isOpen, onClose, onAddYear }) => {
  const [newYear, setNewYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const quarters = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];
  const reportTypes = ["SMR", "CMR", "ICIR"];

  const handleAddYear = () => {
    const yearAsNumber = parseInt(newYear, 10);
    if (isNaN(yearAsNumber) || yearAsNumber < 1000 || yearAsNumber > 9999) {
      toast.error("Please enter a valid year (e.g., 2023)");
      return;
    }

    if (!selectedQuarter) {
      toast.error("Please select a quarter.");
      return;
    }

    if (!selectedReportType) {
      toast.error("Please select a report type.");
      return;
    }

    const newReport = onAddYear(newYear, selectedQuarter, selectedReportType);
    setNewYear("");
    setSelectedQuarter("");
    setSelectedReportType("");
    onClose();
    console.log("New Report:", newReport);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Report</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          placeholder="Enter year (e.g., 2023)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        {/* QUarter select */}
        <select
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="" disabled>
            Select a Quarter
          </option>
          {quarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>

        {/* Report Type select */}
        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="" disabled>
            Select a Report Type
          </option>
          {reportTypes.map((report) => (
            <option key={report} value={report}>
              {report}
            </option>
          ))}
        </select>

        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleAddYear} className="bg-green-500 text-white">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportFormModal;
