import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "./ticket.utils"; // Adjust the import based on your project structure

export const ticketsInboxColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
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
  },
];