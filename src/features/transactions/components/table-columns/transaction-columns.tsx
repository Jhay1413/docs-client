import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert } from "lucide-react";
import { transactionTable } from "shared-contract";
import "./styles.css";

type TransactionInfo = z.infer<typeof transactionTable>;

interface tolowerCapitalizeProps {
  tolowerCapitalize: string;
}

const TolowerCapitalize: React.FC<tolowerCapitalizeProps> = ({ tolowerCapitalize }) => {
  return (
    <h1 className="lowercasetoCapitalize whitespace-nowrap overflow-hidden text-ellipsis">
      {tolowerCapitalize
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")}
    </h1>
  );
};

export const transColumns: ColumnDef<TransactionInfo>[] = [
  {
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Transaction ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "transactionId",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const current = new Date();
      const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()); // Create a date object for the current date
      const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
      const transactionId = transactionInfo.transactionId;
      
      return (
        <div className="flex gap-2 items-center w-auto text-nowrap">
          <span className="">{transactionId}</span> {/* Set a fixed width and align text to the right */}
          {
            transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() > dueDate.getTime() ? (
              <span title="Overdue">
                <CircleAlert size={20} className="text-red-500" />
              </span>
            ) : transactionInfo.status !== "ARCHIVED" && transactionInfo.status !== "DROP" && currentDate.getTime() === dueDate.getTime() ? (
              <span title="Due Today">
                <CircleAlert size={20} className="text-yellow-500" />
              </span>
            ) : null
          }
        </div>
      );
    },
  },
  {
    header: "Company Name",
    accessorKey: "companyName",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="">
          <TolowerCapitalize tolowerCapitalize={data.company.companyName} />
        </div>
      );
    },
  },
  {
    header: "Project Name",
    accessorKey: "projectName",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="font-bold">
          <TolowerCapitalize tolowerCapitalize={data.project?.projectName} />
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "documentType",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <TolowerCapitalize tolowerCapitalize={data.documentType!} />
        </div>
      );
    },
  },
  {
    header: "Subtype",
    accessorKey: "documentSubType",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <TolowerCapitalize tolowerCapitalize={data.documentSubType!} />
        </div>
      );
    },
  },
  {
    header: "Subject",
    accessorKey: "subject",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <TolowerCapitalize tolowerCapitalize={data.subject!} />
        </div>
      );
    },
  },
  {
    header: "Forwarder",
    accessorKey: "forwarder",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <TolowerCapitalize tolowerCapitalize={data.forwarder!} />
        </div>
      );
    },
  },
  {
    header: "Receiver",
    accessorKey: "receiver",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="font-bold">
          <TolowerCapitalize tolowerCapitalize={data.receiver!} />
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <TolowerCapitalize tolowerCapitalize={data.status} />
        </div>
      );
      // <h1 className="hyphens-none">{data.status}</h1>;
    },
  },
  {
    header: "Priority",
    accessorKey: "priority",
  },

  {
    header: "Percentage",
    accessorKey: "percentage",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <div>{transactionInfo.percentage}%</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const transactionInfo = row.original;
      const dueDate = new Date(transactionInfo.dueDate); // Convert dueDate to a Date object
      
      return (
        <span className="text-nowrap">{dueDate.toDateString()}</span>
      );
    },
  },
];
