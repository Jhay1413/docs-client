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
import { useNotificationStore } from "@/global-states/notification-store";

export const TransactionUpdateComponent = () => {
  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
 
  // const refetch = useNotificationStore((state) => state.refetch);
  const { id } = useParams();
  const userId = getCurrentUserId();
  const { entities } = useCompanies("companies", "");
  const { entity, update } = useTransaction({
    key: "inbox",
    url: `v2/${id}`,
    id,
    method: "UPDATEREMOVE",
  });
  const navigate = useNavigate();

  console.log(entity.data);
  const validatedData = transactionData.safeParse(entity.data);
  if (!validatedData.data || validatedData.error)
    console.log(validatedData.error.errors);
  //For review !! temporarily separated the update and add component  with the same logic
  const mutateFn = async (
    transactionData: z.infer<typeof transactionFormData>,
    setIsSubmitting: (value: boolean) => void
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
      let payload = prepare_transaction_payload(transactionData, res);
      if(payload.status === "ARCHIVED") {
       payload  = {...payload , receiverId : null}
      }
      await update.mutateAsync(payload);

      if (!update.isPending) {
        setIsSubmitting(false);
      }

    }
  };

  useEffect(() => {
    if (update.isSuccess) {
       
      if (notification) {
        setNotification({ ...notification, inbox: notification?.inbox - 1 });
      }
      navigate(`/dashboard/transactions/inbox/${userId}`);
    }
  }, [update.isSuccess]);
  if (entity.isLoading || entities.isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        company={entities.data}
        method="UPDATE"
        mutateFn={mutateFn}
        defaultValue={validatedData.data}
      />
    </div>
  );
};
