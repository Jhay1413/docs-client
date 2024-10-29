import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const maxLength = 50;
export const ticketsIncomingColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: "Ticket ID",
    accessorKey: "ticketId",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Section",
    accessorKey: "section",
  },
  {
    header: "Division",
    accessorKey: "division",
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
    header: "Request Details",
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
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.dueDate).toLocaleDateString()}</span>;
    },
  },
  {
    header: "Date Created",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.createdAt!).toLocaleDateString()}</span>;
    },
  },
  {
    header: "Date Forwarded",
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.dateForwarded).toLocaleDateString()}</span>;
    },
  },
  {
    header: "Forwarded By",
    accessorKey: "sender",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const name = `${ticketInfo.sender.firstName} ${ticketInfo.sender.lastName}`;
      return <span>{toPascalCase(name)}</span>;
    },
  },
  {
    header: "Date Received",
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toLocaleDateString() : "Not received yet"}</span>;
    },
  },
  {
    header: "Remarks",
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
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      
t
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
              <button className="w-full" onClick={updateDateReceived}>
                Recieve
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];