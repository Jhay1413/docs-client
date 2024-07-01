import { Button } from "@/components/ui/button";
import {
  Form
} from "@/components/ui/form";


import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getCurrentUserId, useCurrentDivision, useCurrentUserRole } from "@/hooks/use-user-hook";
import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "./transaction-form";
import { uploadMultipleFiles } from "@/services/uploadFile";
import { transactionFormData } from "../schema/TransactionSchema";
import { z } from "zod";

type fileProps = {
  name: string;
  file: File;
};
export const InsertComponent = () => {
  const { add } = useTransaction("", "transaction", null);
  const { entities } = useCompanies("companies", "");

  const [files, setFiles] = useState<fileProps[]>([]);

  const userId = getCurrentUserId();
  const role = useCurrentUserRole()
  const currentDivision = useCurrentDivision();
  const form = useForm<z.infer<typeof transactionFormData>>({
    resolver: zodResolver(transactionFormData),
    mode: "onChange",
    defaultValues: {
      documentType: "",
      subject: "",
      dueDate : null,
      team: "",
      status:"",
      priority:"",
      originDepartment:currentDivision,
      targetDepartment:"",
      transactionId:"",
      companyId: "",
      projectId: "",
      forwardedTo: "",
      remarks: "",
      forwardedById: userId,
      forwardedByRole:role,
      dateForwarded: new Date(), // Default value is current date
      documentSubType: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof transactionFormData>> = async (transactionData) => {
   
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file.file);
      formData.append(`fileNames[${index}]`, file.name);
    });
    const uploadFile = await uploadMultipleFiles(formData);
    if (!uploadFile) {
    }
    const data = uploadFile.data.data;
    const payload = { ...transactionData, fileData: data ,dueDate:new Date(transactionData.dueDate!).toISOString(),dateForwarded:new Date(transactionData.dateForwarded).toISOString()};
    console.log(payload)
  add.mutate(payload);
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TransactionForm setFiles={setFiles} entities={entities.data} />
          <div className="flex justify-end">
            <Button type="submit" onClick={()=>console.log(form.formState,form.control._formState)}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
