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
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {transactionLogsData } from "../../schema/TransactionSchema";

type History = z.infer<typeof transactionLogsData>;

export const historyColumn: ColumnDef<History>[] = [
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "From",
    accessorKey: "fromDepartment",
    cell: ({ row }) => {
      const historyData = row.original;

      return (
        <div className="flex flex-col gap-2">
          <h1>{historyData.originDepartment}</h1>
          <h1>{historyData.forwardedByRole}</h1>
        </div>
      );
    },
  },
  {
    header: "To",
    accessorKey: "toDepartment",
    cell: ({ row }) => {
      const historyData = row.original;

      return (
        <div className="flex flex-col gap-2">
          <h1>{historyData.targetDepartment}</h1>
          <h1>{historyData.forwardedTo}</h1>
        </div>
      );
    },
  },
  {
    header: "Forwarder",
    accessorKey: "forwarder",
    id: "forwarder",
    cell: ({ row }) => {
      const forwarderInfo = row.original;
      return (
        <div>
          <h1>{forwarderInfo?.forwardedBy}</h1>
        </div>
      );
    },
  },
  {
    header: "Received By",
    accessorKey: "receiver",
    id: "receiver",
    cell: ({ row }) => {
      const receiverInfo = row.original;
      console.log(receiverInfo)
      return (
        <div className="flex gap-4 flex-col">
          <h1>{receiverInfo.receivedBy} </h1>
         
        </div>
      );
    },
  },

  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header: "Date Forwarded",
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const dateForwarded = row.original.dateForwarded;
      return (
        <div>
          <h1>{dateForwarded ? new Date(dateForwarded).toDateString() : ""}</h1>
        </div>
      );
    },
  },
  {
    header: "Date Received",
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const dateReceived = row.original.dateReceived;
      return (
        <div>
          <h1>{dateReceived ? new Date(dateReceived).toDateString() : ""}</h1>
        </div>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const transactionInfo = row.original;

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

            <DropdownMenuItem>
              <Link to={`/dashboard/transactions/log/${transactionInfo.id}` } state= {{transactionInfo}}>View</Link>
            </DropdownMenuItem>
      

            <DropdownMenuSeparator />
           
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
