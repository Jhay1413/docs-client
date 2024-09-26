import { DataTable } from "@/components/data-table";
import { transactionColumns } from "../table-columns/transaction-columns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import withRole from "@/components/HOC/component-permission";
import { tsr } from "@/services/tsr";
import { useState } from "react";

const addTransactionBtn = () => (
  <div className="flex  bg-black w-full relative">
    <div className="absolute bottom-0 top-4">
      <Link
        to="/dashboard/transactions/transaction-form"
        className="bg-[#414140] px-4 py-2 text-lg flex  items-center justify-center space-x rounded-lg text-white"
      >
        <Plus size={24} />
        <h1>Add Transaction</h1>
      </Link>
    </div>
  </div>
);

const AddTransactionBtnWithRole = withRole(addTransactionBtn);

export const TransactionList = () => {
  // const { entities } = useTransactions("transactions", "/v2");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allTransaction, isPending: allIsPending } =
    tsr.transaction.fetchTransactions.useQuery({
      queryKey: ["transactions"],
      enabled: !searchQuery,
    });

  const { data: searchData, isPending: searchIsPending } =
    tsr.transaction.searchTransactions.useQuery({
      queryKey: ["searchTransactions", searchQuery],
      queryData:{
        params:{
          query:searchQuery
        }
      },
      enabled: !!searchQuery
      
    });
  if (allIsPending || searchIsPending) return <div>Loading...</div>;
  if (!allTransaction || !searchData) return <div>No data</div>;

  const data = searchQuery ? searchData : allTransaction
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
      <AddTransactionBtnWithRole roles={["SUPERADMIN", "RECORDS"]} />

      <DataTable
        columns={transactionColumns}
        data={data.body!}
        hasSearch={true}
      ></DataTable>
    </div>
  );
};
