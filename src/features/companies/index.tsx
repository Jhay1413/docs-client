import { CompanyList } from "./components/company-list";
import { useCompanies } from "./hooks/useCompanyHooks";
import { CompanyInfo, TCompany, TCompanyFullInfo } from "./schema/companySchema";

export {
    CompanyList,
    CompanyInfo,
    useCompanies
}
export type {
    TCompany,
    TCompanyFullInfo
}