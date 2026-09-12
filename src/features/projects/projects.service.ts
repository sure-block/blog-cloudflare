import * as ProjectRepo from "@/features/projects/data/projects.data";
import type {
  CreateProjectInput,
  DeleteProjectInput,
  GetProjectsInput,
  UpdateProjectInput,
} from "@/features/projects/projects.schema";
import { err, ok } from "@/lib/errors";

/** 生成 URL 友好的 slug */
function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Get projects
 */
export async function getProjects(
  context: DbContext,
  data: GetProjectsInput = {},
) {
  const { status, featuredOnly, limit } = data;
  return await ProjectRepo.getAllProjects(context.db, {
    status,
    featuredOnly,
    limit,
  });
}

/**
 * Create a project
 */
export async function createProject(
  context: DbContext,
  data: CreateProjectInput,
) {
  const finalSlug = data.slug || slugify(data.name);
  if (await ProjectRepo.slugExists(context.db, finalSlug)) {
    return err({ reason: "PROJECT_SLUG_EXISTS" });
  }

  const project = await ProjectRepo.insertProject(context.db, {
    name: data.name,
    slug: finalSlug,
    description: data.description ?? "",
    longDescription: data.longDescription ?? "",
    coverImage: data.coverImage ?? "",
    techStack: data.techStack ?? [],
    linkGithub: data.linkGithub ?? "",
    linkGitee: data.linkGitee ?? "",
    linkLive: data.linkLive ?? "",
    linkDocs: data.linkDocs ?? "",
    status: data.status ?? "developing",
    statusLabel: data.statusLabel ?? "",
    isFeatured: data.isFeatured ?? false,
    sort: data.sort ?? 0,
  });
  return ok(project);
}

/**
 * Update a project
 */
export async function updateProject(
  context: DbContext,
  data: UpdateProjectInput,
) {
  const existing = await ProjectRepo.findProjectById(context.db, data.id);
  if (!existing) {
    return err({ reason: "PROJECT_NOT_FOUND" });
  }
  const project = await ProjectRepo.updateProject(context.db, data.id, data.data);
  return ok(project);
}

/**
 * Delete a project
 */
export async function deleteProject(
  context: DbContext,
  data: DeleteProjectInput,
) {
  const existing = await ProjectRepo.findProjectById(context.db, data.id);
  if (!existing) {
    return err({ reason: "PROJECT_NOT_FOUND" });
  }
  await ProjectRepo.deleteProject(context.db, data.id);
  return ok({ success: true });
}
