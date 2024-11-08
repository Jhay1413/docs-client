import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import './drag-drop.css';

type DragNdropProps = {
  onFilesSelected: (files: File[]) => void;
  width?: string;
  height?: string;
};

const DragNdrop: React.FC<DragNdropProps> = ({
  onFilesSelected,
  width = "300px",
  height = "200px",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      addFiles(newFiles);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      addFiles(newFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const addFiles = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFilesSelected(newFiles);
  };

  return (
    <section className="drag-drop" style={{ width, height }}>
      <div
        className={`document-uploader ${isDragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="upload-content">
          <CloudUpload className="upload-icon" />
          <div className="upload-text">
            <p className="main-text">Drag and drop your files here</p>
            <p className="sub-text">Maximum file size: 40MB per file</p>
          </div>
        </div>
        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept=".jpg,.png,.pdf,.docx,.txt,.xlsx"
          multiple
        />
        <label htmlFor="browse" className="browse-btn">
          Browse files
        </label>
      </div>
    </section>
  );
};

export default DragNdrop;
