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
import { transactionData } from "../../schema/TransactionSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { transactionQueryData } from "shared-contract";

type InboxColumn = z.infer<typeof transactionQueryData>;

export const inboxColumn: ColumnDef<InboxColumn>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    header: "ID",
    accessorKey: "transactionId",
  },
  {
    header: "Document type",
    accessorKey: "documentType",
  },
  {
    header: "Document Sub Type",
    accessorKey: "documentSubType",
  },
  {
    header: "Subject",
    accessorKey: "subject",
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
    header: "Forwarded By:",
    accessorKey: "forwardedBy",
    cell: ({ row }) => {
      const transactionHistory = row.original;

      return (
        <div className="flex flex-col gap-4">
          <h1>
            {transactionHistory?.forwarder?.userInfo?.firstName} {transactionHistory.forwarder?.userInfo?.lastName}
          </h1>
        </div>
      );
    },
  },
  {
    header: "Due date",
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return (
        <div className="">
          <h1>{new Date(transactionInfo.dueDate).toDateString()}</h1>
        </div>
      );
    },
  },
  // {
  //   header: "Actions",
  //   accessorKey: "actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const transactionInfo = row.original;
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

  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>
  //             <Link to={`/dashboard/transactions/history/${transactionInfo.id}`}>View Details</Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
