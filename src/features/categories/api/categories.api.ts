import { createServerFn } from "@tanstack/react-start";
import * as CategoryService from "@/features/categories/categories.service";
import {
  CreateCategoryInputSchema,
  DeleteCategoryInputSchema,
  GetCategoriesInputSchema,
  UpdateCategoryInputSchema,
} from "@/features/categories/categories.schema";
import { adminMiddleware, dbMiddleware } from "@/lib/middlewares";

/** 公开：获取分类列表（含文章数） */
export const getCategoriesFn = createServerFn()
  .middleware([dbMiddleware])
  .inputValidator(GetCategoriesInputSchema)
  .handler(async ({ data, context }) => {
    return await CategoryService.getCategories(context, data);
  });

/** 管理端：创建分类 */
export const createCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateCategoryInputSchema)
  .handler(async ({ data, context }) => {
    return await CategoryService.createCategory(context, data);
  });

/** 管理端：更新分类 */
export const updateCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(UpdateCategoryInputSchema)
  .handler(async ({ data, context }) => {
    return await CategoryService.updateCategory(context, data);
  });

/** 管理端：删除分类 */
export const deleteCategoryFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(DeleteCategoryInputSchema)
  .handler(async ({ data, context }) => {
    return await CategoryService.deleteCategory(context, data);
  });
