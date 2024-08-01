import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "../forms/transaction-form";
import {
  signedUrlDataArray,
  transactionFormData,
} from "../schema/TransactionSchema";
import { z } from "zod";
import {
  prepare_file_payload,
  prepare_transaction_payload,
} from "../utils/pre-process-data";
import { getSignedUrl } from "../services/getSignedUrl";
import { redirect, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const InsertComponent = () => {
  const { add } = useTransaction({key:"inbox",url:"/v2"});
  const { entities } = useCompanies("companies", "");

  const navigate = useNavigate();
  const onSubmit = async (
    transactionData: z.infer<typeof transactionFormData>,
    setIsSubmitting : (value:boolean)=>void
  ) => {
    const attachments = transactionData.attachments?.filter(
      (data) => data.file?.length! > 0
    );

    if (!attachments || attachments.length === 0)
      return add.mutate(transactionData);

    const selectedCompany = entities?.data?.find(
      (company) => transactionData.companyId === company.id
    );

    const signedUrlPayload = attachments?.map((attachment) => {
      return {
        company: selectedCompany!.companyName!,
        fileName: attachment.fileName!,
      };
    });

    if (signedUrlPayload && signedUrlPayload?.length > 0) {
      const getSignedUrlForUpload = await getSignedUrl(signedUrlPayload);
      const validatedData = signedUrlDataArray.safeParse(getSignedUrlForUpload);

      if (!validatedData.success) return null;

      const res = await prepare_file_payload(attachments, validatedData.data);

      const payload = prepare_transaction_payload(transactionData, res);

      await add.mutateAsync(payload);

      if(!add.isPending){
        setIsSubmitting(false)
      }
    }
  };
  
  useEffect(() => {
    if (add.isSuccess) {
      navigate("/dashboard/transactions/list");
    }
  }, [add.isSuccess]);

  if(entities.isLoading) return "loading"
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm company={entities.data} mutateFn={onSubmit} />
    </div>
  );
};
