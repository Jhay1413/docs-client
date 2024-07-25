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
import { MoreHorizontal } from "lucide-react";
import { transactionData } from "../../schema/TransactionSchema";

type TransactionInfo = z.infer<typeof transactionData>;

export const transactionColumns: ColumnDef<TransactionInfo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "ID",
    accessorKey: "transactionId",
  },
  {
    header: "Document type",
    accessorKey: "documentType",
  },
  {
    header: "Document sub type",
    accessorKey: "documentSubType",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Forwarded By:",
    accessorKey: "forwardedByRole",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="">
          <h1>{data.forwardedByRole}</h1>
          <h1>{data.originDepartment}</h1>
        </div>
      );
    },
  },
  {
    header: "Forwarded To:",
    accessorKey: "forwardedTo",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="">
          <h1>{data.forwardedTo}</h1>
          <h1>{data.targetDepartment}</h1>
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
    header: "Due date",
    accessorKey: "dueDate",
  },
  {
    header:"Percentage",
    accessorKey:"percentage",
    cell:({row})=>{
      const transactionInfo = row.original;


    
      return(
        <div className="">
          <span>{transactionInfo.percentage}%</span>
        </div>
      )

    }
  },
  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const userInfo = row.original;

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
              <Link to={`/dashboard/userForm/${userInfo.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(userInfo.id ? userInfo.id : "")
              }
            >
              Copy Transaction ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to={`/dashboard/transactions/history/${userInfo.id}`}
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
