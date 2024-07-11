import { useParams } from "react-router-dom";
import { useTransaction } from "../hooks/query-gate";
import {
  transactionData,
  transactionFormData,
} from "../schema/TransactionSchema";
import { z } from "zod";
import { TransactionForm } from "./transaction-form";
import { useCompanies } from "@/features/companies";
import { useState } from "react";
import { prepare_file_payload, prepare_transaction_payload } from "../utils/pre-process-data";
import { uploadMultipleFiles } from "@/services/uploadFile";

type fileProps = {
  name: string;
  file: File;
};
export const TransactionUpdateComponent = () => {
  const { id } = useParams();
  const { entities } = useCompanies("companies", "");
  const { entity, update } = useTransaction<z.infer<typeof transactionData>>(
    `${id}`,
    "transactions",
    id
  );

  const mutateFn = async (
    transactionData: z.infer<typeof transactionFormData>
  ) => {
    
    const formData:FormData = prepare_file_payload(transactionData)

    console.log("ayaw umabot dito")
    const uploadFile = await uploadMultipleFiles(formData);

    if(!uploadFile) return null
    const payload = prepare_transaction_payload(transactionData,uploadFile.data.data);
    console.log(payload);
    // update.mutate(payload)
  };
  if (entity.isLoading || entities.isLoading) return <div>Loading...</div>;
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        company={entities.data}
        method="UPDATE"
        mutateFn={mutateFn}
        defaultValue={entity.data}
      />
    </div>
  );
};
