
import { CompanyForm } from "./components/company-form";
import { CompanyList } from "./components/company-list";
import { CompanyProfile } from "./components/company-profile";
import { useCompanies } from "./hooks/query-gate";
// import { useCompanies } from "./hooks/useCompanyHooks";
import { CompanyInfo, companyProject } from "./schema/companySchema";

export {
    CompanyList,
    CompanyInfo,
    useCompanies,
    CompanyForm,
    CompanyProfile,
 
    companyProject
}