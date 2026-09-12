import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "./helper";

export const MUSIC_TYPES = ["local", "netease"] as const;

/** 音乐（映射第二站 Music 表） */
export const MusicTable = sqliteTable(
  "music",
  {
    id,
    title: text().notNull(),
    artist: text().notNull().default(""),
    cover: text().notNull().default(""),
    src: text().notNull(),
    lrc: text().notNull().default(""),
    lrcSrc: text("lrc_src").notNull().default(""),
    type: text("type", { enum: MUSIC_TYPES }).notNull().default("local"),
    sort: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("music_type_idx").on(table.type),
    index("music_sort_idx").on(table.sort),
  ],
);

// ==================== types ====================
export type Music = typeof MusicTable.$inferSelect;
export type MusicType = (typeof MUSIC_TYPES)[number];
