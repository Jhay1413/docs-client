import { Plus } from "lucide-react";
import { companyInfoColumns } from "./company-columns";
import { DataTable } from "@/components/data-table";
import { useCompanies } from "../hooks/query-gate";
import { Link } from "react-router-dom";

export const CompanyList = () => {
  const { entities } = useCompanies("companies", "/");

  if (!entities.data) {
    return "No Data !";
  }

  return (
    <div className="flex flex-col w-full items-center justify-center bg-white rounded-lg">
      <div className="flex justify-start w-full text-4xl">
        <h1>List of Companies</h1>
      </div>
      <div className="justify-start w-full flex mt-12 ">
        <Link
          to="add-form"
          className="flex px-4 py-2 bg-black text-white rounded-xl items-center justify-center"
        >
          <Plus size={24} />
          <h1>New Company</h1>
        </Link>
      </div>
      <DataTable columns={companyInfoColumns} data={entities.data} />
    </div>
  );
};
