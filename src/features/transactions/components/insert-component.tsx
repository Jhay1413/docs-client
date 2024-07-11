import { useState } from "react";
import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "./transaction-form";
import { uploadMultipleFiles } from "@/services/uploadFile";
import { filesSchema, transactionFormData } from "../schema/TransactionSchema";
import { z } from "zod";
import { checkList } from "@/data/checklist";
import { prepare_file_payload, prepare_transaction_payload, } from "../utils/pre-process-data";

type fileProps = {
  name: string;
  file: File;
};
export const InsertComponent = () => {
  const { add } = useTransaction("", "transaction", null);
  const { entities } = useCompanies("companies", "");

  const onSubmit = async (
    transactionData: z.infer<typeof transactionFormData>
  ) => {
  
    const formData:FormData = prepare_file_payload(transactionData)

    const uploadFile = await uploadMultipleFiles(formData);

    if(!uploadFile) return null

    const payload = prepare_transaction_payload(transactionData,uploadFile.data.data);
    add.mutate(payload);
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        company={entities.data}
        mutateFn={onSubmit}
      />
    </div>
  );
};
