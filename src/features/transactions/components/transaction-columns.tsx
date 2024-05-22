
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


const TransactionColumns = z.object({
  id: z.string(),
  documentType: z.string(),
  subject: z.string(),
  dueDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  documentSubType: z.string(),
  team: z.string(),
  createdByName: z.string(),
  fromDepartment: z.string(),
  toDepartment: z.string(),
    
});

type TransactionInfo = z.infer<typeof TransactionColumns>;

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
      enableHiding: false
    },
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Document Type",
        accessorKey: "documentType",
    },
    {
        header: "Document Sub Type",
        accessorKey: "documentSubType",
    },
    {
        header: "Team",
        accessorKey: "team",
    },
    {
        header: "Subject",
        accessorKey: "subject",
    },
    {
        header: "From",
        accessorKey: "fromDepartment",
    },

    {
        header: "To",
        accessorKey: "toDepartment",
    },
    {
        header: "Created By",
        accessorKey: "createdByName",
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt",
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
    
                <DropdownMenuItem><Link to={`/dashboard/userForm/${userInfo.id}`}>Edit</Link></DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
    
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(userInfo.id)}
                >
                  Copy Transatcion ID
                </DropdownMenuItem>
    
                <DropdownMenuSeparator />
                <DropdownMenuItem>View History</DropdownMenuItem>
                
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    
]