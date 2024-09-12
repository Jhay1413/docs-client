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
import { CompanyInfo} from "../schema/companySchema";
import { z } from "zod";

export const companyInfoColumns: ColumnDef<z.infer<typeof CompanyInfo>>[] = [

  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "companyId",
  },

  {
    header: "Company Name",
    accessorKey: "companyName",
  },

  {
    header: "Company Address",
    accessorKey: "companyAddress",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {

      //should add prompt component for delete
      const companyInfo = row.original;
      // const { remove } = useCompany(
      //   `/${companyInfo.id}`,
      //   "companies",
      //   companyInfo.id
      // );
      // const deleteCompany = () => {
      //   remove.mutate(companyInfo.companyId);
      // };
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
            {/* <DropdownMenuItem onClick={(deleteCompany)}>Delete</DropdownMenuItem> */}

            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy User ID</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to={`/dashboard/companyProfile/${companyInfo.id}`}
                state={{ data: companyInfo }}
              >
                View Company
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to={`${companyInfo.id}`}
                state={{ data: companyInfo }}
              >
                Edit Company
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
