import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const formTemplates = [
  { id: "resume", name: "Resume", description: "Professional resume template", preview: "Resume preview here..." },
  { id: "report", name: "Report", description: "Project report template", preview: "Report preview here..." },
  { id: "invoice", name: "Invoice", description: "Invoice template", preview: "Invoice preview here..." },
];

type FormSelectorProps = {
  onSelect: (templateId: string) => void;
};

const FormSelector: React.FC<FormSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {formTemplates.map((template) => (
        <div
          key={template.id}
          className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(template.id)}
        >
          <h3 className="text-xl font-bold">{template.name}</h3>
          <p>{template.preview}</p>
        </div>
      ))}
    </div>
  );
};

export default FormSelector;