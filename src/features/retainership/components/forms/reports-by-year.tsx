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
            className={`text-base font-bold border shadow-md rounded-full w-full p-1 bg-gray-200 ${
              selectedQuarter === quarter ? "border-b-4 border-b-green-500 bg-white" : ""
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
                    {year} {selectedQuarter} {type === View.SMR ? "SMR" : type === View.CMR ? "CMR" : "ICIR"} - Report
                    Files
                  </h4>
                  <div>
                    <h5 className="text-base font-normal">Upload Report File</h5>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                      className="mt-2 p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <DragNdrop onFilesSelected={(newFiles) => handleFileUpload(newFiles)} width="100%" height="100%" />

                  <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                    {showProgress &&
                      files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-blue-300 p-2 rounded-md">
                          <FileCode size={32} />
                          <div className="flex-1">{file.name}</div>
                          <Progress value={file.loading} className="w-1/3 h-4" />
                        </div>
                      ))}
                    {uploadedFile.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-300 p-2 rounded-md">
                        <FileCode size={32} />
                        <div className="flex-1">{file.name}</div>
                        <XCircle size={28} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveFile(index)} />
                      </div>
                    ))}
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
