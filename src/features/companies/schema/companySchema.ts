import { z } from "zod";

export const contactPerson = z.object({
  name: z.string(),
  contactNumber: z.string(),
  email: z.nullable(z.string()),
});
export const companyProject = z.object({
  projectId: z.string(),
  id: z.optional(z.string()),
  projectName: z.string(),
  projectAddress: z.string(),
  retainer: z.boolean(),
  date_expiry: z.nullable(z.date()),
  email: z.nullable(z.string()),
  contactPersons: contactPerson.optional(),
});

export const CompanyInfo = z.object({
  id: z.optional(z.string()),
  companyId: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  contactPersons: z.nullable(contactPerson),
  email: z.nullable(z.string()),
  companyProjects: z.array(companyProject).optional(),
});
