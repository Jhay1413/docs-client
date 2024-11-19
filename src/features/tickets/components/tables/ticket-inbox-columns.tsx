import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Dot, Eye, Forward, Minus, MoreHorizontal, Pencil, View } from "lucide-react";
import { InboxUpdateForm } from "../forms/inbox-update-form";
import { useNavigate } from "react-router-dom";

const maxLength = 20;
export const ticketsInboxColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: () => <span className="font-bold text-nowrap">Ticket ID</span>,
    accessorKey: "ticketId",
  },
  {
    header: () => <span className="font-bold text-nowrap">Transaction ID</span>,
    accessorKey: "transactionId", // Still keep this for consistency
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const transactionId = ticketInfo.transaction?.transactionId ?? ticketInfo.transaction?.transactionId ?? (
        <div className="text-gray-400 flex justify-center items-center">
          <Minus />
        </div>
      );
      return <span>{transactionId}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Project ID</span>,
    accessorKey: "project.projectId", // Still keep this for consistency
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const projectId = ticketInfo.project?.projectId ?? ticketInfo.project?.projectId ?? (
        <div className="text-gray-400 flex justify-center items-center">
          <Minus />
        </div>
      );
      return <span>{projectId}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Subject</span>,
    accessorKey: "subject",
  },
  {
    header: () => <span className="font-bold text-nowrap">Request Detais</span>,
    accessorKey: "requestDetails",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const requestDetails = transactionInfo.requestDetails || "";
      return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
    },
  },
  {
    header: () => (
      <span className="font-bold text-nowrap">Status</span>
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
    header: () => <span className="font-bold text-nowrap">Due Date</span>,
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
        navigate(`/dashboard/tickets/details/${ticket.id}`);
      };
      const routeToForwardTicket = () => {
        navigate(`/dashboard/tickets/forward-ticket/${ticket.id}`);
      };
  
      return (
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <Button title="View ticket" variant="outline" size="icon" onClick={handleOnClickRow}>
            <Eye/>
          </Button>
          <InboxUpdateForm id={ticket.id} />
          <Button variant="outline" size="icon" title="Forward ticket" onClick={routeToForwardTicket}>
            <Forward />
          </Button>
        </div>
      );
    },
  },
];
