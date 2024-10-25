import { DataTable } from "@/components/data-table";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ticketsColumn } from "./tickets-column";
import { tsr } from "@/services/tsr";
import { keepPreviousData } from "@tanstack/react-query";

// Add the button component here
const AddTicketBtn = () => (
  <div>
    <Link
      to="/dashboard/tickets/add-form"
      className="bg-[#414140] px-4 py-2 text-lg flex items-center justify-center space-x rounded-lg text-white"
    >
      <Plus size={24} />
      <h1>Add Ticket</h1>
    </Link>
  </div>
);

// const dummyData = [
//   {
//     ticketId: "asdf",
//     subject: "asdf",
//     section: "asdf",
//     division: "asdf",
//     status: "asdf",
//     requestDetails: "asdf",
//     remarks: "asdf",
//     priority: "Aasdf",
//     createdAt: "asdf",
//     dueDate: "asdf",
//   },
//   // Add more dummy data as needed
// ];

export const TicketList = () => {
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
    navigate(`/dashboard/tickets/history/${data.id}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full flex-col">
          <h1 className="text-[#404041] font-medium text-[28px]">
            List of Tickets
          </h1>
          <p className="text-muted-foreground text-[12px]">
            View and manage all support tickets.
          </p>
        </div>
      </div>
      <div className="flex items-center py-4 justify-between w-full">
        <div className="flex w-full relative">
          <AddTicketBtn />
        </div>
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

      <DataTable
        columns={ticketsColumn}
        data={data ? data.body : []}
        callbackFn={handleOnClickRow}
      />
      <div className="flex items-center w-full justify-center space-x-2 py-4">
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
  );
};