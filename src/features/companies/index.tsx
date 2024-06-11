import { CompanyForm } from "./components/company-form";
import { CompanyList } from "./components/company-list";
import { CompanyProfile } from "./components/company-profile";
import { useCompanies } from "./hooks/useCompanyHooks";
import { CompanyInfo, TCompany, TCompanyFullData, TCompanyFullInfo, companyFullData, companyFullDataArray } from "./schema/companySchema";

export {
    CompanyList,
    CompanyInfo,
    useCompanies,
    CompanyForm,
    CompanyProfile,
    companyFullData,
    companyFullDataArray
}
export type {
    TCompany,
    TCompanyFullInfo,
    TCompanyFullData
}