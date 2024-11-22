import { NavLink } from "react-router-dom";



const FormSelector = () => {
  const formTemplates = [
    { id: "reimbursement", name: "Reimbursement Request", description: "Form for requesting reimbursements",  img: "/admin-request-forms/payment-request.png"},
    { id: "purchase", name: "Purchase Request", description: "Form for submitting purchase requests",  img: "/admin-request-forms/purchase-request.png"},
    { id: "payment", name: "Payment Request", description: "Form for submitting payment requests", img: "/admin-request-forms/payment-request.png" },
    { id: "quotation", name: "Quotation Request", description: "Form for requesting quotation requests",  img: "/admin-request-forms/payment-request.png" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-[1000px]">
      {formTemplates.map((template) => (
        <NavLink
          key={template.id}
          to={`/dashboard/admin/request/${template.id}-request`}
          className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <h3 className="text-xl font-bold">{template.name}</h3>
          <p>{template.description}</p>
          {template.img && <img src={template.img} alt={`${template.name} image`} />} 
        </NavLink>
      ))}
    </div>
  );
};

export default FormSelector;