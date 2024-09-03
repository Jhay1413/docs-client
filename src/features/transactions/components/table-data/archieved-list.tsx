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
    <div className="flex flex-col ">
       <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">
          List of Archive Transactions
        </h1>
        <p className="text-muted-foreground text-[12px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing.
        </p>
      </div>
      
        
      </div>
      <DataTable columns={archivedColumn} data={validateData.data} hasSearch={true} />
    </div>
  );
};
