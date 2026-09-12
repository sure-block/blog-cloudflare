import { createServerFn } from "@tanstack/react-start";
import * as ProjectService from "@/features/projects/projects.service";
import {
  CreateProjectInputSchema,
  DeleteProjectInputSchema,
  GetProjectsInputSchema,
  UpdateProjectInputSchema,
} from "@/features/projects/projects.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

// ============ Public API ============

/** 公开：项目列表 */
export const getProjectsFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetProjectsInputSchema)
  .handler(async ({ data, context }) => {
    return await ProjectService.getProjects(context, data);
  });

// ============ Admin API ============

/** 管理端：创建项目 */
export const createProjectFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateProjectInputSchema)
  .handler(({ data, context }) => ProjectService.createProject(context, data));

/** 管理端：更新项目 */
export const updateProjectFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateProjectInputSchema)
  .handler(({ data, context }) => ProjectService.updateProject(context, data));

/** 管理端：删除项目 */
export const deleteProjectFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteProjectInputSchema)
  .handler(({ data, context }) => ProjectService.deleteProject(context, data));
