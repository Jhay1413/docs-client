import { DataTable } from "@/components/data-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ticketsInboxColumn } from "./ticket-inbox-columns";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search, SquareChevronUp, SquareChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";
import { tsr } from "@/services/tsr";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { FilterOptions } from "../filter-options";
import { ClipLoader } from "react-spinners";

export const TicketInboxComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
    sortOrder: "asc",
    projectId: "",
    transactionId: "",
    priority: "",
    status: "",
    assigneeId: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const projectId = searchParams.get("projectId") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const priority = searchParams.get("priority") || "";
  const status = searchParams.get("status") || "";
  const assigneeId = searchParams.get("assigneeId") || "";
  const senderId = searchParams.get("senderId") || "";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const id = getCurrentUserId();

  // Fetch tickets with sorting
  const { data, isError, error, refetch ,isFetching} = tsr.ticketing.getTickets.useQuery({
    queryKey: ["tickets-inbox", page, debouncedSearchQuery, sortOrder],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        state: "INBOX",
        page: page,
        pageSize: "10",
        userId: id,
        sortOrder: sortOrder,
        projectId: projectId,
        transactionId: transactionId,
        priority: priority,
        status: status,
        senderId: senderId,
      },
    },
    placeholderData: keepPreviousData,
  });
  
  const toggleSortOrder = () => {
    setSearchParams((prev) => {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      prev.set("sortOrder", newSortOrder);
      prev.set("currentPage", "1"); // Reset to first page on sort change
      return prev;
    });
  };

  const handleNextPage = () => {
    setSearchParams((prev) => {
      const nextPage = (intPage + 1).toString();
      prev.set("currentPage", nextPage);
      return prev;
    });
  };

  const handlePreviousPage = () => {
    if (intPage > 1) {
      setSearchParams((prev) => {
        const previousPage = (intPage - 1).toString();
        prev.set("currentPage", previousPage);
        return prev;
      });
    }
  };

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center w-full pb-4">
          <div className="flex justify-start w-full flex-col">
            <h1 className="text-[#404041] font-medium text-[28px]">Inbox</h1>
            <p className="text-muted-foreground text-[12px] truncate">Use the Tickets Inbox to efficiently track and manage your workload, ensuring no ticket goes unnoticed.</p>
          </div>

          <div className="flex items-center justify-end w-full">
            <div className="flex m-1 text-gray-700 gap-1">
              {/* Sort Button */}
              <Button
                variant="outline"
                onClick={toggleSortOrder}
                size="icon"
                className=""
                title={sortOrder === "asc" ? "Sort by ascending order" : "Sort by descending order"}
              >
                {sortOrder === "asc" ? <SquareChevronUp /> : <SquareChevronDown />}
              </Button>
              <FilterOptions setSearchParams={setSearchParams} refetch={refetch} isSubmitting={isFetching}/>
            </div>
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
              className="w-[289px] rounded-none rounded-l-md"
            />
            <button className="p-2 bg-primaryColor text-white rounded-r-md">
              <Search />
            </button>
          </div>
        </div>
        
        <div className="w-full">
          {isFetching ? (
            <div className="flex justify-center items-center py-10">
              <ClipLoader size={30} color="#4a90e2" />
            </div>
          ) : (
            <DataTable columns={ticketsInboxColumn} data={data ? data.body.data : []} />
          )}
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="text-muted-foreground">
            <h1>Number of Tickets: {data?.body.numOfTickets}</h1>
          </div>
          <div className="flex items-center space-x-2 py-4">
            <Button variant="outline" size="sm" disabled={intPage === 1}>
              {"<<"}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={intPage === 1}>
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
            <Button variant="outline" size="sm">
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
