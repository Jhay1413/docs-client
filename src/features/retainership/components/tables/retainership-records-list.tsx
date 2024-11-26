import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import RetainershipRecordDetails from "../../layouts/retainership-records-details";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

interface RetainershipRecord {
  projectId: string;
  projectName: string;
  companyName: string;
  status: string;
  caseHandler: string;
  contactNumber: string;
}

// Sample Hard-coded data for testing of UI
const retainershipRecords: RetainershipRecord[] = [
  { projectId: "PID-2024-001", projectName: "Project Alpha", companyName: "Walter and Shields Co",  status: "Active", caseHandler: "John Doe", contactNumber: "987-654-3210" },
  { projectId: "PID-2024-002", projectName: "Project Beta", companyName: "Beta Corp", status: "Pending", caseHandler: "Jane Smith", contactNumber: "654-321-9870"},
  { projectId: "PID-2024-003", projectName: "Project Gamma", companyName: "Wilder and Huffman LLC", status: "Completed", caseHandler: "Robert Brown", contactNumber: "696-969-6969" },
];
const detailedData = {
  "PID-2024-001": {
    details: {
      projectName: "Jackson and Hatfield Traders",
      caseHandler: "Philip CH-EPD",
      nda: "NDA-001",
      companyName: "Walter and Shields Co",
      companyContactNumber: "123-456-7890",
      companyEmail: "contact@acmecorp.com",
      contactNumber: "987-654-3210",
      contactEmail: "johndoe@acmecorp.com",
      companyAddress: "123 Business St., Metropolis, CA",
    },
    permits: [
      { name: "ECC", status: "Approved", link: "https://example.com/ecc" },
      { name: "PO", status: "Pending", link: "https://example.com/po" },
    ],
  },
  "PID-2024-002": {
    details: {
      projectName: "Hines Chapman Traders",
      caseHandler: "Philip CH-EPD",
      nda: "NDA-002",
      companyName: "Beta Corp",
      companyContactNumber: "321-654-0987",
      companyEmail: "contact@betacorp.com",
      contactNumber: "654-321-9870",
      contactEmail: "janesmith@betacorp.com",
      companyAddress: "456 Corporate Ave., Metropolis, CA",
    },
    permits: [
      { name: "DP", status: "Approved", link: "https://example.com/dp" },
      { name: "WP", status: "Pending", link: "https://example.com/wp" },
    ],
  },
  "PID-2024-003": {
    details: {
      projectName: "Frazier and Hurst Trading",
      caseHandler: "Mariko CH-ITOP",
      nda: "NDA-003",
      companyName: "Wilder and Huffman LLC",
      companyContactNumber: "555-555-5555",
      companyEmail: "contact@gammallc.com",
      contactNumber: "666-666-6666",
      contactEmail: "robertbrown@gammallc.com",
      companyAddress: "789 Gamma Road, Gotham, NY",
    },
    permits: [
      { name: "BP", status: "Expired", link: "https://example.com/bp" },
    ],
  },
};

const RetainershipRecordsList: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation();
  const handleOnClickRow = (data: RetainershipRecord) => {
    const { projectId } = data; // Extract projectId from the row data
    navigate(`/dashboard/retainership/details/${projectId}`, {
      state: { from: location.pathname }, // Pass the previous location for reference
    });
  };
  
  const columns: ColumnDef<RetainershipRecord>[] = [
    {
      accessorKey: "projectId",
      header: "Project ID",
      cell: ({ row }) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => {
            navigate(`/dashboard/retainership/details/${row.original.projectId}`);
          }}
        >
          {row.original.projectId}
        </button>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
      cell: (info) => info.getValue(),
    },
    {
        accessorKey: "companyName",
        header: "Company Name",
        cell: (info) => info.getValue(),
      },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "caseHandler",
      header: "Case Handler",
      cell: (info) => info.getValue(),
    },
    {
        accessorKey: "contactNumber",
        header: "Contact Number",
        cell: (info) => info.getValue(),
      },
  ];

  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center w-full pb-4">
          <div className="flex justify-start w-full flex-col">
          <h1 className="text-[#404041] font-medium text-[28px]">Retainership Records</h1>
          <p className="text-muted-foreground text-[12px] truncate">View and manage the retainership.</p>
          </div>
        </div>

      <div className="w-full">
        <DataTable columns={columns} data={retainershipRecords} hasSearch={true} hasPaginate={true} callbackFn={handleOnClickRow}/>
      </div>
      {selectedRecord && (
        <div className="mt-8">
          <h4 className="font-medium text-[28px] text-gray-700">
            Details for {selectedRecord}
          </h4>
          <Separator />
          <RetainershipRecordDetails />
        </div>
      )}

    </div>
  </div>
  );
};

export default RetainershipRecordsList;
