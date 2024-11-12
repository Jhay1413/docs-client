import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { ticketingTableSchema } from "shared-contract"; // Adjust the import based on your project structure
import { toPascalCase } from "../ticket.utils"; // Adjust the import based on your project structure
import { Minus } from "lucide-react";

const maxLength = 50;

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
      const transactionId = ticketInfo.transaction?.transactionId ?? ticketInfo.transaction?.transactionId ?? <div className="text-gray-400 flex justify-center items-center"><Minus /></div>;
      return <span>{transactionId}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Project ID</span>,
    accessorKey: "project.projectId", // Still keep this for consistency
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const projectId = ticketInfo.project?.projectId ?? ticketInfo.project?.projectId ?? <div className="text-gray-400 flex justify-center items-center"><Minus /></div>;
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
    header: () => <span className="font-bold text-nowrap">Status</span>,
    accessorKey: "status",
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
    header: () => <span className="font-bold text-nowrap">Date Recieved</span>,
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return (
        <span>
          {ticketInfo.dateReceived
            ? new Date(ticketInfo.dateReceived).toLocaleDateString()
            : "Not received yet"}
        </span>
      );
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
          {remarks.length > maxLength ? `${remarks.substring(0, maxLength)}...` : remarks}
        </span>
      );
    },
  },
];
const rowData = { requestType: "EPD" };

const filterColumns = (columns: any, rowData: any) => {
  return columns.filter((col: any) => {
    // Condition to hide/show the "Transaction ID" and "Project ID" columns
    if (
      (col.accessorKey === "transactionId" || col.accessorKey === "project.projectId") &&
      rowData?.requestType !== "EPD"
    ) {
      return false;
    }
    return true;
  });
};

const filteredColumns = filterColumns(ticketsInboxColumn, rowData);