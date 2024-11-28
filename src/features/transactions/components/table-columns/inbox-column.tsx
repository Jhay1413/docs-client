import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert, Eye } from "lucide-react";
import { transactionTable } from "shared-contract";
import { useNavigate } from "react-router-dom";

type InboxColumn = z.infer<typeof transactionTable>;

export const inboxColumn: ColumnDef<InboxColumn>[] = [
  {
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "transactionId",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
      const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
      const transactionId = transactionInfo.transactionId;
      
      return (
        <div className="flex gap-2 items-center w-auto text-nowrap">
          <span className="">{transactionId}</span> {/* Set a fixed width and align text to the right */}
          {
            transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() > dueDate.getTime() ? (
              <span title="Overdue">
                <CircleAlert size={20} className="text-red-500" />
              </span>
            ) : transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() === dueDate.getTime() ? (
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
    header: "Company Name",
    accessorKey: "companyName",
    cell: ({ row }) => {
      const data = row.original;
      return <h1>{data.company.companyName}</h1>;
    },
  },
  {
    header: "Project Name",
    accessorKey: "projectName",
    cell: ({ row }) => {
      const data = row.original;

      return <h1>{data.project?.projectName}</h1>;
    },
  },
  {
    header: "Type",
    accessorKey: "documentType",
  },
  {
    header: "Subtype",
    accessorKey: "documentSubType",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Forwarder",
    accessorKey: "forwarder",
  },
  {
    header: "Receiver",
    accessorKey: "receiver",
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
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
      
      return (
        <span className="text-nowrap">{dueDate.toDateString()}</span>
      );
    },
  },
  // {
  //   header: "Actions",
  //   accessorKey: "actions",
  //   cell: ({ row }) => {
  //     const navigate = useNavigate();
  //     const transaction = row.original;
  //     const handleOnClickRow = () => {
  //       navigate(`/dashboard/transactions/history/${transaction.id}`); // Navigate to ticket details page
  //     };
  //     return (
  //       <div className="flex items-center justify-center gap-4 text-gray-700">
  //         <Button variant="outline" size="icon" title="View ticket" onClick={handleOnClickRow}>
  //           <Eye />
  //         </Button>
  //         {/* <InboxUpdateForm id={ticket.id} /> */}
  //       </div>
  //     );
  //   },
  // },
];
