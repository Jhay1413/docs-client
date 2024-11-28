import { useState } from "react";
import { ChevronDown, ChevronUp, Check, FileCode, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DragNdrop from "@/features/others/drag-drop";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";

enum View {
  SMR,
  CMR,
  ICIR,
}

type ReportsByYearProps = {
  year: string;
  quarters: string[];
};

type Files = {
  name: string;
  loading: number;
}[];

const ReportsByYear: React.FC<ReportsByYearProps> = ({ year, quarters }) => {
  const [selectedQuarter, setSelectedQuarter] = useState(quarters[0]);
  const [openSections, setOpenSections] = useState<Set<View>>(new Set<View>());
  const [files, setFiles] = useState<Files>([]);
  const [uploadedFile, setUploadedFile] = useState<Files>([]);
  const [showProgress, setShowProgress] = useState(false);

  const toggleSection = (section: View) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    setShowProgress(true);
    const initialFilesState = filesToUpload.map((file) => ({ name: file.name, loading: 0 }));
    setFiles(initialFilesState);

    for (const file of filesToUpload) {
      try {
        // Simulate file upload
        setFiles((prevState) =>
          prevState.map((f) => (f.name === file.name ? { ...f, loading: 100 } : f))
        );
        setUploadedFile((prevFiles) => [...prevFiles, { name: file.name, loading: 100 }]);
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      }
    }
    setShowProgress(false);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full gap-4">
        {quarters.map((quarter) => (
          <button
            key={quarter}
            className={`text-base font-bold border shadow-md rounded-full w-full p-1 bg-white ${
              selectedQuarter === quarter ? "border-b-4 border-b-green-500 " : "bg-gray-200"
            }`}
            onClick={() => setSelectedQuarter(quarter)}
          >
            {quarter}
          </button>
        ))}
      </div>

      {Object.values(View)
        .filter((type) => typeof type === "number")
        .map((type) => {
          const isOpen = openSections.has(type as View);

          return (
            <div key={type} className="mb-1 border rounded-md shadow-sm">
              <div
                className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                onClick={() => toggleSection(type as View)}
              >
                <h3 className="text-base font-bold pl-4">
                  {type === View.SMR ? "SMR" : type === View.CMR ? "CMR" : "ICIR"}
                </h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {isOpen && (
                <div className="p-4 bg-white space-y-4">
                  <h4 className="font-normal">
                    <div>
                        <h5 className="text-base font-bold">Report Details</h5>
                    </div>
                    {year} {selectedQuarter} {type === View.SMR ? "SMR" : type === View.CMR ? "CMR" : "ICIR"} - Report
                    Files
                  </h4>
                  <div>
                    <h5 className="text-base font-normal">Actual Report Document:</h5>
                    <a
                    href="https://example.com/ecc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    DTS-Envicomm-Report/{selectedQuarter}-{type === View.SMR ? "SMR" : type === View.CMR ? "CMR" : "ICIR"}
                  </a>
                  </div>
                  
                  <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                    <table className="table-auto w-full border-collapse border border-white">
                        <thead>
                            <tr className="bg-lime-500/70 text-center rounded-lg">
                                <th className="border border-white p-2">Date</th>
                                <th className="border border-white p-2">Subject</th>
                                <th className="border border-white p-2">Attachment</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                  </ScrollArea>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ReportsByYear;
