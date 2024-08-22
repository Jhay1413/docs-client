import { DataTable } from "@/components/data-table";
import { transactionColumns } from "../table-columns/transaction-columns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTransactions } from "../../hooks/query-gate";
import { z } from "zod";
import { transactionData } from "../../schema/TransactionSchema";
import PermissionsGate from "@/components/permissionGate/permission-gate";
import { SCOPES } from "@/components/permissionGate/permission-map";

export const TransactionList = () => {
  const { entities } = useTransactions("transactions", "/v2");

  if (entities.isLoading) return <div>Loading...</div>;
  console.log(entities.data);
  if (!entities.data) return <div>No data</div>;

  const validatedData = z.array(transactionData).safeParse(entities.data);

  if (!validatedData.success) console.log(validatedData.error.errors);

  if (!validatedData.data) return "";

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">
          List of Transactions
        </h1>
        <p className="text-muted-foreground text-[12px]">
        Review the details below to track and manage recent activities.
        </p>
      </div>
      <div className="flex  bg-black w-full relative">
        <PermissionsGate scopes={[SCOPES.canCreate]}>
          <div className="absolute bottom-0 top-4">
            <Link
              to="/dashboard/transactions/transaction-form"
              className="bg-[#414140] px-4 py-2 text-lg flex  items-center justify-center space-x rounded-lg text-white"
            >
              <Plus size={24} />
              <h1>Add Transaction</h1>
            </Link>
          </div>
        </PermissionsGate>
      </div>
      <DataTable
        columns={transactionColumns}
        data={validatedData.data}
      ></DataTable>
    </div>
  );
};
