# Copilot / AI Agent Instructions for nextjs-dashboard

Purpose: Help AI coding agents become productive quickly in this Next.js (App Router) dashboard starter.

- Quick start commands:
  - Local dev: `npm run dev` (starts Next on :3000) — see `package.json`.
  - Build: `npm run build`; Start production server: `npm run start`.
  - Docker dev: `docker compose up --build` uses `Dockerfile.dev` and maps port 3000.
  - Lint: `npm run lint` (ESLint only).

- Architecture (what to read first):
  - Entry / routes: `app/` (App Router). Example: `app/page.tsx` is the root page.
  - Layout and global styling: `app/layout.tsx` and `app/globals.css` (fonts loaded via `next/font`).
  - Utilities: `lib/utils.ts` exports `cn(...)` which combines `clsx` + `tailwind-merge` — use this when merging class lists.
  - Static assets: `public/` (images referenced with `next/image`, e.g. `/next.svg`).
  - Config: `next.config.ts` (minimal in this repo), `package.json` declares Next v16 and Node tooling.

- Project conventions & patterns to follow:
  - App Router pattern: prefer `app/`-based routing and `layout.tsx` for shared UI.
  - Styling: Tailwind CSS v4 is used. Use `cn(...)` from `lib/utils.ts` to merge classes and `tw-merge` semantics.
  - Fonts: `next/font` is used in `app/layout.tsx`; maintain the pattern of setting CSS variables for fonts.
  - Components: keep presentational components under `app/` (or add `components/`), and use TypeScript types consistently.

- Integration points & known behaviors:
  - Docker: `Dockerfile.dev` uses Node 20-alpine; `docker-compose.yml` mounts the project folder and sets `CHOKIDAR_USEPOLLING: "true"` (important on Windows hosts).
  - Telemetry: `NEXT_TELEMETRY_DISABLED=1` is set in the dev Dockerfile.
  - Images: Served from `public/`; `next/image` is used in `app/page.tsx` and requires no extra loader here.

- What to avoid / assumptions:
  - There are no tests or test runner configured — do not add tests without confirming project goals.
  - No backend API routes are present; treat this repo as a frontend-only Next.js app unless the user adds APIs.

- Examples of tasks and where to implement them:
  - Add a new page: create `app/my-page/page.tsx` and export a default React component.
  - Add a shared component: create `components/MyCard.tsx` and import in `app/layout.tsx` or relevant pages.
  - Use `cn(...)` when conditionally composing Tailwind classes: `cn('p-4', active && 'bg-blue-500')`.

If anything here is unclear or you want more detail (tests, CI, or platform-specific tweaks), tell me which area to expand.
