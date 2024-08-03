import { DataTable } from "@/components/data-table";
import { useTransaction, useTransactions } from "../../hooks/query-gate";
import { z } from "zod";
import {
  archievedTransaction,
  completeStaffWork,
} from "../../schema/TransactionSchema";
import { cswColumn } from "../table-columns/csw-column";
import { CompleStaffWorkDialog } from "../../forms/csw-form-2";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { archievedColumn } from "../table-columns/archieved-column";

export const ArchievedList= () => {
  const { entities } = useTransactions("archieved-list", "/v2/archieved");

  if (entities.isLoading) return "Loading";

  if (!entities.isSuccess) return "something went wrong";

  const validateData = z.array(archievedTransaction).safeParse(entities.data);

  if (!validateData.data || !validateData.success) return "Error data ! ";

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={archievedColumn} data={validateData.data} />
    </div>
  );
};
