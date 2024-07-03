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
  const currentDivision = useCurrentDivision();
  const [files, setFiles] = useState<fileProps[]>([]);

  const form = useForm<z.infer<typeof transactionFormData>>({
    resolver: zodResolver(transactionFormData),
    mode: "onChange",
    defaultValues: {
      documentType: entity.data?.documentType,
      subject: entity.data?.subject,
      dueDate: entity.data?.dueDate,
      team: entity.data?.team,
      status: entity.data?.status,
      priority: entity.data?.priority,
      originDepartment: currentDivision,
      targetDepartment: entity.data?.targetDepartment,
      transactionId: entity.data?.transactionId,
      companyId: entity.data?.companyId,
      projectId: entity.data?.projectId,
      forwardedTo: entity.data?.forwardedTo,
      remarks: entity.data?.remarks,
      forwardedById: entity.data?.forwardedById,
      forwardedByRole: entity.data?.forwardedByRole,
      dateForwarded: new Date().toISOString(),
      documentSubType: entity.data?.documentSubType,
    },
  });
  useEffect(() => {
    if (entity.data) {
      form.reset({
        documentType: entity.data?.documentType,
        subject: entity.data?.subject,
        dueDate: entity.data?.dueDate,
        team: entity.data?.team,
        status: entity.data?.status,
        priority: entity.data?.priority,
        originDepartment: currentDivision,
        targetDepartment: entity.data?.targetDepartment,
        transactionId: entity.data?.transactionId,
        companyId: entity.data?.companyId,
        projectId: entity.data?.projectId,
        forwardedTo: entity.data?.forwardedTo,
        remarks: entity.data?.remarks,
        forwardedById: entity.data?.forwardedById,
        forwardedByRole: entity.data?.forwardedByRole,
        dateForwarded: new Date().toISOString(),
        documentSubType: entity.data?.documentSubType,
      });
    }
  }, [entity.data,form]);

  const onSubmit: SubmitHandler<z.infer<typeof transactionFormData>> = async (
    transactionData
  ) => {};
    if(entity.isLoading || entities.isLoading) return <div>Loading...</div>
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TransactionForm
            setFiles={setFiles}
            entities={entities.data}
            method="UPDATE"
          
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              onClick={() =>
                console.log(form.formState, form.control._formState)
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
