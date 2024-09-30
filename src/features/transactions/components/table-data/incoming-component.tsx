import { useParams } from "react-router-dom";
import { useTransactions } from "../../hooks/query-gate";
import { DataTable } from "@/components/data-table";
import { transactionData, transactionFormData } from "../../schema/TransactionSchema";
import { z } from "zod";

import { useNotificationStore } from "@/global-states/notification-store";

import { useEffect } from "react";
import { useReadAllNotifications } from "@/hooks/use-custom-query";
import { tsr } from "@/services/tsr";
import { useColumns } from "../table-columns/incoming-column";
import { toast } from "react-toastify";

export const IncomingComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const { id } = useParams();
  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore((state) => state.setNotification);
  const { mutateAsync } = tsr.transaction.receivedTransaction.useMutation({
    onSuccess: (data) => {
      setNotification({
        ...notification,
        incoming: notification?.incoming === 0 ? 0 : notification?.incoming! - 1,
        inbox: notification?.inbox! + 1,
      });
      tsrQueryClient.transaction.getTransactionByParams.setQueryData(["incoming-transactions"], (old) => {
        if (!old || !old.body) return old; // Ensure old data exists

        // Define the ID of the transaction you want to remove

        return {
          ...old,
          body: old.body.filter((transaction) => transaction.id !== data.body.id), // Filter out the transaction
        };
      });
      toast.success("Transaction Received !");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const incomingColumns = useColumns(mutateAsync);

  const { data, isLoading } = tsr.transaction.getTransactionByParams.useQuery({
    queryKey: ["incoming-transactions"],
    queryData: {
      query: {
        status: "INCOMING",
        accountId: id!,
      },
    },
  });

  // const { mutate, isSuccess, data } = useReadAllNotifications();

  // useEffect(() => {
  //   if (isSuccess && data) {
  //     setAllNotification(data);
  //   } else {
  //     mutate();
  //   }
  // }, [isSuccess]);
  // if (entities.isLoading) {
  //   return <h1>Loading..</h1>;
  // }
  // const validatedData = z.array(transactionData).safeParse(entities.data);

  // if (!validatedData.success) {
  //   console.log(validatedData.error.errors);
  //   return "Invalid Data!";
  // }

  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">Incoming</h1>
        <p className="text-muted-foreground text-[12px]">
          All your new messages and notifications will appear here. Stay informed and don't miss any updates.
        </p>
      </div>
      <DataTable columns={incomingColumns} data={data ? data.body : []} />
    </div>
  );
};
