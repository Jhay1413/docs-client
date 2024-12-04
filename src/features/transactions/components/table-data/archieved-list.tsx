import { DataTable } from "@/components/data-table";
import { archivedColumn } from "../table-columns/archieved-column";
import { useDebounce } from "use-debounce";
import { tsr } from "@/services/tsr";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { transactionQueryData, transactionTable } from "shared-contract";

export const ArchivedList = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const handleOnClickRow = (data: any) => {
    navigate(`/dashboard/transactions/history/${data.id}`, { state: { from: location.pathname } }); // Pass the current location as state
  };
  
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data: searchData } = tsr.transaction.fetchTransactionsV2.useQuery({
    queryKey: ["archived-transaction", page, debouncedSearchQuery],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        status: "ARCHIVED",
        page: page,
        pageSize: "10",
      },
    },

    // Enable when the debounced search query is present
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
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center w-full pb-4">
          <div className="flex justify-start w-full flex-col ">
            <h1 className="text-[#404041] font-medium text-[28px]">List of Archive Transactions</h1>
            <p className="text-muted-foreground text-[12px]">View and manage all past transactions stored in the archive.</p>
          </div>
        
          <div className="flex items-center justify-end w-full ">
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
        </div>

      <DataTable columns={archivedColumn} data={searchData ? searchData.body.data! : []} callbackFn={handleOnClickRow} />
        <div className="w-full flex justify-between items-center">
          <div className="text-muted-foreground">
            <h1>Number of Transactions: {searchData?.body.numOfTransactions}</h1>
          </div>
          <div className="flex items-center space-x-2 py-4">
            <Button variant="outline" size="sm">
              {"<<"}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={intPage == 1}>
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
        
      </div>
    </div>
  );
};
