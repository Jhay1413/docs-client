import { DataTable } from "@/components/data-table";
import { useTransactions } from "../../hooks/query-gate";
import { z } from "zod";
import {
  archivedTransaction
} from "../../schema/TransactionSchema";
import { archivedColumn } from "../table-columns/archieved-column";

export const ArchivedList= () => {
  const { entities } = useTransactions("archieved-list", "/v2/archived");

  if (entities.isLoading) return "Loading";

  if (!entities.isSuccess) return "something went wrong";

  const validateData = z.array(archivedTransaction).safeParse(entities.data);

  if (!validateData.data || !validateData.success) return "Error data ! ";

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={archivedColumn} data={validateData.data} />
    </div>
  );
};
