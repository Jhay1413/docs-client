import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract";
import { toPascalCase } from "../ticket.utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleArrowRight, Dot, Eye, Forward, Minus, MoreHorizontal, Pencil, View } from "lucide-react";
import { InboxUpdateForm } from "../forms/inbox-update-form";
import { useLocation, useNavigate } from "react-router-dom";

const maxLength = 20;
export const ticketsInboxColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: () => <span className="font-bold text-nowrap">Ticket ID</span>,
    accessorKey: "ticketId",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      const dueDate = new Date(ticketInfo.dueDate);
      const createdDate = new Date(ticketInfo.createdAt!);
      const ticketId = ticketInfo.ticketId;
      
      const isSameDay = (date1:any, date2:any) => {
        return (
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        );
      };

      return (
        <div className="flex gap-2 items-center w-auto text-nowrap">
          <span>{ticketId}</span>
          {
            isSameDay(createdDate, currentDate) ? (
              <span className=" bg-green-500 text-white text-xs px-1 rounded mb-4 " title="New Ticket">
                New
              </span>
            ) : null
          }
          {
            ticketInfo.status !== "RESOLVED" && currentDate.getTime() > dueDate.getTime() ? (
              <span title="Overdue">
                <CircleAlert size={20} className="text-red-500" />
              </span>
            ) : ticketInfo.status !== "RESOLVED" && currentDate.getTime() === dueDate.getTime() ? (
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
    header: () => <span className="font-bold text-nowrap">Transaction ID</span>,
    accessorKey: "transactionId",
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
    accessorKey: "project.projectId",
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
    header: () => (
      <span className="font-bold text-nowrap">Status</span>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const statusInPascalCase = toPascalCase(ticketInfo.status || "");
      return (
        <div className="w-auto text-nowrap">
          {ticketInfo.status === "ON_GOING" && <Dot size={36} className="inline-block text-green-500" />}
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
    header: () => (
      <span className="font-bold text-nowrap">Sender</span>
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
      <span className="font-bold text-nowrap">Remarks</span>
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
      <span className="font-bold text-nowrap">Date Received</span>
    ),
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span className="text-nowrap">{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toLocaleDateString() : "Not received yet"}</span>;
    },
  },

  {
    header: () => <span className="font-bold text-nowrap">Due Date</span>,
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const dueDate = new Date(ticketInfo.dueDate);
      
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
      const navigate = useNavigate();
      const ticket = row.original;
      const location = useLocation();
      const handleOnClickRow = (data: any) => {
        navigate(`/dashboard/tickets/details/${ticket.id}`, { state: { from: location.pathname } }); // Pass the current location as state
      };
      const routeToForwardTicket = () => {
        navigate(`/dashboard/tickets/forward-ticket/${ticket.id}`, { state: { from: location.pathname } }); // Pass the current location as state
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