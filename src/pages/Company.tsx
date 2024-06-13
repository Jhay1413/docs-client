import { CompanyList, companyFullDataArray, useCompanies } from "@/features/companies"

export const Company = () =>{
   
    const {companies} = useCompanies('companies')
  

    const validatedData = companyFullDataArray.safeParse(companies.data)
    if(!validatedData.success){
        return ""
    }
    return (
        <CompanyList data = {validatedData.data}/>

    )
}