import { useParams } from "react-router-dom";
import { useTransactions } from "../../hooks/query-gate";
import { DataTable } from "@/components/data-table";
import {
  transactionData,
  transactionFormData,
} from "../../schema/TransactionSchema";
import { z } from "zod";
import { incomingColumns } from "../table-columns/incoming-column";
import { useNotificationStore } from "@/global-states/notification-store";

import { useEffect } from "react";
import { useReadAllNotifications } from "@/hooks/use-custom-query";


export const IncomingComponent = () => {
  const { id } = useParams();
  const { setAllNotification } = useNotificationStore();
  const { entities } = useTransactions(
    "incoming-transaction",
    `/v2/${id}/transactions?option=INCOMING`
  );
  const {mutate,isSuccess,data} = useReadAllNotifications();

  useEffect(()=>{
    if (isSuccess && data) {
      setAllNotification(data);
    } else {
      mutate();
    }
  },[isSuccess])
  if (entities.isLoading) {
    return <h1>Loading..</h1>;
  }
  const validatedData = z.array(transactionData).safeParse(entities.data);

  if (!validatedData.success) {
    return "Invalid Data!";
  }

  return (
    <div className="flex flex-col gap-y-4 ">
      <h1 className="text-4xl">Incoming Transaction</h1>
      <DataTable columns={incomingColumns} data={validatedData.data} />
    </div>
  );
};
