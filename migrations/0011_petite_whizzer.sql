CREATE TABLE `albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`photo_count` integer DEFAULT 0 NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `albums_sort_idx` ON `albums` (`sort`);--> statement-breakpoint
CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`album_id` integer NOT NULL,
	`url` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`orientation` text DEFAULT 'landscape' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `photos_album_idx` ON `photos` (`album_id`,`sort`);--> statement-breakpoint
CREATE TABLE `bookmark_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bookmark_categories_sort_idx` ON `bookmark_categories` (`sort`);--> statement-breakpoint
CREATE TABLE `bookmark_sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`platforms` text DEFAULT '[]' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `bookmark_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `bookmark_sites_category_idx` ON `bookmark_sites` (`category_id`,`sort`);--> statement-breakpoint
CREATE TABLE `book_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_categories_name_unique` ON `book_categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_categories_slug_unique` ON `book_categories` (`slug`);--> statement-breakpoint
CREATE INDEX `book_categories_sort_idx` ON `book_categories` (`sort`);--> statement-breakpoint
CREATE TABLE `book_chapters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`title` text NOT NULL,
	`href` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `book_chapters_book_order_idx` ON `book_chapters` (`book_id`,`order`);--> statement-breakpoint
CREATE TABLE `book_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`chapter_id` integer,
	`text` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`color` text DEFAULT '#facc15' NOT NULL,
	`cfi` text DEFAULT '' NOT NULL,
	`chapter_title` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `book_notes_book_idx` ON `book_notes` (`book_id`);--> statement-breakpoint
CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text DEFAULT '' NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`file_url` text NOT NULL,
	`format` text DEFAULT 'epub' NOT NULL,
	`file_size` integer DEFAULT 0 NOT NULL,
	`category_id` integer,
	`sort` integer DEFAULT 0 NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`chapter_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `book_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `books_category_idx` ON `books` (`category_id`);--> statement-breakpoint
CREATE INDEX `books_format_idx` ON `books` (`format`);--> statement-breakpoint
CREATE TABLE `reading_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`chapter_id` integer,
	`chapter_title` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reading_progress_book_id_unique` ON `reading_progress` (`book_id`);--> statement-breakpoint
CREATE INDEX `reading_progress_updated_idx` ON `reading_progress` (`updated_at`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`post_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_sort_idx` ON `categories` (`sort`);--> statement-breakpoint
CREATE TABLE `chatter_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatter_id` integer NOT NULL,
	`parent_id` integer,
	`user_id` text,
	`email_user_name` text DEFAULT '' NOT NULL,
	`email_user_avatar` text DEFAULT '' NOT NULL,
	`content` text NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'approved' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`chatter_id`) REFERENCES `chatters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `chatter_comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `chatter_comments_chatter_created_idx` ON `chatter_comments` (`chatter_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `chatter_comments_status_idx` ON `chatter_comments` (`status`);--> statement-breakpoint
CREATE TABLE `chatters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`mood` text DEFAULT '' NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chatters_status_created_idx` ON `chatters` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `login_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer DEFAULT 0 NOT NULL,
	`username` text DEFAULT '' NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`system` text DEFAULT '' NOT NULL,
	`browser` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`operating_time` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `login_logs_user_idx` ON `login_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `login_logs_time_idx` ON `login_logs` (`operating_time`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`parent_id` integer,
	`content` text NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'approved' NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`email_user_name` text DEFAULT '' NOT NULL,
	`email_user_avatar` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`parent_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `messages_status_created_idx` ON `messages` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `messages_parent_idx` ON `messages` (`parent_id`);--> statement-breakpoint
CREATE TABLE `music` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`artist` text DEFAULT '' NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`src` text NOT NULL,
	`lrc` text DEFAULT '' NOT NULL,
	`lrc_src` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'local' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `music_type_idx` ON `music` (`type`);--> statement-breakpoint
CREATE INDEX `music_sort_idx` ON `music` (`sort`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`long_description` text DEFAULT '' NOT NULL,
	`cover_image` text DEFAULT '' NOT NULL,
	`tech_stack` text DEFAULT '[]' NOT NULL,
	`link_github` text DEFAULT '' NOT NULL,
	`link_gitee` text DEFAULT '' NOT NULL,
	`link_live` text DEFAULT '' NOT NULL,
	`link_docs` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'developing' NOT NULL,
	`status_label` text DEFAULT '' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_status_sort_idx` ON `projects` (`status`,`sort`);--> statement-breakpoint
CREATE INDEX `projects_featured_idx` ON `projects` (`is_featured`);--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`path` text DEFAULT '' NOT NULL,
	`user_agent` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`region` text DEFAULT '' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`district` text DEFAULT '' NOT NULL,
	`org` text DEFAULT '' NOT NULL,
	`asn` text DEFAULT '' NOT NULL,
	`is_mobile` integer DEFAULT false NOT NULL,
	`is_proxy` integer DEFAULT false NOT NULL,
	`is_hosting` integer DEFAULT false NOT NULL,
	`browser` text DEFAULT '' NOT NULL,
	`os` text DEFAULT '' NOT NULL,
	`device_type` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visitors_ip_idx` ON `visitors` (`ip`);--> statement-breakpoint
CREATE INDEX `visitors_created_idx` ON `visitors` (`created_at`);--> statement-breakpoint
ALTER TABLE `user` ADD `nickname` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `bio` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `likes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `ip` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `email_user_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `email_user_avatar` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `category_id` integer REFERENCES categories(id);--> statement-breakpoint
ALTER TABLE `posts` ADD `cover` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `views` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `likes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `word_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `posts_category_idx` ON `posts` (`category_id`);