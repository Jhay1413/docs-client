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
import { tsr } from "@/services/tsr";
import {
  transactionMutationSchema,
  transactionQueryData,
} from "shared-contract";
import { toast } from "react-toastify";

export const TransactionUpdateComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
  const { id } = useParams();
  const userId = getCurrentUserId();

  const { data, isLoading } = tsr.transaction.fetchTransactionById.useQuery({
    queryKey: ["transactions", id],
    queryData: { params: { id: id! } },
  });
  const { data: companies, isPending } = tsr.company.fetchCompanies.useQuery({
    queryKey: ["companies"],
  });

  const { mutate, mutateAsync ,isSuccess} = tsr.transaction.updateTransaction.useMutation(
    {
      onMutate: (data) => {
        const lastGoodKnown =
          tsrQueryClient.transaction.searchTransactions.getQueryData([
            "transactions",
          ]);

        tsrQueryClient.transaction.searchTransactions.setQueryData(
          ["transactions"],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              body: [...old.body, data.body],
            };
          }
        );

        return { lastGoodKnown };
      },
      onSuccess: () => {
        toast.success("Data submitted successfully ! ");
      },
      onError: (error, newPost, context) => {
        tsrQueryClient.transaction.searchTransactions.setQueryData(
          ["transactions", id],
          context?.lastGoodKnown
        );
        toast.error("Something went wrong, Please retry ! ");
      },
      onSettled: () => {
        tsrQueryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    }
  );
  // const { entity, update } = useTransaction({
  //   key: "inbox",
  //   url: `v2/${id}`,
  //   id,
  //   method: "UPDATEREMOVE",
  // });
  const navigate = useNavigate();

  const mutateFn = async (
    transactionData: z.infer<typeof transactionMutationSchema>,
    setIsSubmitting: (value: boolean) => void
  ) => {
    const attachments = transactionData.attachments?.filter(
      (data) => data.file?.length! > 0
    );

    if (!attachments || attachments.length === 0)
      return mutate({
        params: { id: id! },
        body: transactionData,
      });

    const selectedCompany = companies?.body?.find(
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
      if (payload.status === "ARCHIVED") {
        payload = { ...payload, receiverId: null };
      }
      await mutateAsync({
        params: { id: id! },
        body: transactionData,
      });

      if (isPending) {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    async function isSubmitted() {
      if (isSuccess) {
        setNotification({
          incoming: notification?.incoming !== 0 ? notification?.incoming! : 0,
          inbox: notification?.inbox! - 1,
        });
        navigate(`/dashboard/transactions/inbox/${userId}`);
      }
    }
    isSubmitted();
  }, [isSuccess]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        company={companies ? companies.body : null}
        method="UPDATE"
        mutateFn={mutateFn}
        defaultValue={data?.body}
      />
     
    </div>
  );
};
