import { DataTable } from "@/components/data-table";
import { useParams } from "react-router-dom";
import { inboxColumn } from "../table-columns/inbox-column";
import { useTransactions } from "../../hooks/query-gate";
import { transactionData } from "../../schema/TransactionSchema";
import { z } from "zod";

export const InboxComponent = () => {
  const { id } = useParams();
  const { entities } = useTransactions("inbox", `/temp/${id}?option=INBOX`);

  if (entities.isFetching) return "loading....";
  const validateData = z.array(transactionData).safeParse(entities.data);

  if (!validateData.success || !validateData.data) return "Something went wrong ! ";
  return (
    <div className="flex flex-col gap-y-6">
      <span>
        <h1>Inbox</h1>
      </span>

      <DataTable columns={inboxColumn} data={validateData.data} />
    </div>
  );
};
