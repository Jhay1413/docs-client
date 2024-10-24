import { z } from "zod";

export const MAX_FILE_SIZE_50MB = 50;
export const MAX_FILE_SIZE_10MB = 10;
export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

export const ticketingMutationSchema = z.object({
    id: z.string().optional(),
    ticketId: z.string(),
    subject: z.string(),
    section: z.string(),
	division: z.string(),
    status: z.string(),
	requestType: z.string(),
    requestDetails: z.string(),
    priority: z.string(),
    dueDate: z.string().datetime(),
    dateForwarded: z.string().datetime(),
    dateReceived: z.nullable(z.string().datetime()),
    senderId: z.string(),
    receiverId: z.string(),
	requesteeId: z.string(),
    remarks: z.string().nullable(),
    projectId: z.string().nullable(),
    transactionId: z.string().nullable(),
    attachments: z.string().nullable(),
    file: z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).length !== 0;
    }, "Image is required")
    .refine((files) => {
      return Array.from(files ?? []).every((file) => sizeInMB(file.size) <= MAX_FILE_SIZE_50MB);
    }, `The maximum image size is ${MAX_FILE_SIZE_50MB}MB`)
    // .refine((files) => {
    //   return Array.from(files ?? []).every((file) =>
    //     ACCEPTED_FILE_TYPES.includes(file.type)
    //   );
    // }, "File type is not supported")
    .optional(),
});
export const ticketEditSchema = ticketingMutationSchema.extend({
    id:z.string()
});

// Schema for the tickets table
export const ticketingTableSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  subject: z.string(),
  section: z.string(),
  division: z.string(),
  status: z.string(),
  priority: z.string(),
  requestDetails: z.string(),
  dueDate: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  dateForwarded: z.string().datetime(),
  dateReceived: z.nullable(z.string().datetime()),
  receiver: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  sender: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  project: z.object({
    projectName: z.string(),
  }).nullable(),
  transactionId: z.string().nullable(),
  remarks: z.string().nullable(),
});