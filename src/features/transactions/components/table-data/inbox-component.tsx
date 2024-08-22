import { DataTable } from "@/components/data-table";
import { useParams } from "react-router-dom";
import { inboxColumn } from "../table-columns/inbox-column";
import { useTransactions } from "../../hooks/query-gate";
import { transactionData } from "../../schema/TransactionSchema";
import { z } from "zod";

export const InboxComponent = () => {
  const { id } = useParams();
  const { entities } = useTransactions(
    "incoming-transaction",
    `/v2/${id}/transactions?option=INBOX`
  );

  if (entities.isFetching) return "loading....";
  const validateData = z.array(transactionData).safeParse(entities.data);

  if (!validateData.success || !validateData.data) return "Something went wrong ! ";
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">
          Inbox
        </h1>
        <p className="text-muted-foreground text-[12px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing.
        </p>
      </div>
      <DataTable columns={inboxColumn} data={validateData.data} />
    </div>
  );
};
