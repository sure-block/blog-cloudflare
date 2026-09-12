import * as CategoryRepo from "@/features/categories/data/categories.data";
import type {
  Category,
  CategoryWithCount,
  CreateCategoryInput,
  DeleteCategoryInput,
  GetCategoriesInput,
  UpdateCategoryInput,
} from "@/features/categories/categories.schema";
import { err, ok } from "@/lib/errors";

/** 生成 URL 友好的 slug（与 posts 工具一致） */
function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Get categories (cached-friendly)
 */
export async function getCategories(
  context: DbContext,
  data: GetCategoriesInput = {},
): Promise<Array<Category | CategoryWithCount>> {
  const {
    sortBy = "sort",
    sortDir = "asc",
    withCount = false,
    publicOnly = false,
  } = data;

  if (withCount) {
    return await CategoryRepo.getAllCategoriesWithCount(context.db, {
      sortBy,
      sortDir,
      publicOnly,
    });
  }
  return await CategoryRepo.getAllCategories(context.db, {
    sortBy: sortBy === "postCount" ? "sort" : sortBy,
    sortDir,
  });
}

/**
 * Create a new category
 */
export async function createCategory(
  context: DbContext,
  data: CreateCategoryInput,
) {
  const { name, slug, description, sort } = data;

  if (await CategoryRepo.nameExists(context.db, name)) {
    return err({ reason: "CATEGORY_NAME_EXISTS", message: "分类名称已存在" });
  }

  const finalSlug = slug ?? slugify(name);
  if (await CategoryRepo.slugExists(context.db, finalSlug)) {
    return err({ reason: "CATEGORY_SLUG_EXISTS", message: "分类 slug 已存在" });
  }

  const category = await CategoryRepo.insertCategory(context.db, {
    name,
    slug: finalSlug,
    description: description ?? "",
    sort: sort ?? 0,
  });

  return ok(category);
}

/**
 * Update a category
 */
export async function updateCategory(
  context: DbContext,
  data: UpdateCategoryInput,
) {
  const { id, data: patch } = data;

  const existing = await CategoryRepo.findCategoryById(context.db, id);
  if (!existing) {
    return err({ reason: "CATEGORY_NOT_FOUND", message: "分类不存在" });
  }

  if (patch.name && patch.name !== existing.name) {
    if (await CategoryRepo.nameExists(context.db, patch.name, { excludeId: id })) {
      return err({ reason: "CATEGORY_NAME_EXISTS", message: "分类名称已存在" });
    }
  }
  if (patch.slug && patch.slug !== existing.slug) {
    if (await CategoryRepo.slugExists(context.db, patch.slug, { excludeId: id })) {
      return err({ reason: "CATEGORY_SLUG_EXISTS", message: "分类 slug 已存在" });
    }
  }

  const category = await CategoryRepo.updateCategory(context.db, id, patch);
  return ok(category);
}

/**
 * Delete a category
 */
export async function deleteCategory(
  context: DbContext,
  data: DeleteCategoryInput,
) {
  const existing = await CategoryRepo.findCategoryById(context.db, data.id);
  if (!existing) {
    return err({ reason: "CATEGORY_NOT_FOUND", message: "分类不存在" });
  }

  await CategoryRepo.deleteCategory(context.db, data.id);
  return ok({ deleted: true });
}
