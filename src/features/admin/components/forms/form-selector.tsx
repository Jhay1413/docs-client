import { NavLink } from "react-router-dom";



const FormSelector = () => {
  const formTemplates = [
    { id: "reimbursement", name: "Reimbursement Request", description: "Form for requesting reimbursements",  img: "/admin-request-forms/payment-request.png"},
    { id: "purchase", name: "Purchase Request", description: "Form for submitting purchase requests",  img: "/admin-request-forms/purchase-request.png"},
    { id: "payment", name: "Payment Request", description: "Form for submitting payment requests", img: "/admin-request-forms/payment-request.png" },
    { id: "quotation", name: "Quotation Request", description: "Form for requesting quotation requests",  img: "/admin-request-forms/payment-request.png" },
  ];

  return (
    <div className="py-2 grid grid-cols-4 gap-4 items-center justify-center">
      {formTemplates.map((template) => (
        <NavLink
          key={template.id}
          to={`/dashboard/admin/request/${template.id}-request`}
          className="border-2 p-4 rounded-lg cursor-pointer hover:bg-gray-100 "
        >
          <h3 className="text-base font-bold text-center">{template.name}</h3>
          <p className="text-xs font-light pb-4 text-center">{template.description}</p>
          {template.img && 
            <div className="flex items-center justify-center">
              <img className="h-64 w-48 "src={template.img} alt={`${template.name} image`} />
            </div> 
          } 
        </NavLink>
      ))}

      <div className="col-span-4 text-center mt-4">
        <h2 className="text-lg font-semibold">Select a Request Form</h2>
      </div>
    </div>
  );
};

export default FormSelector;