import { z } from "zod";

export const fileData = z.object({
  fileUrl: z.string(),
  fileOriginalName: z.string(),
  fileName: z.string(),
});
export const transactionData = z.object({
  transactionId: z.string(),
  documentType: z.string({
    message: "Document TYPE REQUIRED",
  }),
  subject: z.string(),
  company: z.string(),
  forwardedTo: z.string(),
  remarks: z.string(),
  createdBy: z.string(),
  fromDepartment: z.string(),
  toDepartment: z.string(),
  dueDate: z.date(),
  forwardedBy: z.string(),
  dateForwarded: z.date(),
  team: z.string(),
  documentSubType: z.string(),
  fileData: z.array(fileData).optional(),
});

export const documentInfoSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  subject: z.string(),
  dueDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  documentSubType: z.string(),
  team: z.string(),
  createdByName: z.string(),
  fromDepartment: z.string(),
  toDepartment: z.string(),
});
export type TDcoumentInfo = z.infer<typeof documentInfoSchema>;
//Transaction Types
export type TtransactionDetails = z.infer<typeof transactionData>;
