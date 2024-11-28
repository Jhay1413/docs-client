import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert, MailOpen, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { transactionTable } from "shared-contract";

type IncomingColumn = z.infer<typeof transactionTable>;
interface MutateAsyncParams {
  params: {
    id: string; // ID of the transaction
  };
  body: {
    dateReceived: string; // Date when the transaction is received
  };
}

// Define the mutateAsync function type
type MutateAsyncFunction = (args: MutateAsyncParams) => void;

export function useColumns(mutateAsync: MutateAsyncFunction): ColumnDef<IncomingColumn>[] {
  return [
    {
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Transaction ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "transactionId",
      cell: ({ row }) => {
        const transactionInfo = row.original;
        const current = new Date();
        const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
        const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
        const transactionId = transactionInfo.transactionId;
        
        return (
          <div className="flex gap-2 items-center w-auto text-nowrap">
            <span className="">{transactionId}</span> {/* Set a fixed width and align text to the right */}
            {
              transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() > dueDate.getTime() ? (
                <span title="Overdue">
                  <CircleAlert size={20} className="text-red-500" />
                </span>
              ) : transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() === dueDate.getTime() ? (
                <span title="Due Today">
                  <CircleAlert size={20} className="text-yellow-500" />
                </span>
              ) : null
            }
          </div>
        );
      },
    },
    {
      header: "Company Name",
      accessorKey: "companytName",
      cell: ({ row }) => {
        const data = row.original;

        return <h1>{data.company.companyName}</h1>;
      },
    },
    {
      header: "Project Name",
      accessorKey: "projectName",
      cell: ({ row }) => {
        const data = row.original;

        return <h1>{data.project?.projectName}</h1>;
      },
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
      header: "Forwarder",
      accessorKey: "forwarder",
    },
    {
      header: "Receiver",
      accessorKey: "receiver",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Priority",
      accessorKey: "priority",
    },
    {
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "dueDate",
      cell: ({ row }) => {
        const transactionInfo = row.original;
        const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
        
        return (
          <span className="text-nowrap">{dueDate.toDateString()}</span>
        );
      },
    },
    {
      header: () => (
        <div className="w-full font-bold text-nowrap items-center flex justify-center">
          <h1>Actions</h1>
        </div>
      ),
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        const updateHistory = async () => {
          await mutateAsync({ params: { id: transaction.id! }, body: { dateReceived: new Date().toISOString() } });
        };
        return (
          <div className="flex items-center justify-center gap-2 text-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
                <span className="sr-only">Open menu</span>
                <MailOpen />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem>
                <button className="w-full" onClick={updateHistory}>
                  Receive
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          </div> 

      
        );
      },
    },
  ];
}
