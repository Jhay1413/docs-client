import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleAlert, Dot, MailOpen, MoreHorizontal } from "lucide-react";
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
      cell: ({ row }) => {
        const ticketInfo = row.original;
        const current = new Date();
        const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
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
            <span>{ticketId}</span> {/* Set a fixed width and align text to the right */}
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
      header: () => <span className="font-bold text-nowrap">Section</span>,
      accessorKey: "section",
    },
    {
      header: () => <span className="font-bold text-nowrap">Division</span>,
      accessorKey: "division",
    },
    {
      header: () => (
        <span className="font-bold text-nowrap">
          <h1>Status</h1>
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
        const dueDate = new Date(ticketInfo.dueDate); // Convert dueDate to a Date object
        
        return (
          <span className="text-nowrap">{dueDate.toDateString()}</span>
        );
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
      header: () => (
        <div className="w-full font-bold text-nowrap items-center flex justify-center">
          <h1>Actions</h1>
        </div>
      ),
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;
        
        const updateDateReceived = async () => {
          await mutateAsync({ params: { id: ticket.id! }, body: { dateReceived: new Date().toISOString() } });
        };
        return (
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
                <span className="sr-only">Open menu</span>
                <MailOpen />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex justify-center">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
              </div>
              
              <DropdownMenuItem>
                <button className="w-full" onClick={updateDateReceived}>
                  Receive
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        );
      },
    },
  ]
}
