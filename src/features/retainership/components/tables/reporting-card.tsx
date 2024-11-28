import { useState } from "react";
import ReportsByYear from "../forms/reports-by-year";
import AddReportFormModal from "../forms/add-report-modal";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

const ReportingCard: React.FC = () => {
  const [years, setYears] = useState(["2023", "2024"]);
  const [selectedYear, setSelectedYear] = useState("2023"); // Default to the first year
  const [isModalOpen, setIsModalOpen] = useState(false);
  const quarters = ["1st QUARTER", "2nd QUARTER", "3rd QUARTER", "4th QUARTER"];

  const handleAddYear = (year: string) => {
    if (years.includes(year)) {
      toast.error("Year already exists!");
      return;
    }

    setYears((prevYears) => [...prevYears, year].sort());
    setSelectedYear(year);
  };

  return (
    <div className="p-8 shadow-md">
      <div className="space-y-6">
        {/* Year Selector */}
        <div className="flex items-center">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`text-xl font-bold px-4 py-2 rounded-lg ${
                selectedYear === year
                  ? "bg-white text-gray-600 border-t border-l border-r rounded-b-none " 
                  : "border-t border-l border-r rounded-b-none border-gray-300 bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {year}
            </button>
          ))}
          <div className="pl-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Add Year Modal */}
        <AddReportFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddYear={handleAddYear}
        />

        {/* Conditionally Render ReportsByYear */}
        {years.map(
          (year) =>
            selectedYear === year && (
              <ReportsByYear key={year} year={year} quarters={quarters} />
            )
        )}
      </div>
    </div>
  );
};

export default ReportingCard;
