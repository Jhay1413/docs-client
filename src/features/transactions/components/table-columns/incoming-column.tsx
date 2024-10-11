import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
        const data = row.original;

        return <h1>{data.transactionId}</h1>;
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
      header: "Actions",
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        const updateHistory = async () => {
          await mutateAsync({ params: { id: transaction.id! }, body: { dateReceived: new Date().toISOString() } });
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
