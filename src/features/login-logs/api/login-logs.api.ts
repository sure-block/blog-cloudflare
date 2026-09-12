import { createServerFn } from "@tanstack/react-start";
import * as LoginLogService from "@/features/login-logs/login-logs.service";
import { GetLoginLogsInputSchema } from "@/features/login-logs/login-logs.schema";
import { adminMiddleware } from "@/lib/middlewares";

/** 管理端：登录日志列表（分页） */
export const getLoginLogsFn = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(GetLoginLogsInputSchema)
  .handler(async ({ data, context }) => {
    return await LoginLogService.getLoginLogs(context, data);
  });
