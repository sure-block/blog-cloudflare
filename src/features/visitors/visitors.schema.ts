import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { VisitorsTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const VisitorSelectSchema = createSelectSchema(VisitorsTable, {
  createdAt: coercedDate,
});

// ==================== API Input Schemas ====================
export const GetRecentVisitorsInputSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
});

export const GetVisitorStatsInputSchema = z.object({});

export const GetVisitorsByDayInputSchema = z.object({
  days: z.number().int().min(1).max(90).optional(),
});

export const DeleteVisitorInputSchema = z.object({
  id: z.number(),
});

export const ClearVisitorsInputSchema = z.object({});

// ==================== Types ====================
export type Visitor = typeof VisitorsTable.$inferSelect;
export type GetRecentVisitorsInput = z.infer<
  typeof GetRecentVisitorsInputSchema
>;
export type GetVisitorStatsInput = z.infer<
  typeof GetVisitorStatsInputSchema
>;
export type GetVisitorsByDayInput = z.infer<
  typeof GetVisitorsByDayInputSchema
>;
export type DeleteVisitorInput = z.infer<typeof DeleteVisitorInputSchema>;
export type ClearVisitorsInput = z.infer<typeof ClearVisitorsInputSchema>;
