import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleArrowRight, Dot, Eye, Minus, MoreHorizontal, Pencil, View } from "lucide-react";
import { InboxUpdateForm } from "../forms/inbox-update-form";
import { useLocation, useNavigate } from "react-router-dom";

const maxLength = 20;
export const pendingTicketsColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: () => <span className="font-bold text-nowrap">Ticket ID</span>,
    accessorKey: "ticketId",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
      const dueDate = new Date(ticketInfo.dueDate); // Convert dueDate to a Date object
      const ticketId = ticketInfo.ticketId;
      
      return (
        <div className="flex gap-2 items-center w-auto text-nowrap">
          <span>{ticketId}</span>
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
  // {
  //   header: () => <span className="font-bold text-nowrap">Request Details</span>,
  //   accessorKey: "requestDetails",
  //   cell: ({ row }) => {
  //     const transactionInfo = row.original;
  //     const requestDetails = transactionInfo.requestDetails || "";
  //     return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
  //   },
  // },
  {
    header: () => (
      
      <span className="font-bold text-nowrap"> Status </span>
      
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

  // {
  //   header: () => (
  //     <div className="w-full font-bold text-nowrap items-center flex justify-center">
  //       <h1>Date Created</h1>
  //     </div>
  //   ),
  //   accessorKey: "createdAt",
  //   cell: ({ row }) => {
  //     const ticketInfo = row.original;
  //     return <span>{new Date(ticketInfo.createdAt!).toLocaleDateString()}</span>;
  //   },
  // },
  {
    header: () => (
      <span className="font-bold text-nowrap">
        Date Forwarded
      </span>
    ),
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{new Date(ticketInfo.dateForwarded).toLocaleDateString()}</span>;
    },
  },

  {
    header: () => (
      <span className="font-bold text-nowrap">
        Date Received
      </span>
    ),
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toLocaleDateString() : "Not received yet"}</span>;
    },
  },
  {
    header: () => (
      <span className="font-bold text-nowrap">
        Remarks
      </span>
    ),
    accessorKey: "remarks",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const remarks = transactionInfo.remarks || "";

      return <span>{remarks.length > maxLength ? `${remarks.substring(0, maxLength)}...` : remarks}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Due Date</span>,
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const dueDate = new Date(ticketInfo.dueDate); // Convert dueDate to a Date object
      
      return (
        <span className="text-nowrap">{dueDate.toDateString()}</span>
      );
    },
  },
  // {
  //   header: () => (
  //     <div className="w-full font-bold text-nowrap items-center flex justify-center">
  //       <h1>Actions</h1>
  //     </div>
  //   ),
  //   accessorKey: "actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const navigate = useNavigate();
  //     const ticket = row.original;
  //     const location = useLocation();
  //     const handleOnClickRow = (data: any) => {
  //       // Navigate to ticket details page when a row is clicked
  //       navigate(`/dashboard/tickets/details/${ticket.id}`, { state: { from: location.pathname } }); // Pass the current location as state
  //     };

  //     return (
  //       <div className="flex items-center justify-center gap-4 text-gray-700">
  //         <Button variant="outline" size="icon" title="View ticket" onClick={handleOnClickRow}>
  //           <Eye />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
