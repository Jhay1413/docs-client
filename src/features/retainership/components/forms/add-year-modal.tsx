import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface AddYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddYear: (year: string) => void;
}

const AddYearModal: React.FC<AddYearModalProps> = ({ isOpen, onClose, onAddYear }) => {
  const [newYear, setNewYear] = useState("");

  const handleAddYear = () => {
    const yearAsNumber = parseInt(newYear, 10);

    if (isNaN(yearAsNumber) || yearAsNumber < 1000 || yearAsNumber > 9999) {
      toast.error("Please enter a valid year (e.g., 2023)");
      return;
    }

    onAddYear(newYear);
    setNewYear("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Year</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          placeholder="Enter year (e.g., 2023)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <DialogFooter>
          <Button onClick={handleAddYear} className="bg-green-500 text-white">
            Add Year
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddYearModal;
