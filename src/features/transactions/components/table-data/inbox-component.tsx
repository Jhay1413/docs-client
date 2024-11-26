import { DataTable } from "@/components/data-table";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { inboxColumn } from "../table-columns/inbox-column";
import { z } from "zod";
import { tsr } from "@/services/tsr";
import { transactionTable } from "shared-contract";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";

export const InboxComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Adjust the delay as needed

  const { id } = useParams();
  console.log(id);
  const { data } = tsr.transaction.fetchTransactionsV2.useQuery({
    queryKey: ["inbox-transactions", page, debouncedSearchQuery],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        status: "INBOX",
        page: page,
        pageSize: "10",
        userId: id,
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
  const handleOnClickRow = (data: any) => {
    // Navigate to ticket details page when a row is clicked
    navigate(`/dashboard/transactions/history/${data.id}`, { state: { from: location.pathname } }); // Pass the current location as state
  };

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center w-full pb-4">
          <div className="flex justify-start w-full flex-col ">
            <h1 className="text-[#404041] font-medium text-[28px]">Inbox</h1>
            <p className="text-muted-foreground text-[12px]">Stay updated with the latest messages and notifications here.</p>
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

        <DataTable columns={inboxColumn} data={data ? data.body.data : []} callbackFn={handleOnClickRow} isSticky={true} />

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
    </div>
  );
};
