import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

export const PROJECT_STATUSES = [
  "developing",
  "finished",
  "archived",
] as const;

/** 项目展示（映射第二站 Project 表） */
export const ProjectsTable = sqliteTable(
  "projects",
  {
    id,
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull().default(""),
    longDescription: text("long_description").notNull().default(""),
    coverImage: text("cover_image").notNull().default(""),
    techStack: text("tech_stack", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default([]),
    linkGithub: text("link_github").notNull().default(""),
    linkGitee: text("link_gitee").notNull().default(""),
    linkLive: text("link_live").notNull().default(""),
    linkDocs: text("link_docs").notNull().default(""),
    status: text("status", { enum: PROJECT_STATUSES })
      .notNull()
      .default("developing"),
    statusLabel: text("status_label").notNull().default(""),
    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("projects_status_sort_idx").on(table.status, table.sort),
    index("projects_featured_idx").on(table.isFeatured),
  ],
);

// ==================== types ====================
export type Project = typeof ProjectsTable.$inferSelect;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
