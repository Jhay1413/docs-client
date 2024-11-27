import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, ChevronUp, FileCode, Plus, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DragNdrop from "@/features/others/drag-drop";
import axios from "axios";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

enum View {
  SMR,
  CMR,
  ICR,
}

type Files = {
  name: string;
  loading: number;
}[];

const baseUrlV2 = import.meta.env.VITE_ENDPOINT;

const ReportingCard: React.FC = () => {
  const [years, setYears] = useState(["2023", "2024"]);
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedQuarter, setSelectedQuarter] = useState("1st QUARTER");
  const [selectedType, setSelectedType] = useState<View>(View.SMR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<Files>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<Files>([]);
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);
  const quarters = ["1st QUARTER", "2nd QUARTER", "3rd QUARTER", "4th QUARTER"];
  const [newYear, setNewYear] = useState("");
  const [openSections, setOpenSections] = useState<Set<View>>(new Set<View>());

  // Handle file upload
  const handleFilesSelected = (newFiles: File[]) => {
    handleFileUpload(newFiles);
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    setShowProgress(true);

    // Reset the loading state for all files before starting new uploads
    const initialFilesState = filesToUpload.map((file) => ({ name: file.name, loading: 0 }));
    setFiles(initialFilesState);

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("thumbnail", file);
      formData.append("company", "Envicomm");
      formData.append("fileName", file.name);

      try {
        const result = await axios.post(`${baseUrlV2}/posts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            const total = e.total || 1;
            setFiles((prevState) => {
              const newFiles = [...prevState];
              const currentIndex = newFiles.findIndex((f) => f.name === file.name);
              if (currentIndex !== -1) {
                newFiles[currentIndex].loading = Math.floor((e.loaded / total) * 100);
              }
              return newFiles;
            });
          },
        });
        setUploadedKeys((prevKeys) => [...prevKeys, result.data.key]);
        setUploadedFile((prevFiles) => [...prevFiles, { name: file.name, loading: 100 }]);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    }
    setShowProgress(false);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedKeys((prevKeys) => prevKeys.filter((_, i) => i !== index));
  };

  const handleAddYear = () => {
    const yearAsNumber = parseInt(newYear, 10);

    if (isNaN(yearAsNumber) || yearAsNumber < 1000 || yearAsNumber > 9999) {
      toast.error("Please enter a valid year (e.g., 2023)");
      return;
    }

    if (years.includes(newYear)) {
      toast.error("Year already exists!");
      return;
    }

    setYears((prevYears) => [...prevYears, newYear].sort());
    setSelectedYear(newYear);
    setIsModalOpen(false);
    setNewYear("");
  };

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

  return (
    <div className="shadow-md">

      <div className="flex flex-col gap-6 w-full p-8">
        <div className="space-y-6">
          {/* Year Selection with Add Year Button */}
          <div className="flex justify-start gap-4 items-center">
            {years.map((year) => (
              <button
                key={year}
                className={`text-xl font-bold p-2 ${selectedYear === year ? "border-b-4 border-b-green-500" : ""}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Modal for Adding Year */}
          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Year</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter year (e.g., 2023)"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddYear} className="bg-green-500 text-white">
                    Add Year
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)} variant="ghost">
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
            {/* Quarter Selection */}
            <div className="flex justify-between w-full gap-4">
              {quarters.map((quarter) => (
                <button
                  key={quarter}
                  className={`text-base font-bold border shadow-md rounded-full w-full p-1 ${
                    selectedQuarter === quarter? "border-b-4 border-b-green-500" : ""
                  }`}
                  onClick={() => setSelectedQuarter(quarter)}
                >
                  {quarter}
                </button>
              ))}
            </div>

          {/* Report Type Selection (SMR, CMR, ICR) */}
          <div>
            {Object.values(View)
              .filter((type) => typeof type === "number") // Filter only numeric values
              .map((type) => {
                const isOpen = openSections.has(type as View);

                return (
                  <div key={type} className="mb-1 border rounded-md shadow-sm">
                    {/* Collapsible Header */}
                    <div
                      className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                      onClick={() => toggleSection(type as View)}
                    >
                      <h3 className="text-base font-bold pl-4">
                        {type === View.SMR
                          ? "SMR"
                          : type === View.CMR
                          ? "CMR"
                          : "ICR"}
                      </h3>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {/* Collapsible Content */}
                    {isOpen && (
                      <div className="p-4 bg-white space-y-4">
                        {/* Year, Quarter, and Report Type */}
                        <h4 className="font-normal">
                          {selectedYear} {selectedQuarter} {" "}
                          {type === View.SMR
                            ? "SMR"
                            : type === View.CMR
                            ? "CMR"
                            : "ICR"} -{" "}
                            Report Files
                        </h4>

                        {/* File Upload */}
                        <div>
                          <h5 className="text-base font-normal">Upload Report File</h5>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileUpload(Array.from(e.target.files || []))
                            }
                            className="mt-2 p-2 border border-gray-300 rounded"
                          />
                        </div>

                        {/* Drag and Drop for Supporting Documents */}
                        <div>
                          <h5 className="text-base font-normal">
                            Upload Supporting Documents
                          </h5>
                          <DragNdrop
                            onFilesSelected={handleFilesSelected}
                            width="100%"
                            height="100%"
                          />
                        </div>

                        {/* Progress and Uploaded Files */}
                        <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                          {showProgress && (
                            <div className="flex flex-col gap-2 text-white">
                              {files.map((file, index) => (
                                <div
                                  className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2"
                                  key={index}
                                >
                                  <div className="w-20">
                                    <FileCode size={32} />
                                  </div>
                                  <div className="w-1/2">
                                    <h1>{file.name}</h1>
                                  </div>
                                  <div className="flex justify-end w-full">
                                    <Progress
                                      value={file.loading}
                                      className="w-[60%] h-4"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-col gap-2 text-white">
                            {uploadedFile.map((file, index) => (
                              <div
                                className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2"
                                key={index}
                              >
                                <div className="w-20">
                                  <FileCode size={32} />
                                </div>
                                <div className="w-full">
                                  <h1>{file.name}</h1>
                                </div>
                                <div className="flex justify-end w-full gap-2">
                                  <Check size={28} />
                                  <XCircle
                                    size={28}
                                    className="cursor-pointer hover:text-red-500"
                                    onClick={() => handleRemoveFile(index)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        {/* Content Rendering for Each Type */}
                        <div>
                          {type === View.SMR && (
                            <div>
                              <h3 className="font-medium text-xl">
                                SMR Report Content for {selectedYear} {selectedQuarter}
                              </h3>
                            </div>
                          )}
                          {type === View.CMR && (
                            <div>
                              <h3 className="font-medium text-xl">
                                CMR Report Content for {selectedYear} {selectedQuarter}
                              </h3>
                            </div>
                          )}
                          {type === View.ICR && (
                            <div>
                              <h3 className="font-medium text-xl">
                                ICR Report Content for {selectedYear} {selectedQuarter}
                              </h3>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <Separator />
         </div>
      </div>
    </div>
  );
};

export default ReportingCard;
