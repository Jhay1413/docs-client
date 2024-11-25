import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, FileCode, Plus, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DragNdrop from "@/features/others/drag-drop";
import axios from "axios";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

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
  const [selectedType, setSelectedType] = useState<View>(View.SMR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<Files>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<Files>([]);
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);

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

  // Add a new year to the list
  const addYear = () => {
    const newYear = (parseInt(years[years.length - 1]) + 1).toString(); // Increment year by 1
    setYears([...years, newYear]);
    setSelectedYear(newYear); // Automatically select the newly added year
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
            onClick={addYear}
            className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <Plus size={18} />
          </button>
          </div>

          {/* Report Type Selection (SMR, CMR, ICR) */}
          <div className="flex justify-start gap-4">
            <button
              className={`text-lg font-bold p-2 ${selectedType === View.SMR ? "border-b-4 border-b-green-500" : ""}`}
              onClick={() => setSelectedType(View.SMR)}
            >
              SMR
            </button>
            <button
              className={`text-lg font-bold p-2 ${selectedType === View.CMR ? "border-b-4 border-b-green-500" : ""}`}
              onClick={() => setSelectedType(View.CMR)}
            >
              CMR
            </button>
            <button
              className={`text-lg font-bold p-2 ${selectedType === View.ICR ? "border-b-4 border-b-green-500" : ""}`}
              onClick={() => setSelectedType(View.ICR)}
            >
              ICR
            </button>
          </div>

          <Separator />

          {/* File Upload for Selected Year and Type */}
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">Upload File for {selectedYear} - {View[selectedType]}</h2>
            <input
              type="file"
              onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
              className="mt-2 p-2 border border-gray-300 rounded"
            />
          </div>
          <h2 className="text-lg font-medium">Upload Supporting Documents for {selectedYear} - {View[selectedType]}</h2>
          <DragNdrop onFilesSelected={handleFilesSelected} width="100%" height="100%" />
          <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                {showProgress && (
                  <div className="flex flex-col gap-2 text-white">
                    {files.map((file, index) => (
                      <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2" key={index}>
                        <div className="w-20">
                          <FileCode size={32} />
                        </div>
                        <div className="w-1/2">
                          <h1>{file.name}</h1>
                        </div>
                        <div className="flex justify-end w-full">
                          <Progress value={file.loading} className="w-[60%] h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2 text-white">
                  {uploadedFile.map((file, index) => (
                    <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2" key={index}>
                      <div className="w-20">
                        <FileCode size={32} />
                      </div>
                      <div className="w-full">
                        <h1>{file.name}</h1>
                      </div>
                      <div className="flex justify-end w-full gap-2">
                        <Check size={28} />
                        <XCircle size={28} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveFile(index)} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
        </div>

        <Separator />

        {/* Content Rendering Based on Selected Year and Report Type */}
        <div>
          {selectedType === View.SMR && (
            <div>
              <h3 className="font-medium text-xl">SMR Report for {selectedYear}</h3>
            </div>
          )}
          {selectedType === View.CMR && (
            <div>
              <h3 className="font-medium text-xl">CMR Report for {selectedYear}</h3>
            </div>
          )}
          {selectedType === View.ICR && (
            <div>
              <h3 className="font-medium text-xl">ICR Report for {selectedYear}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingCard;
