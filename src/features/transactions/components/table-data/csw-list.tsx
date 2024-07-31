import { DataTable } from "@/components/data-table";
import { useTransaction } from "../../hooks/query-gate";
import { z } from "zod";
import { completeStaffWork } from "../../schema/TransactionSchema";
import { cswColumn } from "../table-columns/csw-column";
import { CompleStaffWorkDialog } from "../../forms/csw-form-2";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";

type Props = {
  transactionId: string;
  data: z.infer<typeof completeStaffWork>[];
};

export const CswComponent = ({ transactionId, data }: Props) => {
  const role = useCurrentUserRole();

  return (
    <div className="flex flex-col gap-4">
      {role === "CH" && (
        <div className="">
          <CompleStaffWorkDialog transactionId={transactionId} />
        </div>
      )}
      <DataTable columns={cswColumn} data={data} />
    </div>
  );
};
