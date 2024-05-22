import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./transaction-columns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTransactions } from "../hooks/TransactionHook";

export const TransactionList = () => {
    const { data, isLoading, isError } = useTransactions();

    console.log(data);
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (isError) {
      return <div>Error...</div>;
    }
    if (!data) {
      return <div>No Data</div>;
    }
    console.log(data);
    return (
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full text-4xl">
          <h1>List of Transactions</h1>
        </div>
        <div className="justify-start w-full flex mt-12 ">
          <Link
            to="/dashboard/userForm"
            className="bg-black px-4 py-2 text-lg flex  items-center justify-center space-x-2 rounded-lg text-white"
          >
            <Plus size={24} />
            <h1>New Transaction</h1>
          </Link>
        </div>
        <DataTable columns={transactionColumns} data={data}></DataTable>
      </div>
    );
  };
