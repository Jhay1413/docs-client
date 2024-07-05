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

  const [files, setFiles] = useState<fileProps[]>([]);

  const mutateFn = async (
    transactionData: z.infer<typeof transactionFormData>
  ) => {
    console.log(transactionData)
    update.mutate(transactionData)
  };
  
  if (entity.isLoading || entities.isLoading) return <div>Loading...</div>;
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        setFiles={setFiles}
        company={entities.data}
        method="UPDATE"
        mutateFn={mutateFn}
        defaultValue={entity.data}
      />
    </div>
  );
};
