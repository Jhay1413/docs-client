import { useNavigate, useParams } from "react-router-dom";
import { useTransaction } from "../hooks/query-gate";
import {
  signedUrlDataArray,
  transactionData,
  transactionFormData,
} from "../schema/TransactionSchema";
import { z } from "zod";
import { TransactionForm } from "../forms/transaction-form";
import { useCompanies } from "@/features/companies";
import { useEffect } from "react";
import {
  prepare_file_payload,
  prepare_transaction_payload,
} from "../utils/pre-process-data";
import { getSignedUrl } from "../services/getSignedUrl";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";

export const TransactionUpdateComponent = () => {
  const { id } = useParams();
  const userId = getCurrentUserId();
  const { entities } = useCompanies("companies", "");
  const { entity, update } = useTransaction<z.infer<typeof transactionData>>({
    key: "inbox",
    url: `v2/${id}`,
    id,
    method: "UPDATEREMOVE",
  });
  const navigate = useNavigate();
  //For review !! temporarily separated the update and add component  with the same logic
  const mutateFn = async (
    transactionData: z.infer<typeof transactionFormData>
  ) => {
    const attachments = transactionData.attachments?.filter(
      (data) => data.file?.length! > 0
    );

    if (!attachments || attachments.length === 0)
      return update.mutate(transactionData);

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
      console.log(res);
      const payload = prepare_transaction_payload(transactionData, res);
      console.log(payload);
      update.mutate(payload);
    }
  };

  useEffect(() => {
    if (update.isSuccess) {
      navigate(`/dashboard/transactions/inbox/${userId}`);
    }
  });
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
