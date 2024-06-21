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
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TUsers } from "../schema/UserSchema";


export const userInfoColumns: ColumnDef<TUsers>[] = [
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
    header:"Profile",
    accessorKey:"profile",
    cell:({row})=>{

      const userInfo = row.original;
      return(
        <div className="flex w-full justify-between">
          <Avatar>
            <AvatarImage src={userInfo.signedUrl} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* Assuming signedUrl is the avatar URL */}
      
        </div>
      ) 
      
    }
  },
  {
    header: "Employee ID",
    accessorKey: "employeeId",
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
    accessorKey: "birthDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Birthdate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "dateStarted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date started
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
            <DropdownMenuItem>Delete User</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(userInfo.id)}
            >
              Copy User ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem><Link to={`/dashboard/users/profile/${userInfo.id}`}>View Profile </Link></DropdownMenuItem>
        
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
