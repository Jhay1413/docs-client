import { DataTable } from "@/components/data-table";
import { useParams } from "react-router-dom";
import { inboxColumn } from "../table-columns/inbox-column";
import { useTransactions } from "../../hooks/query-gate";
import { transactionData } from "../../schema/TransactionSchema";
import { z } from "zod";
import { tsr } from "@/services/tsr";

export const InboxComponent = () => {
  const { id } = useParams();
  const { data, isLoading } = tsr.transaction.getTransactionByParams.useQuery({
    queryKey: ["inbox-transactions"],
    queryData: {
      query: {
        status: "INBOX",
        accountId: id!,
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">Inbox</h1>
        <p className="text-muted-foreground text-[12px]">Stay updated with the latest messages and notifications here.</p>
      </div>
      <DataTable columns={inboxColumn} data={data ? data.body : []} />
    </div>
  );
};
