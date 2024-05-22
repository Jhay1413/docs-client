import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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

const AccountColumns = z.object({
  id: z.string(),
  email: z.string(),
  accountRole: z.string(),
  password: z.string(),
  
});
export type TAccountColumns = z.infer<typeof AccountColumns>;
export const accountColumn: ColumnDef<TAccountColumns>[] = [
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
    header: "Id",
    accessorKey: "id",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Password",
    accessorKey: "password",
  },
  {
    header: "Account Type",
    accessorKey: "accountRole",
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

            <DropdownMenuItem><Link to={`/dashboard/userForm/${userInfo.id}`}>Edit User </Link></DropdownMenuItem>
            <DropdownMenuItem>Delete User</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(userInfo.id)}
            >
              Copy User ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>View User Profile</DropdownMenuItem>
            <DropdownMenuItem>View Account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
