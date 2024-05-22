import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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

const UserInfoColumns = z.object({
  id: z.string(),
  assignedSection: z.string(),
  assignedDivision: z.string(),
  assignedPosition: z.string(),
  dateStarted: z.date(),
  jobStatus: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
export type UserInfo = z.infer<typeof UserInfoColumns>;
export const userInfoColumns: ColumnDef<UserInfo>[] = [
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
    header: "User ID",
    accessorKey: "userId",
  },
  {
    header: "First Name",
    accessorKey: "firstName",
  },

  {
    header: "Last Name",
    accessorKey: "lastName",
  },

  {
    header: "Division",
    accessorKey: "assignedDivision",
  },
  {
    header: "Section",
    accessorKey: "assignedSection",
  },
  {
    header: "Position",
    accessorKey: "assignedPosition",
  },
  {
    accessorKey: "dateStarted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Started
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Job Status",
    accessorKey: "jobStatus",
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
