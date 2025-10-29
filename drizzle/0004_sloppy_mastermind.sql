PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`showcase` text,
	`body_content` text,
	`gallery` text,
	`tech` text NOT NULL,
	`is_published` boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "title", "description", "showcase", "body_content", "gallery", "tech", "is_published") SELECT "id", "title", "description", "showcase", "body_content", "gallery", "tech", "is_published" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;