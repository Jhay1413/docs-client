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
import { ArrowUpDown, CircleAlert, Dot, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ticketingTableSchema } from "shared-contract";
import { z } from "zod";
import { toPascalCase } from "../ticket.utils";

const maxLength = 50;
export const ticketsColumn: ColumnDef<z.infer<typeof ticketingTableSchema>>[] = [
  {
    header: () => <span className="font-bold text-nowrap">Ticket ID</span>,
    accessorKey: "ticketId",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Current date at midnight
      const dueDate = new Date(ticketInfo.dueDate); // Convert dueDate to a Date object
      const createdDate = new Date(ticketInfo.createdAt!); // Convert createdAt to a Date object
      const ticketId = ticketInfo.ticketId;

  
      // Function to check if two dates are the same day
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
    header: () => <span className="font-bold text-nowrap">Subject</span>,
    accessorKey: "subject",
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
    header: () => <span className="font-bold text-nowrap">Section</span>,
    accessorKey: "section",
  },
  // {
  //   header: () => <span className="font-bold text-nowrap">Division</span>,
  //   accessorKey: "division",
  // },
  {
    header: () => (
      <span className="font-bold text-nowrap">
        Status
      </span>
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
  // {
  //   header: () => <span className="font-bold text-nowrap">Request Details</span>,
  //   accessorKey: "requestDetails",
  //   cell: ({ row }) => {
  //     const transactionInfo = row.original;
  //     const requestDetails = transactionInfo.requestDetails || "";
  //     return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
  //   },
  // },

  // {
  //   header: () => <span className="font-bold text-nowrap">Date Created</span>,
  //   accessorKey: "createdAt",
  //   cell: ({ row }) => {
  //     const transactionInfo = row.original;
  //     const createdAt = transactionInfo.createdAt;

  //     return (
  //       <span>
  //         {createdAt ? new Date(createdAt).toDateString() : "No creation date"} {/* Fallback value when createdAt is undefined */}
  //       </span>
  //     );
  //   },
  // },
  
  // {
  //   header: () => <span className="font-bold text-nowrap">Forwarded To</span>,
  //   accessorKey: "receiver",
  //   cell: ({ row }) => {
  //     const transactionInfo = row.original;
  //     const name = (`${transactionInfo.receiver?.firstName} ${transactionInfo.receiver?.lastName}`).toLocaleLowerCase();
  //     const new_name = toPascalCase(name);
  //     return <span>{new_name}</span>;
  //   },
  // },
  {
    header: () => <span className="font-bold text-nowrap">Remarks</span>,
    accessorKey: "remarks",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const remarks = transactionInfo.remarks || "";

      return <span>{remarks.length > maxLength ? `${remarks.substring(0, maxLength)}...` : remarks}</span>;
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
    header: () => <span className="font-bold text-nowrap">Due Date</span>,
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
      const dueDate = new Date(ticketInfo.dueDate); // Convert dueDate to a Date object
      
      return (
        <div className="flex gap-1 items-center w-24">
          <span>{dueDate.toDateString()}</span>




        </div>
      );
      
      
    },
  },
];
