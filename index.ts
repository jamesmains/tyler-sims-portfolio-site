import { Elysia, t } from "elysia";
import path from "path";
import fs from "fs";
import { cors } from "@elysiajs/cors";

// Drizzle/Database dependencies
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq, lt, sql } from "drizzle-orm";
import { Database } from "bun:sqlite";
import { projects, activeSessions, projectImages } from "./schema.ts";
import type { Project, GalleryImage } from "./types.ts";
import staticPlugin from "@elysiajs/static";

// Get secret keys
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
// The COOKIE_SECRET_KEY is not strictly used here but kept for completeness
// const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;

// --- Session Settings
// Session lifetime matches the cookie's Max-Age: 1 hour (3600 * 1000 ms)
const SESSION_LIFETIME_MS = 3600 * 1000;
// How often the cleanup job runs (e.g., every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

// --- Path Definitions ---
const FRONTEND_ASSETS_DIR = path.join(import.meta.dir, "../../apps/web/dist");
const INDEX_HTML_PATH = path.join(FRONTEND_ASSETS_DIR, "index.html");
const ASSETS_SUBDIR_PATH = path.join(FRONTEND_ASSETS_DIR, "/assets");
const UPLOADS_PATH = path.join(import.meta.dir,"/uploads");

// Todo: Fix so the local machine can still run this
const dbFile = `${import.meta.dir}/db/db.sqlite`;
let sqlite: Database;
let db = drizzle({ schema: { projects, activeSessions } });

// --- UTILITY FUNCTIONS ---

/**
 * Utility function to generate a secure session ID
 */
const generateSessionId = () => {
  return crypto.randomUUID();
};

/**
 * Utility function to parse cookies from the request header (simplified)
 */
const getCookie = (cookieHeader: string | null, name: string) => {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c: string) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

/**
 * Deletes all sessions from the database that have expired.
 */
const deleteExpiredSessions = async () => {
  try {
    const cutoffTime = Date.now() - SESSION_LIFETIME_MS;
    // Delete records where the 'createdAt' timestamp is less than the cutoff time
    const result = await db
      .delete(activeSessions)
      .where(lt(activeSessions.createdAt, cutoffTime));
    // Note: The user's DB inserts createdAt as a string, so comparison must use string or ensure number conversion.
    // We stick to string comparison using the current implementation style.
  } catch (error) {
    console.error("[Cleanup] Failed to delete expired sessions:", error);
  }
};

// --- AUTHENTICATION MIDDLEWARE ---

/**
 * Checks for a valid 'session_id' cookie against the activeSessions database.
 * If invalid or expired, it sets the status to 401 and returns an error response,
 * blocking the route handler from executing.
 */
const authCheckMiddleware = async (context: any) => {
  const { set, request } = context;
  const headers = request?.headers ?? {};
  const cookieHeader =
    headers instanceof Headers
      ? headers.get("cookie")
      : headers["cookie"] ?? headers["Cookie"] ?? "";

  const sessionId = getCookie(cookieHeader, "session_id");

  if (!cookieHeader) {
    set.status = 401;
    return { error: "Unauthorized: No session cookie provided." };
  }

  if (!sessionId) {
    set.status = 401;
    return { error: "Unauthorized: No session cookie provided." };
  }

  try {
    const activeSession = await db
      .select()
      .from(activeSessions)
      .where(eq(activeSessions.session_id, sessionId))
      .limit(1);

    if (activeSession.length === 0) {
      set.status = 401;
      return { error: "Unauthorized: Invalid session ID." };
    }

    const session = activeSession[0];

    if (!session) {
      return { error: "Unauthorized: Session not found." };
    }

    const now = Date.now();
    // Parse the stored createdAt string back to a number for comparison
    const createdAt = session.createdAt ?? 10;
    const expirationTime = createdAt + SESSION_LIFETIME_MS;

    if (now > expirationTime) {
      // Expired, delete it immediately and deny access
      await db
        .delete(activeSessions)
        .where(eq(activeSessions.session_id, sessionId));
      set.status = 401;
      return { error: "Unauthorized: Session expired." };
    }

    // Authentication successful, allow continuation
    return;
  } catch (error) {
    console.error("[AUTH] Database error during session check:", error);
    set.status = 500;
    return { error: "Server Error during authentication." };
  }
};

// --- DATABASE INITIALIZATION ---
try {
  sqlite = new Database(dbFile);
  db = drizzle(sqlite, { schema: { projects, activeSessions, projectImages } });

  // Create tables if they don't exist (using raw SQL for Bun SQLite setup)
  sqlite.run(
    `CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            body_content TEXT, 
            showcase TEXT,
            gallery TEXT,
            tech TEXT 
        );`
  );

  sqlite.run(
    `CREATE TABLE IF NOT EXISTS activeSessions (
            session_id TEXT PRIMARY KEY,
            createdAt INTEGER
        );`
  );

  sqlite.run(
    `CREATE TABLE IF NOT EXISTS projectImages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            url TEXT,
            alt TEXT
          );`
  )

} catch (e) {
  console.error("🛑 FATAL DATABASE STARTUP ERROR. CHECK PATH/PERMISSIONS:", e);
  process.exit(1);
}

// --- ELYSIA APP SETUP ---
const app = new Elysia()
  // CORS (Must be near the top)
  .use(
    cors({
      origin: true,
      allowedHeaders: ["Content-Type", "X-Admin-Secret"],
    })
  )

  .use(
    staticPlugin({
      assets: ASSETS_SUBDIR_PATH,
      prefix: "/assets", // serve everything in dist/
    })
  )
  .use(
    staticPlugin({
      assets: UPLOADS_PATH,
      prefix: "/uploads",
    })
  )

  // EXPLICIT ASSET HANDLER
  // .get("/assets/*", ({ params }) => {
  //   const filePath = path.join(ASSETS_SUBDIR_PATH, params["*"]);
  //   return Bun.file(filePath);
  // })
  // --- SESSION MANAGEMENT ---

  // Attempt admin login
  .post("/api/admin/login", async ({ headers, set }) => {
    const secret = headers["x-admin-secret"];

    if (!secret || secret !== ADMIN_SECRET_KEY) {
      set.status = 401;
      return { error: "Unauthorized access check failed." };
    }

    const sessionId = generateSessionId();
    try {
      // Store createdAt as a string to match the user's current DB style
      await db.insert(activeSessions).values({
        session_id: sessionId,
        createdAt: Date.now(),
      });
    } catch (error) {
      set.status = 500;
      console.error("DB INSERT ERROR:", error);
      return { error: "Database operation failed." };
    }

    const oneHour = 3600; // Max-Age in seconds
    const cookieString =
      `session_id=${sessionId}; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Path=/; ` +
      `Max-Age=${oneHour}`;

    set.headers["set-cookie"] = cookieString;
    set.status = 200;
    return { message: "Login successful. Session established." };
  })

  // Get current admin session status (uses the same session check logic)
  .get("/api/admin/status", async (context) => {
    const authResult = await authCheckMiddleware(context);

    if (authResult && authResult.error) {
      // If the middleware returned an error, use its status and message
      return { message: authResult.error };
    }
    // If the middleware returned undefined, the session is valid
    context.set.status = 200;
    return { message: "Active session found." };
  })

  // Attempt admin logout
  .post("/api/admin/logout", async ({ headers, set }) => {
    const cookieHeader = headers["cookie"] as string | null;
    const sessionId = getCookie(cookieHeader, "session_id");

    if (sessionId) {
      await db
        .delete(activeSessions)
        .where(eq(activeSessions.session_id, sessionId));
    }

    // CRITICAL: Instruct the browser to delete the cookie
    const expiredCookieString =
      `session_id=deleted; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Path=/; ` +
      `Max-Age=0`;

    set.headers["Set-Cookie"] = expiredCookieString;
    set.status = 200;
    return { message: "Logged out successfully." };
  })

  // --- PUBLIC PROJECT ROUTE ---
  // Anyone can access this endpoint
  .get("/api/projects", async ({ query, set }) => {
    try {
      // Parse pagination parameters
      const page = parseInt(query.page ?? "1");
      const limit = parseInt(query.limit ?? "10");
      const offset = (page - 1) * limit;

      const result = await db
        .select()
        .from(projects)
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(projects);
      const total = countResult[0]?.count ?? 0;

      return {
        data: result,
        pagination: {
          total: total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      set.status = 500;
      console.error("DB SELECT ERROR:", error);
      return { error: "Failed to fetch projects from the database." };
    }
  })

  .get("/api/project", async ({ query, set }) => {
    try {
      // Parse pagination parameters
      const id = parseInt(query.id ?? "-1");
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      return result[0] as Project;
    } catch (error) {
      set.status = 500;
      console.error("DB SELECT ERROR:", error);
      return { error: "Failed to fetch project from the database." };
    }
  })

  .get("/project/uploads/:id", async ({ params }) => {
    const id = parseInt(params.id);
    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, id));
    return images;
  })

  // --- PROTECTED ADMIN GROUP ---
  // All routes in this group require a valid session cookie.
  .group("/api", (group) =>
    group
      // Apply the centralized authentication check to ALL routes in this group
      .onBeforeHandle(authCheckMiddleware as any)

      // CREATE Project (Protected)
      .post("/projects", async ({ body, set }) => {
        const content = body as Project;
        try {
          const [newProject] = await db
            .insert(projects)
            .values({
              title: content.title,
              description: content.description,
              showcase: content.showcase, // Use the actual value from the body
              bodyContent: content.bodyContent, // Use the actual value from the body
              gallery: content.gallery, // Save the stringified JSON
              tech: content.tech,
            })
            .returning();

          set.status = 201;
          // CRITICAL FIX: Return the object directly. Elysia automatically
          // serializes JavaScript objects to JSON, preventing double-stringification.
          return newProject;
        } catch (error) {
          set.status = 500;
          console.error("DB INSERT ERROR:", error);
          return { error: "Database operation failed." };
        }
      })

      // UPDATE project (protected)
      .put("/projects", async ({ body, set }) => {
        const content = body as Project;
        try {
          if (typeof content.id !== 'number') return;
          const [newProject] = await db
            .update(projects)
            .set({
              title: content.title,
              description: content.description,
              showcase: content.showcase, // Use the actual value from the body
              bodyContent: content.bodyContent, // Use the actual value from the body
              gallery: content.gallery, // Save the stringified JSON
              tech: content.tech,
            })
            .where(eq(projects.id, content.id))
            .returning();

          set.status = 201;
          // CRITICAL FIX: Return the object directly. Elysia automatically
          // serializes JavaScript objects to JSON, preventing double-stringification.
          return newProject;
        } catch (error) {
          set.status = 500;
          console.error("DB INSERT ERROR:", error);
          return { error: "Database operation failed." };
        }
      })

      // 2. DELETE Project (Protected)
      .delete(
        "/projects/:id", // Correct path within the /api group
        async ({ params, set }) => {
          const projectId = parseInt(params.id);
          if (isNaN(projectId)) {
            set.status = 400;
            return { error: "Invalid project ID." };
          }

          try {
            const result = await db
              .delete(projects)
              .where(eq(projects.id, projectId))
              .returning();

            if (result.length === 0) {
              set.status = 404;
              return { message: "Project not found or already deleted." };
            }
            return { message: `Project ID ${projectId} deleted successfully.` };
          } catch (error) {
            set.status = 500;
            console.log("DB DELETE ERROR: ", error);
            return { error: "Database operation failed." };
          }
        }
      )
      // Upload project images
      .post(
        `/admin/project/image/:projectId/upload`,
        async ({ body, params }) => {
          const { projectId } = params;
          const file = body.file;

          if (!file) {
            return { error: "No file uploaded" };
          }

          // Create the uploads directory if it doesn't exist
          const uploadDir = UPLOADS_PATH;
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Use timestamp to avoid collisions
          const filename = `${Date.now()}_${file.name}`;
          const filepath = path.join(uploadDir, filename);

          // Write the file to disk
          await Bun.write(filepath, file);

          const baseUrl = process.env.BASE_URL;
          const url = `${baseUrl}/uploads/${filename}`;

          if (projectId) {
            await db.insert(projectImages).values({
              projectId: parseInt(projectId),
              url,
              alt: file.name,
            });
          }
          else{
            console.log("No project id associated when trying to add image, not making a database record");
          }

          // Return the public URL (you can serve static files from /project/uploads)
          return { url };
        },
        {
          body: t.Object({
            file: t.File(), // built-in validator for files
          }),
        }
      )
  ) // End of Protected Group

  .get("/*", ({ path: requestPath }) => {
    if (requestPath.startsWith("/api") || requestPath.startsWith("/assets")) {
      return new Response("Not found", { status: 404 });
    }

    // Serve main SPA
    return Bun.file(INDEX_HTML_PATH);
  })

  // ROOT INDEX HANDLER
  // .get("/", () => Bun.file(INDEX_HTML_PATH))

  // Start the server
  .listen(
  {
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
  },
  () => {
    console.log("Combined Server running on " + process.env.BASE_URL);
    setInterval(deleteExpiredSessions, CLEANUP_INTERVAL_MS);
  }
);
