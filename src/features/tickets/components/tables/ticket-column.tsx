import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ticketingTableSchema } from "shared-contract";
import { z } from "zod";
import { toPascalCase } from "../ticket.utils";

const maxLength = 50;
export const ticketsColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
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
    header: () => <span className="font-bold text-nowrap">Status</span>,
    accessorKey: "status",
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
      return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Due Date</span>,
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Created</span>,
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const createdAt = transactionInfo.createdAt;

      return (
        <span>
          {createdAt ? new Date(createdAt).toDateString() : "No creation date"} {/* Fallback value when createdAt is undefined */}
        </span>
      );
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Forwarded</span>,
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dateForwarded).toDateString()}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Forwarded By</span>,
    accessorKey: "sender",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = `${transactionInfo.sender.firstName} ${transactionInfo.sender.lastName}`.toLocaleLowerCase();
      const new_name = toPascalCase(name);
      return <span>{new_name}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Received</span>,
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const dateReceived = transactionInfo.dateReceived;

      return (
        <span>
          {dateReceived ? new Date(dateReceived).toDateString() : "Not received yet"} {/* Fallback value when dateReceived is null */}
        </span>
      );
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Forwarded To</span>,
    accessorKey: "receiver",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = `${transactionInfo.receiver?.firstName} ${transactionInfo.receiver?.lastName}`.toLocaleLowerCase();
      const new_name = toPascalCase(name);
      return <span>{new_name}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Remarks</span>,
    accessorKey: "remarks",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const remarks = transactionInfo.remarks || "";

      return <span>{remarks.length > maxLength ? `${remarks.substring(0, maxLength)}...` : remarks}</span>;
    },
  },
];
