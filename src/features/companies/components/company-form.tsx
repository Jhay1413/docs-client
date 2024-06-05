import { SubmitHandler, useForm } from "react-hook-form"
import { TCompanyFullInfo, companyFullInfo } from "../schema/companySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"


export const CompanyForm = () =>{
                
    const form = useForm<TCompanyFullInfo>({
        resolver : zodResolver(companyFullInfo),
        defaultValues:{
            companyId: "",
            companyAddress:"",
            companyName:"",
            companyProjects : [{
                projectName: "",
                projectAddress: "",
                contactPerson: [
                    {
                        name:"",
                        contactNumber:""
                    }
                ]
            }] || null,
            contactPerson :[{
                name:"",
                contactNumber:""
            }] || null
        }
    })

    const onSubmit:SubmitHandler<TCompanyFullInfo> = (data)=>{


    }
    return (
       <div className= "flex flex-col p-4 w-full h-full ">
            <Form {...form}>
                <form></form>
            </Form>

       </div>
    )
}