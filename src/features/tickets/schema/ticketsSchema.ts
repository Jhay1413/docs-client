import { z } from "zod";

export const TicketInfo = z.object({
  ticketId: z.string(),
  subject: z.string(),
  section: z.string(),
  status: z.string(),
  remarks: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});