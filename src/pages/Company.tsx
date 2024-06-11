import { CompanyList, companyFullDataArray, useCompanies } from "@/features/companies"

export const Company = () =>{
   
    const {companies} = useCompanies('companies')
   
    const validatedData = companyFullDataArray.safeParse(companies.data)
    
    if(!validatedData.data){
        return ""
    }
    return (
        <CompanyList data = {validatedData.data}/>

    )
}