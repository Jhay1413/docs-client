export const MAX_FILE_SIZE_50MB = 50;
export const MAX_FILE_SIZE_10MB = 10;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

import { CompanyInfo, companyProject } from "@/features/companies";
import { AccountSchema } from "@/features/users";
import { z } from "zod";

export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};
const FileTypeEnum = z.enum(["INITIAL_DOC", "FOLLOWED_UP"]);
export const filesSchema = z.object({
  id: z.string().optional(),
  remarks: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  fileType: FileTypeEnum.optional(),
  fileName: z.nullable(z.string()),
  fileStatus: z.nullable(z.string()).optional(),
  fileUrl: z.nullable(z.string()).optional(),
  fileOriginalName: z.nullable(z.string()).optional(),
    file:  z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).length !== 0;
    }, "Image is required")
    .refine((files) => {
      return Array.from(files ?? []).every(
        (file) => sizeInMB(file.size) <= MAX_FILE_SIZE_10MB
      );
    }, `The maximum image size is ${MAX_FILE_SIZE_10MB}MB`)
    .refine((files) => {
      return Array.from(files ?? []).every((file) =>
        ACCEPTED_FILE_TYPES.includes(file.type)
      );
    }, "File type is not supported")
    .optional(),

});
export const transactionFormData = z.object({
  id: z.string().optional(),
  transactionId: z.string(),
  documentType: z.string(),
  documentSubType: z.string(),
  subject: z.string(),
  dueDate: z.nullable(z.string().datetime()),
  team: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  companyId: z.string().optional(),
  projectId: z.string().optional(),
  forwardedTo: z.nullable(z.string()).optional(),
  remarks: z.string().optional(),
  receivedById: z.nullable(z.string()).optional(),
  forwardedById: z.nullable(z.string()).optional(),
  dateForwarded: z.nullable(z.string().datetime()),
  dateReceived: z.nullable(z.string().datetime()).optional(),
  originDepartment: z.string(),
  targetDepartment: z.string(),
  forwardedByRole: z.string().optional(),
  attachments: z.array(filesSchema).optional(),
});
export const transactionLogsData = z.object({
  id: z.string().optional(),
  transactionId: z.string(),
  documentType: z.string(),
  subject: z.string(),
  dueDate: z.string().datetime(),
  documentSubType: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  team: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  company: z.string(),
  project: z.string(),
  forwardedTo: z.string(),
  remarks: z.string(),
  receivedBy: z.nullable(z.string()).optional(),
  forwardedBy: z.string(),
  dateForwarded: z.string(),
  dateReceived: z.nullable(z.string()).optional(),
  originDepartment: z.string(),
  targetDepartment: z.string(),
  forwardedByRole: z.string(),
  attachments: z.array(filesSchema).optional(),
});
export const completeStaffWork = z.object({
  id:z.string().optional(),
  date: z.string().datetime(),
  remarks :z.string(),
  createdAt:z.string().optional(),
  updatedAt :z.string().optional(),
  transactionId : z.string().optional(),
  attachmentFile :  z
  .custom<FileList>()
  .refine((files) => {
    return Array.from(files ?? []).length !== 0;
  }, "Image is required")
  .refine((files) => {
    return Array.from(files ?? []).every(
      (file) => sizeInMB(file.size) <= MAX_FILE_SIZE_10MB
    );
  }, `The maximum image size is ${MAX_FILE_SIZE_10MB}MB`)
  .refine((files) => {
    return Array.from(files ?? []).every((file) =>
      ACCEPTED_FILE_TYPES.includes(file.type)
    );
  }, "File type is not supported").optional(),
  attachmentUrl : z.string().optional()

})
export const transactionData = transactionFormData
  .extend({
    forwarder: AccountSchema.optional(),
    receive: z.nullable(AccountSchema).optional(),
    attachment: z.nullable(z.array(filesSchema)).optional(),
    company: CompanyInfo.optional(),
    project: companyProject.optional(),
    transactionLogs: z.array(transactionLogsData).optional(),
    completeStaffWork : z.array(completeStaffWork).optional(),
    percentage : z.string().optional()
  })
  .omit({});


export const signedUrlData = z.object({

  company:z.string(),
  fileName:z.string(),
  signedUrl:z.string().optional(),
  uploadStatus:z.boolean().optional(),
  signedStatus : z.boolean().optional(),
  key:z.nullable(z.string()).optional(),
  fileOriginalName:z.nullable(z.string()).optional(),
  index:z.number().optional(),
})

export const signedUrlDataArray = z.array(signedUrlData)
//Transaction Types
