import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table";

import { useNotificationStore } from "@/global-states/notification-store";

import { tsr } from "@/services/tsr";
import { useColumns } from "../table-columns/incoming-column";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

export const IncomingComponent = () => {
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

  const { data, isLoading } = tsr.transaction.fetchTransactionsV2.useQuery({
    queryKey: ["incoming-transactions", page, debouncedSearchQuery],
    queryData: {
      query: {
        query: debouncedSearchQuery,
        status: "INCOMING",
        page: page,
        pageSize: "10",
        userId: id,
      },
    },
  });

  const { mutate } = tsr.transaction.receivedTransaction.useMutation({
    onMutate: (data) => {
      tsrQueryClient.transaction.fetchTransactionsV2.setQueryData(["incoming-transactions", page, debouncedSearchQuery], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: {
            ...old.body,
            data: old.body.data.filter((transaction) => transaction.id !== data.params.id), // Filter out the transaction being mutated
          },
        };
      });
    },
    onSuccess: () => {
      toast.success("Transaction Received !");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["incoming-transactions", page, debouncedSearchQuery] });
    },
  });
  const incomingColumns = useColumns(mutate);

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full flex-col pb-4">
          <h1 className="text-[#404041] font-medium text-[28px]">Incoming Files</h1>
          <p className="text-muted-foreground text-[12px] truncate">
            All your new messages and notifications will appear here. Stay informed and don't miss any updates.
          </p>
        </div>
        <DataTable columns={incomingColumns} data={data ? data.body.data : []} />
      </div>
    </div>
  );
};
