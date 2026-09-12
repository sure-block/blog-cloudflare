import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as VisitorService from "@/features/visitors/visitors.service";
import { ClearVisitorsInputSchema } from "@/features/visitors/visitors.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

const IdInputSchema = z.object({ id: z.number() });
const LimitInputSchema = z.object({ limit: z.number().int().min(1).max(100).optional() });
const DaysInputSchema = z.object({ days: z.number().int().min(1).max(90).optional() });

// ============ Public API ============

/** 公开：访客统计（用于站点统计展示） */
export const getVisitorStatsFn = createServerFn()
  .middleware([dbMiddleware])
  .handler(async ({ context }) => {
    return await VisitorService.getVisitorStats(context);
  });

/** 公开：按日访问量（站点统计图表） */
export const getVisitorsByDayFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(DaysInputSchema)
  .handler(async ({ data, context }) => {
    return await VisitorService.getVisitorsByDay(context, data);
  });

// ============ Admin API ============

/** 管理端：最近访客记录 */
export const getRecentVisitorsFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(LimitInputSchema)
  .handler(async ({ data, context }) => {
    return await VisitorService.getRecentVisitors(context, data);
  });

/** 管理端：删除单条访客记录 */
export const deleteVisitorFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(IdInputSchema)
  .handler(async ({ data, context }) => {
    return await VisitorService.deleteVisitor(context, data.id);
  });

/** 管理端：清空全部访客记录 */
export const clearVisitorsFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(ClearVisitorsInputSchema)
  .handler(async ({ context }) => {
    return await VisitorService.clearVisitors(context);
  });
