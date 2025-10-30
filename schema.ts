import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import type { GalleryImage } from "./types";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),    // Auto generated int identifier                        (Not shown)
  title: text("title").notNull(),                           // Title of the content                                 (Listing/Details)
  description: text("description"),                         // Short description of the content                     (Listing)
  showcase: text("showcase"),                               // Main banner image for the content                    (Listing/Details)
  bodyContent: text("body_content"),                        // Rich text content that allows markup                 (Details)
  gallery: text("gallery", { mode: 'json' })                // JSON blob containing a list of filepaths for the     ...  
    .$type<GalleryImage[]>(),                               // ...content's gallery images.                         (Details)
  tech: text("tech", { mode: 'json' }).notNull()            // JSON blob containing a list of languages &           ...  
    .$type<string[]>(),                                     // ...software used on the project.                     (Details)
  isPublished: integer("is_published", {mode: 'boolean'})   // Flag to determine if this project is                 (Admin Listing)
  .notNull().default(false),                                // ...shown in the public listings page.
  // forceRebuild: text("debug_forceRebuild"),                 // Debugging column to force database rebuild.
});

export const activeSessions = sqliteTable("activeSessions", {
  session_id: text("session_id").primaryKey(),              // Set string identiries, manually generate via code    (Not shown)
  createdAt: integer("createdAt"),                          // Simple date time int, used for clearing sessions     ...
  // ...upon expiration.                                    (Not shown)
});

export const projectImages = sqliteTable("projectImages", {
  id: integer("id").primaryKey({ autoIncrement: true }),    // Auto generated int identifier                        (Not shown)
  projectId: integer("project_id").notNull(),               // Associated project's id                              (Not shown)
  url: text("url").notNull(),                               // Local storage url for image                          (Details)
  alt: text("alt").default(""),                             // Alternate text for image                             (Not shown, accessiblity feature)
});