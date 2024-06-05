import { z } from "zod";


export const CompanyInfo = z.object({
    id : z.string(),
    companyId:z.string(),
    companyName:z.string(),
    companyAddress:z.string(),

})
export const companyProject = z.object({
    id:z.string(),
    projectName:z.string(),
    projectAddress:z.string(),

})
export const contactPerson = z.object({
    id:z.string(),
    name:z.string(),

    contactNumber:z.string()
})

export const projectWithContact = companyProject.extend({
    contactPerson : z.nullable(z.array(contactPerson))
})
export const companyFullInfo = CompanyInfo.extend({
    companyProjects : z.array(projectWithContact),
    contactPerson : z.nullable(z.array(contactPerson))
})

export type TCompany = z.infer<typeof CompanyInfo>
export type TCompanyFullInfo = z.infer<typeof companyFullInfo>