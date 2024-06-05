import { CompanyList, useCompanies } from "@/features/companies"

export const Company = () =>{

    const {companies} = useCompanies('companies')
    


    return (
        <CompanyList {...companies}/>
    )
}