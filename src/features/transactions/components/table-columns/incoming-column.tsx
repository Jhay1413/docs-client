import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { transactionData } from "../../schema/TransactionSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransaction } from "../../hooks/query-gate";
import { getCurrentAccountId, getCurrentUserId } from "@/hooks/use-user-hook";
import { useNotificationStore } from "@/global-states/notification-store";

type IncomingColumn = z.infer<typeof transactionData>;

export const incomingColumns: ColumnDef<IncomingColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "ID",
    accessorKey: "transactionId",
  },
  {
    header: "Document type",
    accessorKey: "documentType",
  },
  {
    header: "Document sub type",
    accessorKey: "documentSubType",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },

  {
    header: "Status",
    accessorKey: "status",
    // cell: ({ row }) => {
    //   const rowData = row.original;

    //   return (
    //     <div className="flex items-center ">
    //       <span className ={`${rowData.status === }`}>
    //         <h1 className="text-green-500 text-md font-semibold">{rowData.status}</h1>
    //       </span>
    //     </div>
    //   );
    // },
  },
  {
    header: "Priority",
    accessorKey: "priority",
  },
  {
    header: "Forwarded By:",
    accessorKey: "forwardedBy",
    cell: ({ row }) => {
      const transactionHistory = row.original;

      return (
        <div className="flex flex-col gap-4">
          <h1>{transactionHistory?.originDepartment}</h1>
          <h1>{transactionHistory?.forwarder?.email}</h1>
        </div>
      );
    },
  },
  {
    header: "Due date",
    accessorKey: "dueDate",
  },

  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const notification = useNotificationStore((state) => state.notification);
      const setIncoming = useNotificationStore(
        (state) => state.setNotification
      );
      const refetch = useNotificationStore((state)=>state.refetchAll)

      const transaction = row.original;
      const accountId = getCurrentAccountId();
      const { update } = useTransaction({
        key: "incoming-transaction",
        url: `/v2/incoming/${transaction.transactionId}/received`,
        method: "UPDATEREMOVE",
      });
      const updateHistory = async () => {
        const payload = {
          id: transaction.transactionId,
          receivedBy: accountId,
          dateReceived: new Date(),
        };
        update.mutateAsync(payload);
        if (refetch) {
          console.log("were inside");
          if (notification && notification.incoming)
            setIncoming({
              ...notification,
              incoming: notification.incoming - 1,
              inbox : notification.inbox + 1
            });
          refetch();
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem>
              <Button variant="link" onClick={updateHistory}>
                Recieve
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="">View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
