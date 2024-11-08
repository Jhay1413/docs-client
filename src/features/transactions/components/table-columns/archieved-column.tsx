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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { archivedTransaction } from "../../schema/TransactionSchema";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { transactionTable } from "shared-contract";

type TArchieved = z.infer<typeof transactionTable>;

export const archivedColumn: ColumnDef<TArchieved>[] = [
  {
    header: "Transaction   ID",
    accessorKey: "transactionId",
  },
  {
    header: "Company ID",
    accessorKey: "companyName",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.company.companyName}</h1>
        </div>
      );
    },
  },
  {
    header: "Project ID",
    accessorKey: "projectName",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.project.projectName}</h1>
        </div>
      );
    },
  },
  {
    header: "Application",
    accessorKey: "documentSubType",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <h1>{data.documentSubType}</h1>
        </div>
      );
    },
  },

  // {
  //   header: "Actions",
  //   accessorKey: "actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const data = row.original;
  //     const currentUser = useCurrentUserRole();
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem>
  //             <Link to={`/dashboard/transactions/history/${data.id}`}>
  //               View Details
  //             </Link>
  //           </DropdownMenuItem>
  //           {currentUser === "RECORDS" && (
  //             <DropdownMenuItem>
  //               <Link to={`/dashboard/transactions/update/${data.id}`}>
  //                 Edit
  //               </Link>
  //             </DropdownMenuItem>
  //           )}

  //           <DropdownMenuSeparator />
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
