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
import {
  archievedTransaction,
  completeStaffWork,
  transactionLogsData,
} from "../../schema/TransactionSchema";
import { getSignUrlForView } from "../../services/getSignedUrl";

type TArchieved = z.infer<typeof archievedTransaction>;

export const archievedColumn: ColumnDef<TArchieved>[] = [
  {
    header: "transaction ID",
    accessorKey: "transactionId",
  },
  {
    header: "Company ID",
    accessorKey: "companyId",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.company.companyId}</h1>
        </div>
      );
    },
  },
  {
    header: "Project ID",
    accessorKey: "projectId",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.project.projectId}</h1>
        </div>
      );
    },
  },
  {
    header: "Project Address",
    accessorKey: "projectAddress",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.project.projectAddress}</h1>
        </div>
      );
    },
  },
  {
    header: "Project ID",
    accessorKey: "projectId",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.project.projectId}</h1>
        </div>
      );
    },
  },
  {
    header: "Date Created",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{new Date(data.createdAt!).toDateString()}</h1>
        </div>
      );
    },
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center">
          <h1>{data.remarks}</h1>
        </div>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

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
              <Link to={`/dashboard/transactions/history/${data.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
