import { Plus } from "lucide-react";
import { companyInfoColumns } from "./company-columns";
import { DataTable } from "@/components/data-table";
import { useCompanies } from "../hooks/query-gate";
import { Link } from "react-router-dom";
import withRole from "@/components/HOC/component-permission";
import { tsr } from "@/services/tsr";


const AddCompanyBtn = () => (
  <div className="absolute bottom-0 top-4">
    <Link
      to="add-form"
      className="bg-[#414140] px-4 py-2 text-lg flex  items-center justify-center space-x rounded-lg text-white"
    >
      <Plus size={24} />
      <h1>Add Company</h1>
    </Link>
  </div>
);

const AddCompanyBtnWithRole = withRole(AddCompanyBtn)
export const CompanyList = () => {

  const {data,isPending} = tsr.company.fetchCompanies.useQuery({queryKey:['companies']});
  // const { entities } = useCompanies("companies", "/");
  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">
          List of Companies
        </h1>
        <p className="text-muted-foreground text-[12px]">
          Explore and manage company profiles. Access detailed information and
          perform necessary actions for each company.
        </p>
      </div>
      <div className="flex  bg-black w-full relative">
        <AddCompanyBtnWithRole roles={["SUPERADMIN"]} exemptions={["Operations Department"]}/>
      </div>
      <DataTable
        columns={companyInfoColumns}
        data={data?.body!}
        hasSearch={true}
      />
    </div>
  );
};
