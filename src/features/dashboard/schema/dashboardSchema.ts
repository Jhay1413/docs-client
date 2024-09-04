import { z } from "zod";

const PrioritySchema = z.object({
  category: z.literal("Priority"),
  data: z.array(z.object({
    id: z.string(),
    percentage: z.string(),
    projectName: z.string(),
    transactionId: z.string(),
  })),
});

const PerApplication = z.object({
  category: z.literal("Per Application"),
  data: z.array(z.object({
    categoryName: z.string(),
    count: z.number(),
  })),
});

const PerSection= z.object({
  category: z.literal("Per Section"),
  data: z.array(z.object({
    categoryName: z.string(),
    count: z.number(),
  })),
});

const TotalProject = z.object({
  category: z.literal("Total Projects"),
  data: z.number(),
});

const DashboardDataSchema = z.array(
  z.union([
    PrioritySchema,
    PerApplication,
    PerSection,
    TotalProject
  ])
);

export {
    DashboardDataSchema,
    TotalProject,
    PerApplication,
    PerSection,
    PrioritySchema
}
