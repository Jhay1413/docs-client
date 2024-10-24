import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { transactionTable } from "shared-contract";
import './styles.css';

type TransactionInfo = z.infer<typeof transactionTable>;

interface tolowerCapitalizeProps {
  tolowerCapitalize: string;
}

const TolowerCapitalize: React.FC<tolowerCapitalizeProps> = ({ tolowerCapitalize }) => {
  return (
    <h1 className="lowercasetoCapitalize whitespace-nowrap overflow-hidden text-ellipsis">
      {tolowerCapitalize
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')}
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
      const data = row.original;

      return (
        <div className="text-center">
          <h1>{data.transactionId}</h1>
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

      return  <div className="font-bold">
        <TolowerCapitalize tolowerCapitalize={data.project?.projectName} />
      </div>;
    },
  },
  {
    header: "Type",
    accessorKey: "documentType",
    cell: ({ row }) => {
      const data = row.original;

      return   <div>
        <TolowerCapitalize tolowerCapitalize={data.documentType!} />
      </div>;
    },
    
  },
  {
    header: "Subtype",
    accessorKey: "documentSubType",
    cell: ({ row }) => {
      const data = row.original;

      return   <div>
        <TolowerCapitalize tolowerCapitalize={data.documentSubType!} />
      </div>;
    },
  },
  {
    header: "Subject",
    accessorKey: "subject",
    cell: ({ row }) => {
      const data = row.original;

      return   <div>
        <TolowerCapitalize tolowerCapitalize={data.subject!} />
      </div>;
    }, 
  },
  {
    header: "Forwarder",
    accessorKey: "forwarder",
    cell: ({ row }) => {
      const data = row.original;

      return   <div>
        <TolowerCapitalize tolowerCapitalize={data.forwarder!} />
      </div>;
    },
  },
  {
    header: "Receiver",
    accessorKey: "receiver",
    cell: ({ row }) => {
      const data = row.original;

      return  <div className="font-bold">
        <TolowerCapitalize tolowerCapitalize={data.receiver!} />
      </div>
      ;
      
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const data = row.original;

      return       <div>
      <TolowerCapitalize tolowerCapitalize={data.status} />
    </div>;
    // <h1 className="hyphens-none">{data.status}</h1>;
    },
  },
  {
    header: "Priority",
    accessorKey: "priority",
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

      return <span>{new Date(transactionInfo.dueDate).toDateString()}</span>;
    },
  },
  {
    header: "Percentage",
    accessorKey: "percentage",
    cell: ({ row }) => {
      const transactionInfo = row.original;

      return <div>{transactionInfo.percentage}</div>;
    },
  },
];


