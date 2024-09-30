import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { transactionData } from "../../schema/TransactionSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransaction } from "../../hooks/query-gate";
import { getCurrentAccountId } from "@/hooks/use-user-hook";
import { useNotificationStore } from "@/global-states/notification-store";
import { toast } from "react-toastify";
import { tsr } from "@/services/tsr";
import { transactionQueryData } from "shared-contract";

type IncomingColumn = z.infer<typeof transactionQueryData>;
interface MutateAsyncParams {
  params: {
    id: string; // ID of the transaction
  };
  body: {
    dateReceived: string; // Date when the transaction is received
  };
}

// Define the mutateAsync function type
type MutateAsyncFunction = (args: MutateAsyncParams) => Promise<any>;

export function useColumns(mutateAsync: MutateAsyncFunction): ColumnDef<IncomingColumn>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "ID",
      accessorKey: "transactionId",
    },
    {
      header: "Type",
      accessorKey: "documentType",
    },
    {
      header: "Subtype",
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
      header: "Forwarder",
      accessorKey: "forwardedBy",
      cell: ({ row }) => {
        const transactionHistory = row.original;

        return (
          <div className="flex flex-col gap-4">
            <h1 className="">{`${transactionHistory.forwarder?.userInfo?.firstName} ${transactionHistory.forwarder?.userInfo?.lastName}`}</h1>
          </div>
        );
      },
    },
    {
      header: "Due date",
      accessorKey: "dueDate",
      cell: ({ row }) => {
        const transaction = row.original;
        return <h1>{new Date(transaction.dueDate).toDateString()}</h1>;
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
        const accountId = getCurrentAccountId();
        // const { update } = useTransaction({
        //   key: "incoming-transaction",
        //   url: `/v2/incoming/${transaction.transactionId}/received`,
        //   method: "UPDATEREMOVE",
        // });

        const updateHistory = async () => {
          try {
            await mutateAsync({ params: { id: transaction.id! }, body: { dateReceived: new Date().toISOString() } });
          } catch (error) {
            console.log(error);
            toast("Something went wrong please refresh the page ");
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
