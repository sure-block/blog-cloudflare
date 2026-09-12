import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";
import { z } from "zod";
import { LoginLogsTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const LoginLogSelectSchema = createSelectSchema(LoginLogsTable, {
  operatingTime: coercedDate,
});
export const LoginLogInsertSchema = createInsertSchema(LoginLogsTable);

// ==================== API Input Schemas ====================
export const GetLoginLogsInputSchema = z.object({
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  success: z.boolean().optional(),
});

// ==================== Types ====================
export type LoginLog = typeof LoginLogsTable.$inferSelect;
export type GetLoginLogsInput = z.infer<typeof GetLoginLogsInputSchema>;
