import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import { z } from "zod";
import { toPascalCase } from "./ticket.utils";
import { ticketLogsSchema } from "shared-contract";

export const ticketsDetailsColumn: ColumnDef<z.infer <typeof ticketLogsSchema>>[] = [
  {
    header: "Logs ID",
    accessorKey: "ticketId",
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
    header: "Forwarded By",
    accessorKey: "sender",
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
      const ticketInfo = row.original;

      return <span>{ ticketInfo.dateForwarded ? 
        new Date(ticketInfo.dateForwarded).toDateString(): "No Date Available"}</span>;
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
      const ticketInfo = row.original;

      return (
        <span>
          {ticketInfo.dateReceived 
            ? new Date(ticketInfo.dateReceived).toDateString() 
            : "No Date Available"}
        </span>
      );
      
    },
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
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
      const ticketInfo = row.original;

      return(
        <span>{ ticketInfo.createdAt ? 
          new Date(ticketInfo.createdAt).toDateString() : "No Date Available"}</span>
      ) 
    },
  },
  {
    header: ({ column }) => {
      return (
        <span>
          Date Updated
        </span>
      );
    },
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const ticketInfo = row.original;

      return(
        <span>{ ticketInfo.updatedAt ? 
          new Date(ticketInfo.updatedAt).toDateString() : "No Date Available"}</span>
      ) 
    },
  },
  // {
  //   header: "Actions",
  //   accessorKey: "actions",
  //   id: "actions",
  //   cell: ({ row }) => {

  //     //should add prompt component for delete
  //     const companyInfo = row.original;
  //     // const { remove } = useCompany(
  //     //   `/${companyInfo.id}`,
  //     //   "companies",
  //     //   companyInfo.id
  //     // );
  //     // const deleteCompany = () => {
  //     //   remove.mutate(companyInfo.companyId);
  //     // };
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
  //           {/* <DropdownMenuItem onClick={(deleteCompany)}>Delete</DropdownMenuItem> */}

  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Copy User ID</DropdownMenuItem>

  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>
  //             <Link
  //               to={`/dashboard/companyProfile/${companyInfo.id}`}
  //               state={{ data: companyInfo }}
  //             >
  //               View Company
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>
  //             <Link
  //               to={`${companyInfo.id}`}
  //               state={{ data: companyInfo }}
  //             >
  //               Edit Company
  //             </Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];