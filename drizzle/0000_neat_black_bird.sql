-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`showcase` text,
	`body_content` text,
	`gallery` text,
	`tech` text NOT NULL
);
--> statement-breakpoint
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

*/