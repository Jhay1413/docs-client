import { Plus } from "lucide-react";
import { companyInfoColumns } from "./company-columns";
import { DataTable } from "@/components/data-table";
import { useCompanies } from "../hooks/query-gate";
import { Link } from "react-router-dom";

export const CompanyList = () => {
  const { entities } = useCompanies("companies", "/");

  console.log(entities.data)
  if (!entities.data) {
    return "No Data !";
  }

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
    <div className="flex justify-start w-full flex-col ">
      <h1 className="text-[#404041] font-medium text-[28px]">
        List of Companies
      </h1>
      <p className="text-muted-foreground text-[12px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing.
      </p>
    </div>
    <div className="flex  bg-black w-full relative">
   
        <div className="absolute bottom-0 top-4">
          <Link
            to="add-form"
            className="bg-[#414140] px-4 py-2 text-lg flex  items-center justify-center space-x rounded-lg text-white"
          >
            <Plus size={24} />
            <h1>Add Company</h1>
          </Link>
        </div>
      
    </div>
      <DataTable columns={companyInfoColumns} data={entities.data} hasSearch={true} />
    </div>
  );
};
