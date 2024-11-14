import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { useDebounce } from "use-debounce";
import { tsr } from "@/services/tsr";
import { useNotificationStore } from "@/global-states/notification-store";
import { toast } from "react-toastify";
import { ticketsIncomingColumn } from "./ticket-incoming-columns";
import { keepPreviousData } from "@tanstack/react-query";
import { ticketingTableSchema } from "shared-contract";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { Button } from "@/components/ui/button";
import { Search, SquareChevronDown, SquareChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterOptions } from "../filter-options";

export const IncomingTicketComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const id = getCurrentUserId();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore((state) => state.setNotification);
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const projectId = searchParams.get("projectId") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const priority = searchParams.get("priority") || "";
  const status = searchParams.get("status") || "";
  const assigneeId = searchParams.get("assigneeId") || "";
  const senderId = searchParams.get("senderId") || "";

  const { data, isError, error, refetch } = tsr.ticketing.getTickets.useQuery({
    queryKey: ["tickets-incoming", page, debouncedSearchQuery, sortOrder],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        state: "INCOMING",
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

  const { mutate } = tsr.ticketing.receiveTickets.useMutation({
    onMutate: (data) => {
      toast.success("Ticket Received!");
      tsrQueryClient.ticketing.getTickets.setQueryData(["ticket-incoming", page, debouncedSearchQuery], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: {
            ...old.body,
            data: old.body.data.filter((ticket) => ticket.id !== data.params.id),
          },
        };
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["tickets-incoming", page, debouncedSearchQuery] });
    },
  });

  const incomingColumns = ticketsIncomingColumn(mutate);

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
        prev.set("currentPage", previousPage); // Decrement the page
        return prev;
      });
    }
  };

  const toggleSortOrder = () => {
    setSearchParams((prev) => {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      prev.set("sortOrder", newSortOrder);
      prev.set("currentPage", "1"); // Reset to first page on sort change
      return prev;
    });
  };

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg">
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center w-full pb-4">
        <div className="flex justify-start w-full flex-col">
          <h1 className="text-[#404041] font-medium text-[28px]">Incoming Tickets</h1>
          <p className="text-muted-foreground text-[12px]">
            All your new tickets will appear here. Stay informed and don't miss any updates.
          </p>
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="flex m-1 text-gray-700 gap-1">
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              size="icon"
              className=""
              title={sortOrder === "asc" ? "Sort by ascending order" : "Sort by descending order"}
            >
              {sortOrder === "asc" ? <SquareChevronUp /> : <SquareChevronDown />}
            </Button>
            <FilterOptions setSearchParams={setSearchParams} refetch={refetch} />
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
                { replace: true }
              )
            }
            className="w-[289px] rounded-none rounded-l-md"
          />
              <button className="p-2 bg-primaryColor text-white rounded-r-md">
                <Search />
              </button>
        
        </div>
        </div>
        
      
        <DataTable columns={incomingColumns} data={data ? data.body.data : []}  />
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
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={data?.body.totalPages === 0 || data?.body.totalPages === parseInt(page)}>
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
