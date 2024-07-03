import { CompanyInfo, companyProject } from "@/features/companies";
import { AccountSchema } from "@/features/users";
import { z } from "zod";
const DocumentTypeEnum = z.enum(['INITIAL_DOC', 'FOLLOWED_UP']);

export const filesSchema = z.object({
  id:z.string().optional(),
  remarks:z.string().optional(),
  createdAt:z.string().datetime().optional(),
  documentType:DocumentTypeEnum.optional(),
  fileName: z.string(),
  fileUrl: z.string(),
  fileOriginalName: z.string(),
});
export const transactionFormData = z.object({
  id:z.string().optional(),
  transactionId:z.string(),
  documentType : z.string(),
  documentSubType:z.string(),
  subject :z.string(),
  dueDate  :  z.nullable(z.string().datetime()),
  team:z.string(),
  status:z.string(),
  priority:z.string(),
  companyId:z.string().optional(),
  projectId:z.string().optional(),
  forwardedTo:z.nullable(z.string()).optional(),
  remarks:z.string(),
  receivedById:z.nullable(z.string()).optional(),
  forwardedById:z.string(),
  dateForwarded: z.nullable(z.string().datetime()),
  dateReceived:z.nullable(z.string().datetime()).optional(),
  originDepartment:z.string(),
  targetDepartment:z.string(),
  forwardedByRole:z.string(),
  fileData: z.array(filesSchema).optional(),
})
export const transactionLogsData = z.object({
  id              :z.string().optional(),
  transactionId    :z.string(),
  documentType     :z.string(),
  subject          :z.string(),
  dueDate          :z.string().datetime(),
  documentSubType  :z.string(),
  createdAt        :z.string().datetime().optional(),    
  updatedAt        :z.string().datetime().optional(),    
  team             :z.string(),
  status           :z.string(),
  priority         :z.string(),
  company          :z.string(),
  project          :z.string(),
  forwardedTo      :z.string(),
  remarks          :z.string(),
  receivedBy       :z.nullable(z.string()).optional(),
  forwardedBy      :z.string(),
  dateForwarded    :z.string(),
  dateReceived     :z.nullable(z.string()).optional(),
  originDepartment :z.string(),
  targetDepartment :z.string(),
  forwardedByRole  :z.string(),
  attachments :  z.array(filesSchema).optional()
})

export const transactionData = transactionFormData.extend({
  forwarder:AccountSchema.optional(),
  receive:AccountSchema.optional(),
  attachment:z.nullable(z.array(filesSchema)).optional(),
  company : CompanyInfo.optional(),
  project : companyProject.optional(),
  transactionLogs:z.array(transactionLogsData).optional()
  
}).omit({
 
  
})

//Transaction Types
