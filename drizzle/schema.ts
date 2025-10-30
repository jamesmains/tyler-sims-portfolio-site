import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const projects = sqliteTable("projects", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	description: text(),
	showcase: text(),
	bodyContent: text("body_content"),
	gallery: text(),
	tech: text().notNull(),
});

export const activeSessions = sqliteTable("activeSessions", {
	sessionId: text("session_id").primaryKey().notNull(),
	createdAt: integer(),
});

export const projectImages = sqliteTable("projectImages", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	projectId: integer("project_id").notNull(),
	url: text().notNull(),
	alt: text().default(""),
});

