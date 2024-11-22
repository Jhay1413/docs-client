type FormSelectorProps = {
  onSelect: (templateId: string) => void;
};

const FormSelector: React.FC<FormSelectorProps> = ({ onSelect }) => {
  const formTemplates = [
    { id: "reimbursement", name: "Reimbursement Request", description: "Form for requesting reimbursements" },
    { id: "purchase", name: "Purchase Request", description: "Form for submitting purchase requests" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {formTemplates.map((template) => (
        <div
          key={template.id}
          className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(template.id)}
        >
          <h3 className="text-xl font-bold">{template.name}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FormSelector;
