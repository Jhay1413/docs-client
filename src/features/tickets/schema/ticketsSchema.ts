import { z } from "zod";

//ticketform - to submit to database
export const ticketingFormData = z.object({
  // id: z.string().optional(), //remove
  ticketId: z.string(),
  requestType: z.string(),
  subject: z.string(),
  section: z.string(),
  division: z.string(),
  status: z.string(),
  requestDetails: z.string(),
  priority: z.string(),
  dueDate: z.string().datetime(),
  senderId: z.string(),
  receiverId: z.string(),
  requesteeId: z.string(),
  remarks: z.string().nullable(),
  projectId: z.string().nullable(),
  transactionId: z.string().nullable(),
  attachments: z.string().nullable(),
});


//ticketlist - to display in the table list
export const ticketingQueryData = z.object({
  id: z.string(),
  ticketId: z.string(),
  requestType: z.string(),
  subject: z.string(),
  section: z.string(),
  division: z.string(),
  status: z.string(),
  requestDetails: z.string(),
  priority: z.string(),
  dueDate: z.string().datetime(),
  senderId: z.string(),
  receiverId: z.string(),
  requesteeId: z.string(),
  remarks: z.string().nullable(),
  projectId: z.string().nullable(),
  transactionId: z.string().nullable(),
  attachments: z.string().nullable(),
});