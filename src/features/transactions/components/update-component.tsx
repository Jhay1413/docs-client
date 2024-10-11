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
      const lastGoodKnown = tsrQueryClient.transaction.fetchTransactions.getQueryData(["transactions"]);
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
      tsrQueryClient.transaction.fetchTransactions.setQueryData(["transactions", id], context?.lastGoodKnown);
      toast.error("Something went wrong, Please retry ! ");
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const mutateFn = async (transactionData: z.infer<typeof transactionMutationSchema>, setIsSubmitting: (value: boolean) => void) => {
    const attachments = transactionData.attachments?.filter((data) => data.file?.length! > 0);

    if (!attachments || attachments.length === 0)
      return mutate({
        params: { id: id! },
        body: transactionData,
      });

    const selectedCompany = companies?.body?.find((company) => transactionData.companyId === company.id);

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

      let payload = prepare_transaction_payload(transactionData, res);
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
    }
  };
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm company={companies ? companies.body : null} method="UPDATE" mutateFn={mutateFn} defaultValue={data?.body} />
    </div>
  );
};
