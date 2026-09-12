import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

/** 相册（映射第二站 Album 表） */
export const AlbumsTable = sqliteTable(
  "albums",
  {
    id,
    title: text().notNull(),
    description: text().notNull().default(""),
    cover: text().notNull().default(""),
    photoCount: integer("photo_count").notNull().default(0),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [index("albums_sort_idx").on(table.sort)],
);

/** 照片（映射第二站 Photo 表） */
export const PhotosTable = sqliteTable(
  "photos",
  {
    id,
    albumId: integer("album_id")
      .notNull()
      .references(() => AlbumsTable.id, { onDelete: "cascade" }),
    url: text().notNull(),
    caption: text().notNull().default(""),
    orientation: text().notNull().default("landscape"),
    sort: integer().notNull().default(0),
    createdAt,
  },
  (table) => [index("photos_album_idx").on(table.albumId, table.sort)],
);

// ==================== relations ====================
export const albumsRelations = relations(AlbumsTable, ({ many }) => ({
  photos: many(PhotosTable),
}));

// ==================== types ====================
export type Album = typeof AlbumsTable.$inferSelect;
export type Photo = typeof PhotosTable.$inferSelect;
