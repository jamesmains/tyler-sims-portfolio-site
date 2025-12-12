
# Tyler Sims — Portfolio Site

A combined Bun + Vite project serving a React frontend and an Elysia API backend with SQLite via Drizzle. This README explains how to develop, run, and build the project, and includes a short API reference and troubleshooting tips.

## Table of contents
- [Quick overview](#quick-overview)
- [Requirements](#requirements)
- [Install](#install)
- [Run (development)](#run-development)
- [Build & Production](#build--production)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Database & migrations](#database--migrations)
- [Project layout](#project-layout)
- [Admin flow & auth](#admin-flow--auth)
- [File uploads](#file-uploads)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Quick overview
- Frontend: React + Vite (Mantine UI). Dev entry: `src/main.tsx`.
- Backend: Elysia server (runs on Bun). Main server: `index.ts`.
- DB: SQLite managed with Drizzle ORM.
- Dev workflow uses Vite proxy so frontend can call `/api/*` and the dev server proxies to the Bun server.

## Requirements
- Bun (recommended): https://bun.sh
- Git
- (Optional) Node/npm for auxiliary tools if needed, but Bun handles install/run.

## Install
```bash
curl -fsSL https://bun.sh/install | bash   # if Bun is not installed
bun install
```

## Run (development)
Start the backend (Bun/Elysia):
```bash
bun run start
```
Start the frontend (Vite dev server):
```bash
bun run dev
```
Open the site at http://localhost:5173 (or the address printed by Vite). API requests to `/api/*` are proxied to the Bun server (see `vite.config.ts`).

## Build & Production
Build the frontend:
```bash
bun run build
```
Run the production server (ensure env vars are set):
```bash
bun run start
```
Configure a process manager (systemd, Docker, etc.) as needed for production hosting.

## Environment variables
Recommended to place local values in `local/.env.local` or in your environment:
- ADMIN_SECRET_KEY — admin login secret
- COOKIE_SECRET_KEY — cookie/session signing secret
- VITE_API_URL — frontend API base (e.g. `http://localhost:3000/api`)
- BASE_URL — base URL for assets/public links
- Any other env referenced in `index.ts` or `vite.config.ts`

## API reference (summary)
All endpoints are rooted under `/api`.

Public:
- GET /api/projects
  - Query params: `q`, `page`, `limit`, `tech`, `type`, `published`
  - Returns paginated project list.
- GET /api/project?id=ID
  - Returns single project by id.

Admin (require valid session cookie):
- POST /api/admin/login
  - Headers/body: `X-Admin-Secret` or body field used by frontend; server sets session cookie on success.
- GET /api/admin/status
  - Checks session validity.
- POST /api/admin/logout
  - Clears session cookie.
- POST /api/projects
  - Create project (JSON body).
- PUT /api/projects
  - Update project (JSON body).
- DELETE /api/projects/:id
  - Delete project by id.
- POST /api/admin/project/image/:projectId/upload
  - Multipart image upload for project.

Note: See `index.ts` for full request/response shapes and validation.

Example fetch (public request):
```js
fetch('/api/projects?q=design&page=1&limit=10')
  .then(r => r.json())
  .then(data => console.log(data));
```

Example admin login (client sends secret, server returns cookie):
```js
fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ secret: process.env.ADMIN_SECRET_KEY }),
  credentials: 'include'
});
```

## Database & migrations
- Schema: `schema.ts` and `drizzle/schema.ts`
- Migrations and SQL artifacts: `drizzle/`
- Runtime DB file: `db/db.sqlite` (created automatically if missing).
- To add schema changes: update Drizzle schema and create a migration (see `drizzle.config.ts` and Drizzle docs).

## Project layout (important files)
- index.ts — backend server entry (Elysia + routes + DB init)
- schema.ts — Drizzle table definitions
- src/ — React frontend
  - src/main.tsx — app entry
  - src/api/projects.ts — frontend API client & React Query hooks
  - src/routes/ — route components and loaders
  - src/components/ — UI components
  - src/state/ — Jotai state atoms for admin/session
- vite.config.ts — Vite config and API proxy
- package.json — scripts (dev, start, build, lint, type-check)
- local/.env.local — example local env (not committed)

## Admin flow & auth
- Admin authenticates by posting the admin secret to `/api/admin/login`. Server creates a session stored in SQLite and sets a session cookie.
- Client stores no secret locally beyond a transient value. Session validation uses `/api/admin/status`.
- Protected admin endpoints require that cookie (use `credentials: 'include'` in fetch).

## File uploads
- Image uploads are handled by the admin upload endpoint and saved to `uploads/`.
- The server serves static files from the uploads directory — confirm `BASE_URL` and static route in `index.ts`.

## Troubleshooting
- CORS/Credentials errors: ensure frontend runs with VITE_API_URL set correctly and fetch uses `credentials: 'include'`.
- Session issues: confirm `ADMIN_SECRET_KEY` matches between client attempts and server env.
- Database errors: delete `db/db.sqlite` to recreate (data loss) or inspect migration SQL in `drizzle/`.
- Bun runtime errors: update Bun to latest stable and re-run `bun install`.

## Contributing
- Create issues for bugs/features.
- Use consistent formatting and run lint/type checks:
```bash
bun run lint
bun run type-check
```
- Add Drizzle migrations when changing schema.

## License
Specify project license here (e.g. MIT). Update LICENSE file as appropriate.
