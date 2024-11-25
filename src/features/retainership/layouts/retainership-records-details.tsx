import { Separator } from "@/components/ui/separator";
import DetailsCard from "../components/tables/details-card";
import PermitsCard from "../components/tables/permits-card";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReportingCard from "../components/tables/reporting-card";
import ComplianceCard from "../components/tables/compliance-card";

// Define the type for the detailedData object
interface ProjectDetails {
  details: {
    projectName: string;
    caseHandler: string;
    nda: string;
    companyName: string;
    companyContactNumber: string;
    companyEmail: string;
    contactNumber: string;
    contactEmail: string;
    companyAddress: string;
  };
  permits: { name: string; status: string; link: string }[];
}

type ProjectId = "PID-2024-001" | "PID-2024-002" | "PID-2024-003";

const detailedData: Record<ProjectId, ProjectDetails> = {
  "PID-2024-001": {
    details: {
      projectName: "Project Alpha",
      caseHandler: "John Doe",
      nda: "NDA-001",
      companyName: "Acme Corp",
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
      projectName: "Project Beta",
      caseHandler: "Jane Smith",
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
      projectName: "Project Gamma",
      caseHandler: "Robert Brown",
      nda: "NDA-003",
      companyName: "Gamma LLC",
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

const RetainershipRecordDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  // Determine the navigation path based on the previous location
  const previousPath = location.state?.from || `/dashboard/retainership/list`;
  const { projectId } = useParams<{ projectId: ProjectId }>();

  const recordData = detailedData[projectId!];

  return (
    <div>
      <Button className="sticky top-0 bg-white bg-opacity-50 border-none rounded-lg p-2 shadow-md">
        <NavLink to={previousPath}>
          <ArrowLeft className="text-black hover:text-white" />
        </NavLink>
      </Button>
      <div className="flex flex-col gap-4 w-full h-full bg-white p-8">
        
        <h4 className="font-medium text-[28px] text-gray-700">Details</h4>
        <p className="text-[#404041]">
          This section provides an overview of key information, including foundational data and specifics about the process, project, or entity being addressed.
        </p>
        {/* Insert Details Card */}
        <DetailsCard data={recordData.details} />
        <Separator />
        <h4 className="font-medium text-[28px] text-gray-700">Permits</h4>
        <p className="text-[#404041]">
          The Permits section manages required approvals and licenses necessary to proceed with operations, ensuring compliance with regulatory standards.
        </p>
        {/* Insert Permits Card */}
        <PermitsCard permits={recordData.permits} />
        <Separator />
        <h4 className="font-medium text-[28px] text-gray-700">Reporting</h4>
        <p className="text-[#404041]">
          This section includes tools and templates for tracking, summarizing, and analyzing data to monitor progress and performance.
        </p>
        {/* Insert Reporting Card */}
        <ReportingCard />

        <Separator />
        <h4 className="font-medium text-[28px] text-gray-700">Compliance</h4>
        <p className="text-[#404041]">
          The Compliance section ensures adherence to industry regulations, internal policies, and legal standards, with resources for maintaining accountability.
        </p>
        {/* Insert Compliance Card */}
        <ComplianceCard />

        <Separator />
      </div>
    </div>
  );
};

export default RetainershipRecordDetails;
