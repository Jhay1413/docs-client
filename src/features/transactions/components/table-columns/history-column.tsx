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
import { Link, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { transactionLogsData } from "shared-contract";


type History = z.infer<typeof transactionLogsData>;

export const historyColumn: ColumnDef<History>[] = [
  {
    header: "Subject",
    accessorKey: "subject",
  },

  {
    header: "Forwarder",
    accessorKey: "forwarder",
    id: "forwarder",
    cell: ({ row }) => {
      const forwarderInfo = row.original;
      return (
        <div>
          <h1>{forwarderInfo?.forwarder}</h1>
        </div>
      );
    },
  },
  {
    header: "Receiver",
    accessorKey: "receiver",
    id: "receiver",
    cell: ({ row }) => {
      const receiverInfo = row.original;
      return (
        <div className="flex gap-4 flex-col">
          <h1>{receiverInfo.receiver} </h1>
         
        </div>
      );
    },
  },

  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header:"Status",
    accessorKey:"status"
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
      const navigate = useNavigate();
      const transactionInfo = row.original;
      const routetoLogs = () => {
        navigate(`/dashboard/transactions/log/${transactionInfo.id}`, { state: { transactionInfo } });
      };
      return (
        <Button title="View ticket" variant="outline" size="icon" className="h-8 w-8 p-0" onClick={routetoLogs}>
          <Eye />
        </Button>
      );
    },
  },
];
