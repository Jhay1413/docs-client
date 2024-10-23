import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ticketingTableSchema } from "shared-contract";
import { z } from "zod";
import { toPascalCase } from "./ticket.utils";

export const ticketsColumn: ColumnDef<z.infer <typeof ticketingTableSchema>>[] = [
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
    header: "Priority",
    accessorKey: "priority",
  },
  {
    header: "Request Details",
    accessorKey: "requestDetails",
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Due Date
        </span>
      );
    },
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Created
        </span>
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Forwarded
        </span>
      );
    },
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: "Forwarded By",
    accessorKey: "sender",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = (`${transactionInfo.sender.firstName} ${transactionInfo.sender.lastName}`).toLocaleLowerCase();
      const new_name = toPascalCase(name);
      return (
        <span>
          {new_name}
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Received
        </span>
      );
    },
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
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