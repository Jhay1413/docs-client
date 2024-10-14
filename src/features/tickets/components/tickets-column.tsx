import { ColumnDef } from "@tanstack/react-table";

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
    header: "Status",
 accessorKey: "status",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
  },
];