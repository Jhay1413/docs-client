import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Dot, Eye, MoreHorizontal, Pencil, View } from "lucide-react";
import { InboxUpdateForm } from "../forms/inbox-update-form";
import { useNavigate } from "react-router-dom";

const maxLength = 20;
export const ticketsInboxColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Ticket ID</h1>
      </div>
    ),
    accessorKey: "ticketId",
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Subject</h1>
      </div>
    ),
    accessorKey: "subject",
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Section</h1>
      </div>
    ),
    accessorKey: "section",
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Division</h1>
      </div>
    ),
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
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Priority</h1>
      </div>
    ),
    accessorKey: "priority",
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Request Details</h1>
      </div>
    ),
    accessorKey: "requestDetails",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const requestDetails = transactionInfo.requestDetails || "";
      return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Due Date</h1>
      </div>
    ),
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.dueDate).toLocaleDateString()}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Date Created</h1>
      </div>
    ),
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.createdAt!).toLocaleDateString()}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Date Forwarded</h1>
      </div>
    ),
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.dateForwarded).toLocaleDateString()}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Sender</h1>
      </div>
    ),
    accessorKey: "sender",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const name = `${ticketInfo.sender.firstName} ${ticketInfo.sender.lastName}`;
      return <span>{toPascalCase(name)}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Date Received</h1>
      </div>
    ),
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toLocaleDateString() : "Not received yet"}</span>;
    },
  },
  {
    header: () => (
      <div className="w-full font-bold text-nowrap items-center flex justify-center">
        <h1>Remarks</h1>
      </div>
    ),
    accessorKey: "remarks",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const remarks = transactionInfo.remarks || "";

      return <span>{remarks.length > maxLength ? `${remarks.substring(0, maxLength)}...` : remarks}</span>;
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
      const navigate = useNavigate();
      const ticket = row.original;
      const handleOnClickRow = () => {
        navigate(`/dashboard/tickets/details/${ticket.id}`); // Navigate to ticket details page
      };

      return (
        <div className="flex items-center justify-center gap-4 text-gray-700">
          <Button variant="outline" size="icon" title="View ticket" onClick={handleOnClickRow}>
            <Eye />
          </Button>
          <InboxUpdateForm id={ticket.id} />
        </div>
      );
    },
  },
];
