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
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { completeStaffWork, transactionLogsData } from "../../schema/TransactionSchema";
import { getSignUrlForView } from "../../services/getSignedUrl";
import { completeStaffWorkQuerySchema } from "shared-contract";

type Csw = z.infer<typeof completeStaffWorkQuerySchema>;

export const cswColumn: ColumnDef<Csw>[] = [
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const cswData = row.original;

      return (
        <div className="flex items-center">
          <h1>{new Date(cswData.date).toDateString()}</h1>
        </div>
      );
    },
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
    cell: ({ row }) => {
      const cswData = row.original;

      return (
        <div className="flex items-center">
          <h1>{cswData.remarks}</h1>
        </div>
      );
    },
  },
  // {
  //   header: () => <div className="print-hide">Action</div>,
  //   accessorKey: "actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const cswInfo = row.original;
  //     const viewFile = async (key: string) => {
  //       const signedUrl = await getSignUrlForView(key);

  //       if (signedUrl) {
  //         window.open(signedUrl);
  //       }
  //     };

  //     return (
  //       <div className="print-hide">
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>

  //             <DropdownMenuItem onClick={() => viewFile(cswInfo.attachmentUrl!)}>View File</DropdownMenuItem>

  //             <DropdownMenuSeparator />
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </div>
  //     );
  //   },
  // },
];
