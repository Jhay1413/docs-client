import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { signedUrlDataArray } from "../schema/TransactionSchema";
import { z } from "zod";
import { TransactionForm } from "../forms/transaction-form";
import { prepare_file_payload, prepare_transaction_payload } from "../utils/pre-process-data";
import { getSignedUrl } from "../services/getSignedUrl";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";
import { useNotificationStore } from "@/global-states/notification-store";
import { tsr } from "@/services/tsr";
import { transactionMutationSchema } from "shared-contract";
import { toast } from "react-toastify";

export const TransactionUpdateComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore((state) => state.setNotification);
  const { id } = useParams();
  const userId = getCurrentUserId();

  const { data, isLoading } = tsr.transaction.fetchTransactionById.useQuery({
    queryKey: ["transactions", id],
    queryData: { params: { id: id! } },
  });
  const { data: companies, isPending } = tsr.company.fetchCompanies.useQuery({
    queryKey: ["companies"],
  });

  const { mutate, mutateAsync } = tsr.transaction.updateTransaction.useMutation({
    onMutate: (data) => {
      const lastGoodKnown = tsrQueryClient.transaction.fetchTransactionsV2.getQueryData(["inbox-transactions"]);
      tsrQueryClient.transaction.getTransactionByParams.setQueryData(["inbox-transactions"], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: old.body.filter((transaction) => transaction.id !== data.body.id), // Filter out the transaction
        };
      });
      return { lastGoodKnown };
    },
    onSuccess: () => {
      toast.success("Data submitted successfully ! ");
      setNotification({
        incoming: notification?.incoming !== 0 ? notification?.incoming! : 0,
        inbox: notification?.inbox !== 0 ? notification?.inbox! - 1 : 0,
      });
      navigate(`/dashboard/transactions/inbox/${userId}?currentPage=${page}&search=${searchQuery}`);
    },
    onError: (error, newPost, context) => {
      tsrQueryClient.transaction.fetchTransactionsV2.setQueryData(["inbox-transactions", id], context?.lastGoodKnown);
      toast.error("Something went wrong, Please retry ! ");
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const mutateFn = async (transactionData: z.infer<typeof transactionMutationSchema>, setIsSubmitting: (value: boolean) => void) => {
    const attachments = transactionData.attachments.map(({ file, ...newData }) => newData);
    var payload = {
      ...transactionData,
      attachments: attachments,
    };

    if (payload.status === "ARCHIVED") {
      payload = { ...payload, receiverId: null };
    }
    await mutateAsync({
      params: { id: id! },
      body: payload,
    });

    if (isPending) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm company={companies ? companies.body : null} method="UPDATE" mutateFn={mutateFn} defaultValue={data?.body} />
    </div>
  );
};
