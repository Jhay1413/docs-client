import { Link } from "react-router-dom";
import { TCompany } from "../schema/companySchema";
import { Plus } from "lucide-react";
import { companyInfoColumns } from "./company-columns";
import { DataTable } from "@/components/data-table";

export const CompanyList = (companies: TCompany[]) => {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-white rounded-lg">
      <div className="flex justify-start w-full text-4xl">
        <h1>List of Companies</h1>
      </div>
      <div className="justify-start w-full flex mt-12 ">
        <Link
          to="/dashboard/userForm"
          className="bg-black px-4 py-2 text-lg flex  items-center justify-center space-x-2 rounded-lg text-white"
        >
          <Plus size={24} />
          <h1>New Company</h1>
        </Link>
      </div>
      <DataTable columns={companyInfoColumns} data={companies}/>
    </div>
  );
};
