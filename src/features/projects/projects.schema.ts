import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { ProjectsTable } from "@/lib/db/schema";

const coercedDate = z.union([z.date(), z.string().pipe(z.coerce.date())]);

export const ProjectSelectSchema = createSelectSchema(ProjectsTable, {
  createdAt: coercedDate,
  updatedAt: coercedDate,
});
export const ProjectInsertSchema = createInsertSchema(ProjectsTable);
export const ProjectUpdateSchema = createUpdateSchema(ProjectsTable);

// ==================== API Input Schemas ====================
export const CreateProjectInputSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  longDescription: z.string().max(5000).optional(),
  coverImage: z.string().max(500).optional(),
  techStack: z.array(z.string()).max(30).optional(),
  linkGithub: z.string().max(500).optional(),
  linkGitee: z.string().max(500).optional(),
  linkLive: z.string().max(500).optional(),
  linkDocs: z.string().max(500).optional(),
  status: z.enum(["developing", "finished", "archived"]).optional(),
  statusLabel: z.string().max(50).optional(),
  isFeatured: z.boolean().optional(),
  sort: z.number().int().optional(),
});

export const UpdateProjectInputSchema = z.object({
  id: z.number(),
  data: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
    longDescription: z.string().max(5000).optional(),
    coverImage: z.string().max(500).optional(),
    techStack: z.array(z.string()).max(30).optional(),
    linkGithub: z.string().max(500).optional(),
    linkGitee: z.string().max(500).optional(),
    linkLive: z.string().max(500).optional(),
    linkDocs: z.string().max(500).optional(),
    status: z.enum(["developing", "finished", "archived"]).optional(),
    statusLabel: z.string().max(50).optional(),
    isFeatured: z.boolean().optional(),
    sort: z.number().int().optional(),
  }),
});

export const DeleteProjectInputSchema = z.object({
  id: z.number(),
});

export const GetProjectsInputSchema = z.object({
  status: z.enum(["developing", "finished", "archived"]).optional(),
  featuredOnly: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// ==================== Types ====================
export type Project = typeof ProjectsTable.$inferSelect;
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;
export type GetProjectsInput = z.infer<typeof GetProjectsInputSchema>;
