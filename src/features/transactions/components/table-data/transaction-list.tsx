import { DataTable } from "@/components/data-table";
import { transactionColumns } from "../table-columns/transaction-columns";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import withRole from "@/components/HOC/component-permission";
import { tsr } from "@/services/tsr";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";
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
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Adjust the delay as needed

  const { data: searchData } = tsr.transaction.searchTransactions.useQuery({
    queryKey: ["transactions", page, debouncedSearchQuery],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        status: "ON-PROCESS",
        page: page,
        pageSize: "10",
      },
    },
    placeholderData: keepPreviousData,
  });


  const handleNextPage = () => {
    setSearchParams((prev) => {
      const nextPage = (intPage + 1).toString();
      prev.set("currentPage", nextPage); // Increment the page
      return prev;
    });
  };

  const handlePreviousPage = () => {
    if (intPage > 1) {
      setSearchParams((prev) => {
        const previousPage = (intPage - 1).toString();
        prev.set("currentPage", previousPage); // Decrement the page
        return prev;
      });
    }
  };
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
      <div className="flex items-center py-4 justify-end w-full ">
        <Input
          placeholder="Search ...."
          defaultValue={debouncedSearchQuery}
          onChange={(e) =>
            setSearchParams(
              (prev) => {
                prev.set("search", e.target.value);
                prev.set("currentPage", "1");
                return prev;
              },
              { replace: true }
            )
          }
          className="w-[289px] rounded-none  rounded-l-md"
        />
        <button className="p-2 bg-primaryColor text-white rounded-r-md ">
          <Search />
        </button>
      </div>
      <DataTable
        columns={transactionColumns}
        data={searchData ? searchData.body! : []}
      ></DataTable>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm">
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={intPage == 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          // Disable if on the first page
        >
          Next
        </Button>
        <Button variant="outline" size="sm">
          {">>"}
        </Button>
      </div>
    </div>
  );
};
