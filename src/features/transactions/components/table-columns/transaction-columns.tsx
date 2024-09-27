import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { transactionData } from "../../schema/TransactionSchema";
import { transactionQueryData } from "shared-contract";

type TransactionInfo = z.infer<typeof transactionQueryData>;

export const transactionColumns: ColumnDef<TransactionInfo>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "transactionId",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="text-center">
          <h1>{data.transactionId}</h1>
        </div>
      );
    },
  },
  {
    header: "Project Name",
    accessorKey: "projectName",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.project?.projectName}</h1>
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "documentType",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.documentType}</h1>
        </div>
      );
    },
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
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="">
          <h1>{data.forwarderName}</h1>
        </div>
      );
    },
  },
  {
    header: "Reciever",
    accessorKey: "forwardedTo",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.receiverName}</h1>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    // cell: ({ row }) => {
    //   const rowData = row.original;

    //   return (
    //     <div className="flex items-center ">
    //       <span className ={`${rowData.status === }`}>
    //         <h1 className="text-green-500 text-md font-semibold">{rowData.status}</h1>
    //       </span>
    //     </div>
    //   );
    // },
  },
  {
    header: "Priority",
    accessorKey: "priority",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return (
        <div className="">
          <span>{new Date(transactionInfo.dueDate!).toDateString()}</span>
        </div>
      );
    },
  },
  {
    header: "Percentage",
    accessorKey: "percentage",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return (
        <div className="">
          <span>{transactionInfo.percentage}%</span>
        </div>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const userInfo = row.original;
      console.log(userInfo.percentage);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to={`/dashboard/transactions/history/${userInfo.id}`}
                state={{ percentage: userInfo.percentage }}
              >
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
