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
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { TCompanyFullData } from "../schema/companySchema";
import { useCompany } from "../hooks/query-gate";

export const companyInfoColumns: ColumnDef<TCompanyFullData>[] = [
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
    header: "Company ID",
    accessorKey: "companyId",
  },

  {
    header: "Comapny Name",
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
                to={`${companyInfo.id}/edit`}
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
