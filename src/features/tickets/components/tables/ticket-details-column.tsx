import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import { z } from "zod";
import { toPascalCase } from "../ticket.utils";
import { ticketLogsSchema } from "shared-contract";
import AttachmentsModal from "./attachments-modal";

const maxLength = 50;
export const ticketsDetailsColumn: ColumnDef<z.infer<typeof ticketLogsSchema>>[] = [
  {
    header: () => <span className="font-bold text-nowrap">Status</span>,
    accessorKey: "status",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      const statusInPascalCase = toPascalCase(ticketInfo.status || "");
      return <span>{statusInPascalCase}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Priority</span>,
    accessorKey: "priority",
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Forwarded</span>,
    accessorKey: "dateForwarded",
    cell: ({ row }) => {
      const ticketInfo = row.original;

      return <span>{ticketInfo.dateForwarded ? new Date(ticketInfo.dateForwarded).toDateString() : "No Date Available"}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Forwarded By</span>,
    accessorKey: "sender",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = `${transactionInfo.sender}`.toLocaleLowerCase();
      const new_name = toPascalCase(name);
      return <span>{new_name}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Received</span>,
    accessorKey: "dateReceived",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.dateReceived ? new Date(ticketInfo.dateReceived).toDateString() : "Not yet received"}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Forwarded To</span>,
    accessorKey: "receiver",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const name = `${transactionInfo.receiver}`.toLocaleLowerCase();
      const new_name = toPascalCase(name);
      console.log(transactionInfo)
      return <span>{transactionInfo.receiver ? new_name : "--"}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Remarks</span>,
    accessorKey: "remarks",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const requestDetails = transactionInfo.remarks || "";
      return <span>{requestDetails.length > maxLength ? `${requestDetails.substring(0, maxLength)}...` : requestDetails}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Created</span>,
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.createdAt ? new Date(ticketInfo.createdAt).toDateString() : "No Date Available"}</span>;
    },
  },
  {
    header: () => <span className="font-bold text-nowrap">Date Updated</span>,
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const ticketInfo = row.original;
      return <span>{ticketInfo.updatedAt ? new Date(ticketInfo.updatedAt).toDateString() : "No Date Available"}</span>;
    },
  },
  {
    header: "Attachments",
    accessorKey: "attachments",
    cell: ({ row }) => {
      const attachments: string[] = row.original.attachments;
      return attachments.length > 0 ? (
        <AttachmentsModal attachments={attachments} />
      ) : (
        "No attachments"
      );
    }
  }
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
