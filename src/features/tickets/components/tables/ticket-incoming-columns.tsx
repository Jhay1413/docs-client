import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dot, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type IncomingColumn = z.infer<typeof ticketingTableSchema>;
interface MutateAsyncParams {
  params: {
    id: string; // ID of the transaction
  };
  body: {
    dateReceived: string; // Date when the transaction is received
  };
}
type MutateAsyncFunction = (args: MutateAsyncParams) => void;

const maxLength = 50;
export function ticketsIncomingColumn(mutateAsync: MutateAsyncFunction): ColumnDef<IncomingColumn>[]{
  return[
    {
      header: () => <span className="font-bold text-nowrap">Ticket ID</span>,
      accessorKey: "ticketId",
    },
    {
      header: () => <span className="font-bold text-nowrap">Subject</span>,
      accessorKey: "subject",
    },
    {
      header: () => <span className="font-bold text-nowrap">Section</span>,
      accessorKey: "section",
    },
    {
      header: () => <span className="font-bold text-nowrap">Division</span>,
      accessorKey: "division",
    },
    {
      header: () => (
        <div className="w-full font-bold text-nowrap items-center flex justify-center">
          <h1>Status</h1>
        </div>
      ),
      accessorKey: "status",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        const statusInPascalCase = toPascalCase(ticketInfo.status || "");
        return (
          <div className="flex  gap-1 items-center w-24">
            {ticketInfo.status === "ON_GOING" && <Dot size={32} className="text-green-500" />}
            <span>{statusInPascalCase}</span>
          </div>
        );
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Priority</span>,
      accessorKey: "priority",
    },
    {
      header: () => <span className="font-bold text-nowrap">Request Details</span>,
      accessorKey: "requestDetails",
      cell: ({ row }) => {
          const transactionInfo = row.original;
          const requestDetails = transactionInfo.requestDetails || "";  
          return (
            <span>
              {requestDetails.length > maxLength
                ? `${requestDetails.substring(0, maxLength)}...`
                : requestDetails}
            </span>
          );
        },
    },
    {
      header: () => <span className="font-bold text-nowrap">Due Date</span>,
      accessorKey: "dueDate",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        return <span>{new Date(ticketInfo.dueDate).toLocaleDateString()}</span>;
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Date Created</span>,
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        return <span>{new Date(ticketInfo.createdAt!).toLocaleDateString()}</span>;
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Date Forwarded</span>,
      accessorKey: "dateForwarded",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        return <span>{new Date(ticketInfo.dateForwarded).toLocaleDateString()}</span>;
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Forwarded By</span>,
      accessorKey: "sender",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        const name = `${ticketInfo.sender.firstName} ${ticketInfo.sender.lastName}`;
        return <span>{toPascalCase(name)}</span>;
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Date Received</span>,
      accessorKey: "dateReceived",
      cell: ({ row }) => {
        const ticketInfo = row.original;
        return <span>{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toLocaleDateString() : "Not received yet"}</span>;
      },
    },
    {
      header: () => <span className="font-bold text-nowrap">Remarks</span>,
      accessorKey: "remarks",
      cell: ({ row }) => {
          const transactionInfo = row.original;
          const remarks = transactionInfo.remarks || "";
      
          return (
            <span>
              {remarks.length > maxLength
                ? `${remarks.substring(0, maxLength)}...`
                : remarks}
            </span>
          );
        },
    },
  
    {
      header: () => <span className="font-bold text-nowrap">Actions</span>,
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;
        
        const updateDateReceived = async () => {
          await mutateAsync({ params: { id: ticket.id! }, body: { dateReceived: new Date().toISOString() } });
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
                <button className="w-full" onClick = { updateDateReceived}>
                  Receive
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]
}
