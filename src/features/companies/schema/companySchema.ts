import { z } from "zod";

export const companyProject = z.object({
  projectId : z.string(),
  id: z.optional(z.string()),
  projectName: z.string(),
  projectAddress: z.string(),
  retainer: z.boolean(),
  date_expiry: z.nullable(z.date()),
  email : z.nullable(z.string()),
});
export const contactPerson = z.object({
  name: z.string(),
  contactNumber: z.string(),
  email : z.nullable(z.string()),
});
export const CompanyInfo = z.object({
  id: z.optional(z.string()),
  companyId: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  contactPersons: z.nullable(contactPerson),
  email : z.nullable(z.string()),
});

export const projectWithContact = companyProject.extend({
  contactPersons: z.nullable(contactPerson),
});
export const companyFullInfo = CompanyInfo.extend({
  companyProjects: z.array(projectWithContact),
});

export const companyFullData = companyFullInfo
  .omit({
    companyProjects: true,
    contactPersons: true,
  })
  .extend({
    companyProjects: z.array(
      z.object({
        id: z.optional(z.string()),
        projectName: z.string(),
        projectAddress: z.string(),
        retainer: z.boolean(),
        date_expiry: z.nullable(z.date()),
        contactPersons: z.nullable(z.array(contactPerson)),
      })
    ),
    contactPersons: z.nullable(z.array(contactPerson)),
  });
export const companyFullDataArray = z.array(companyFullData);


export type TCompanyFullDataArray = z.infer<typeof companyFullDataArray>
export type TCompanyFullData = z.infer<typeof companyFullData>;
export type TProject = z.infer<typeof companyProject>;
export type TCompany = z.infer<typeof CompanyInfo>;
export type TCompanyFullInfo = z.infer<typeof companyFullInfo>;
