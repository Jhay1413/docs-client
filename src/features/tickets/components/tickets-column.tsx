import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ticketingTableSchema } from "shared-contract";
import { z } from "zod";
import { toPascalCase } from "./ticket.utils";

export const ticketsColumn: ColumnDef<z.infer <typeof ticketingTableSchema>>[] = [
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
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Due Date
        </span>
      );
    },
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Created
        </span>
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Forwarded
        </span>
      );
    },
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: "Forwarded By",
    accessorKey: "sender",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = (`${transactionInfo.sender.firstName} ${transactionInfo.sender.lastName}`).toLocaleLowerCase();
      const new_name = toPascalCase(name);
      return (
        <span>
          {new_name}
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Received
        </span>
      );
    },
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },

];