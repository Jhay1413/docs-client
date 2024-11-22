import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReimbursementForm from "./reimbursement-form";
import PurchaseRequestForm from "./purchase-request-form";
import FormSelector from "./form-selector";
import ReceivingReportForm from "./payment-request-form";
import PaymentRequestForm from "./payment-request-form";

export const RequestForms = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const handleSelectForm = (formId: string) => {
    setSelectedForm(formId);
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white">
      <h1 className="text-4xl">Admin Request Forms</h1>

      {selectedForm === null ? (
        <FormSelector onSelect={handleSelectForm} />
      ) : (
        <div>
          <Button variant="outline" onClick={() => setSelectedForm(null)} className="mb-4">
            Back to Templates
          </Button>
          {selectedForm === "reimbursement" && <ReimbursementForm />}
          {selectedForm === "purchase" && <PurchaseRequestForm />}
          {selectedForm === "payment" && <PaymentRequestForm />}
        </div>
      )}
    </div>
  );
};

export default RequestForms;
