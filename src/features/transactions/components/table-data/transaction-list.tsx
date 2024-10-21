import { DataTable } from "@/components/data-table";
import { transColumns } from "../table-columns/transaction-columns";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import withRole from "@/components/HOC/component-permission";
import { tsr } from "@/services/tsr";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";
import { z } from "zod";
import { transactionTable } from "shared-contract";
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Adjust the delay as needed

  const { data, isError, error } = tsr.transaction.fetchTransactionsV2.useQuery({
    queryKey: ["transactions", page, debouncedSearchQuery],
    queryData: {
      query: {
        query: debouncedSearchQuery,

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

  const handleOnClickRow = (data: z.infer<typeof transactionTable>) => {
    navigate(`/dashboard/transactions/history/${data.id}`);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">List of Transactions</h1>
        <p className="text-muted-foreground text-[12px]">Review the details below to track and manage recent activities.</p>
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
              { replace: true },
            )
          }
          className="w-[289px] rounded-none  rounded-l-md"
        />
        <button className="p-2 bg-primaryColor text-white rounded-r-md ">
          <Search />
        </button>
      </div>
      <DataTable columns={transColumns} data={data ? data.body.data : []} callbackFn={handleOnClickRow} />
      <div className="w-full flex justify-between items-center">
        <div className="text-muted-foreground">
          <h1>Number of Transactions: {data?.body.numOfTransactions}</h1>
        </div>
        <div className="flex items-center space-x-2 py-4">
          <Button variant="outline" size="sm" disabled={parseInt(page) == 1}>
            {"<<"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={intPage == 1}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={data?.body.totalPages === 0 || data?.body.totalPages === parseInt(page)}
          >
            Next
          </Button>
          <Button variant="outline" size="sm" disabled={data?.body.totalPages === 0 || data?.body.totalPages === parseInt(page)}>
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
};
