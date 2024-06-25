import { Button } from "@/components/ui/button";
import {
  Form
} from "@/components/ui/form";


import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TFormData, formTransactionData } from "../schema/TransactionSchema";
import { getCurrentUserId, useCurrentDivision } from "@/hooks/use-user-hook";
import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "./transaction-form";
import { uploadMultipleFiles } from "@/services/uploadFile";

type fileProps = {
  name: string;
  file: File;
};
export const InsertComponent = () => {
  const { add } = useTransaction("", "transaction", null);
  const { entities } = useCompanies("companies", "");

  const [files, setFiles] = useState<fileProps[]>([]);

  const userId = getCurrentUserId();
  const currentDivision = useCurrentDivision();
  const form = useForm<TFormData>({
    resolver: zodResolver(formTransactionData),
    mode: "onChange",
    defaultValues: {
      documentType: "",
      subject: "",
      company: "",
      project: "",
      forwardedTo: "",
      remarks: "",
      createdBy: userId,
      fromDepartment: currentDivision,
      toDepartment: "",
      dueDate: new Date(),
      forwardedBy: userId,
      dateForwarded: new Date(), // Default value is current date
      team: "",
      documentSubType: "",
    },
  });

  const onSubmit: SubmitHandler<TFormData> = async (transactionData) => {

   
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file.file);
      formData.append(`fileNames[${index}]`, file.name);
    });
    const uploadFile = await uploadMultipleFiles(formData);
    if (!uploadFile) {
    }
    const data = uploadFile.data.data;
    const payload = { ...transactionData, fileData: data };

    add.mutate(payload);
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TransactionForm setFiles={setFiles} entities={entities.data} />
          <div className="flex justify-end">
            <Button >Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
