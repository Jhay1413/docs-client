import { z } from "zod";

const PrioritySchema = z.array(
  z.object({
    id: z.string(),
    percentage: z.number(),
    project: z.object({
      projectName: z.string(),
    }),
    transactionId: z.string(),
  }),
);

const PerApplication = z.array(
  z.object({
    category: z.string(),
    count: z.number(),
  }),
);

const PerSection = z.object({
  category: z.literal("Per Section"),
  data: z.array(
    z.object({
      categoryName: z.string(),
      count: z.number(),
    }),
  ),
});

const TotalProject = z.object({
  category: z.literal("Total Projects"),
  data: z.number(),
});

const DashboardDataSchema = z.array(z.union([PrioritySchema, PerApplication, PerSection, TotalProject]));
const ConferenceFormSchema = z.object({
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
});

const conferenceCalendarData = z.object({
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});
export { DashboardDataSchema, TotalProject, PerApplication, PerSection, PrioritySchema, conferenceCalendarData, ConferenceFormSchema };
