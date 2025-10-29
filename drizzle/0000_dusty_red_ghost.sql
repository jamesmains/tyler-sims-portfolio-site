CREATE TABLE `activeSessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `projectImages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt` text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`showcase` text NOT NULL,
	`body_content` text NOT NULL,
	`gallery` text NOT NULL,
	`tech` text NOT NULL,
	`is_published` boolean DEFAULT false NOT NULL
);
