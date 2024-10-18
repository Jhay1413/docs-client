import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export const ticketsColumn: ColumnDef<any>[] = [
  {
    header: "Ticket ID",
    accessorKey: "ticketId",
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Section",
    accessorKey: "section",
  },
  {
    header: "Division",
    accessorKey: "division",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Request Details",
    accessorKey: "requestDetails",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header: "Priority",
    accessorKey: "priority",
  },
  {
    header: "Date Created",
    accessorKey: "createdAt",
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
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