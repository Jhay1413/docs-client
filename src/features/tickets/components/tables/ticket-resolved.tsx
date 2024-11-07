import { DataTable } from "@/components/data-table";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ticketsColumn } from "./ticket-column"; 
import { tsr } from "@/services/tsr";
import { keepPreviousData } from "@tanstack/react-query";
import { ticketsResolvedColumn } from "./ticket-resolved-column";


export const TicketResolved = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";
  const intPage = parseInt(page, 10);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { data, isError, error } = tsr.ticketing.getTickets.useQuery({
    queryKey: ["tickets", page, debouncedSearchQuery],
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

  const handleOnClickRow = (data: any) => {
    // Navigate to ticket details page when a row is clicked
    navigate(`/dashboard/tickets/details/${data.id}`);
  };

  return (
    <div className="min-h-full flex flex-col w-full items-center justify-start p-4 bg-white rounded-lg">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start w-full flex-col">
            <h1 className="text-[#404041] font-medium text-[28px]">
              List of Tickets
            </h1>
            <p className="text-muted-foreground text-[12px]">
              View and manage all support tickets.
            </p>
          </div>
        
          <div className="flex items-centerl">
            <div className="flex items-center">
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
        </div>

        <DataTable
          columns={ticketsResolvedColumn}
          data={data ? data.body : []}
          callbackFn={handleOnClickRow}
        />
        <div className="flex items-center w-full justify-center space-x-2 py-4">
          <div className="text-muted-foreground">
            <h1>Number of Tickets: {}</h1>
          </div>
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
        {/* Add the button here */}

      </div>
    </div>
  );
};