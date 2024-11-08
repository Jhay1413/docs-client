import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { useDebounce } from "use-debounce";
import { tsr } from "@/services/tsr";
import { useNotificationStore } from "@/global-states/notification-store";
import { toast } from "react-toastify";
import { ticketsIncomingColumn } from "./ticket-incoming-columns";
import { keepPreviousData } from "@tanstack/react-query";
import { ticketingTableSchema } from "shared-contract";

export const IncomingTicketComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const { id } = useParams();
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

  const { data, isError, error } = tsr.ticketing.getTicketsForUserByStatus.useQuery({
    queryKey: ["tickets", page, debouncedSearchQuery],
    queryData: {
      params: {id:id!},
      query: {
        query: debouncedSearchQuery,
        status: "incoming",
        page: page,
        pageSize: "10",
      },
    },
    placeholderData: keepPreviousData,
  });

  const { mutate } = tsr.ticketing.receiveTickets.useMutation({
    onMutate: (data) => {
      tsrQueryClient.ticketing.getTicketsForUserByStatus.setQueryData(["tickets", page, debouncedSearchQuery], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: {
            ...old.body,
            data: old.body.filter((ticket) => ticket.id !== data.params.id), // Filter out the ticket being mutated
          },
        };
      });
    },
    onSuccess: () => {
      setNotification({
        ...notification,
        incoming: notification?.incoming === 0 ? 0 : notification?.incoming! - 1,
        inbox: notification?.inbox! + 1,
      });

      toast.success("Ticket Received!");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["incoming-tickets", page, debouncedSearchQuery] });
    },
  });

  const incomingColumns = ticketsIncomingColumn(mutate);

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full flex-col pb-4">
          <h1 className="text-[#404041] font-medium text-[28px]">Incoming Tickets</h1>
          <p className="text-muted-foreground text-[12px]">
            All your new tickets will appear here. Stay informed and don't miss any updates.
          </p>
        </div>
        <DataTable columns={incomingColumns} data={data ? data.body : []}  />
      </div>
    </div>
  );
};