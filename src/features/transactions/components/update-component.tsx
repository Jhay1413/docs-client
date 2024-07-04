import { useParams } from "react-router-dom";
import { useTransaction } from "../hooks/query-gate";
import {
  transactionData,
  transactionFormData,
} from "../schema/TransactionSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentDivision } from "@/hooks/use-user-hook";
import { TransactionForm } from "./transaction-form";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/features/companies";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";

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
