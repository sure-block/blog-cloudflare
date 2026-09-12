import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { MessagesTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const MessageSelectSchema = createSelectSchema(MessagesTable, {
  createdAt: coercedDate,
});
export const MessageInsertSchema = createInsertSchema(MessagesTable);
export const MessageUpdateSchema = createUpdateSchema(MessagesTable);

// ==================== API Input Schemas ====================
export const CreateMessageInputSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.number().nullable().optional(),
  emailUserName: z.string().max(50).optional(),
  emailUserAvatar: z.string().max(500).optional(),
});

export const UpdateMessageInputSchema = z.object({
  id: z.number(),
  data: z.object({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  }),
});

export const DeleteMessageInputSchema = z.object({
  id: z.number(),
});

export const GetMessagesInputSchema = z.object({
  cursor: z.number().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

// ==================== Types ====================
export type Message = typeof MessagesTable.$inferSelect;
export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageInputSchema>;
export type DeleteMessageInput = z.infer<typeof DeleteMessageInputSchema>;
export type GetMessagesInput = z.infer<typeof GetMessagesInputSchema>;
