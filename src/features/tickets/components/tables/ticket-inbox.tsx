import { DataTable } from "@/components/data-table";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ticketsInboxColumn } from "./ticket-inbox-columns"; // Import the tickets inbox column
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";
import { tsr } from "@/services/tsr";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract";

export const TicketInboxComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });

  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";

  const intPage = parseInt(page, 10);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Adjust the delay as needed

  const { id } = useParams(); // Assuming `id` is the user ID or relevant identifier
  console.log(id);

  // Fetch tickets instead of transactions
  const { data, isError, error } = tsr.ticketing.getTicketsForUserByStatus.useQuery({
    queryKey: ["tickets", page, debouncedSearchQuery],
    queryData: {
      params: {id:id!},
      query: {
        query: debouncedSearchQuery,
        status: "inbox",
        page: page,
        pageSize: "10",
      },
    },
    placeholderData: keepPreviousData,
  });

  console.log(data);

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

  const handleOnClickRow = (data: z.infer<typeof ticketingTableSchema>) => {
    navigate(`/dashboard/tickets/details/${data.id}`); // Navigate to ticket details page
  };

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center w-full pb-4"> 
                <div className="flex justify-start w-full flex-col ">
                    <h1 className="text-[#404041] font-medium text-[28px]">Inbox</h1>
                    <p className="text-muted-foreground text-[12px]">Stay updated with the latest tickets here.</p>
                </div>

              <div className="flex items-center justify-end w-full">
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

      <DataTable
        columns={ticketsInboxColumn}
        data={data ? data.body : []}
        callbackFn={handleOnClickRow}
      />

      
      <div className="w-full flex justify-between items-center">
        <div className="text-muted-foreground">
            <h1>Number of Tickets: {}</h1>
        </div>
        <div className="flex items-center space-x-2 py-4">
          <Button variant="outline" size="sm" disabled={intPage === 1}>
            {"<<"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={intPage === 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPage}>
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