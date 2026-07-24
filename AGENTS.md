# Repository guide

## Project layout

- The application lives in `app/`; run Node.js and npm commands from that directory.
- This is a Next.js 15 application using React 19, TypeScript, Tailwind CSS 3, and Payload CMS 3.
- Payload collections, globals, access rules, and configuration live under `app/src/`.
- Planning and content-model documents live in `plans/`.
- Repository-specific agent skills live in `.agents/skills/` and are discovered by Codex automatically.

## Working agreements

- Use npm and preserve `app/package-lock.json`.
- Do not read, print, commit, or overwrite secrets from `app/.env`.
- Keep environment setup instructions in `app/ENV_SETUP.md`; never add real credentials to documentation or examples.
- Preserve unrelated working-tree changes.
- Treat `app/src/app/(payload)/admin/importMap.js`, `app/src/payload-types.ts`, and migration files as generated artifacts. Regenerate them through Payload commands when their source configuration changes instead of hand-editing them.
- Keep frontend routes and components in `app/src/app/(frontend)/`; keep Payload admin integration in `app/src/app/(payload)/`.
- The Payload default locale is Thai (`th`). Keep localized content fields compatible with the content model in `plans/payload-content-model.md`.

## Validation

From `app/`, use the smallest relevant checks:

```bash
npm run build
```

When Payload schemas or configuration change, also run:

```bash
npm run generate:types
```

There are currently no repository scripts for linting or automated tests. Do not claim those checks passed unless such scripts are added and run.

## Code review rules

- Flag exposed credentials or committed environment files.
- Flag Payload schema changes that leave generated types or required migrations stale.
- Flag changes that break the legacy `/articles/:category/:slug` redirect.
- Flag changes that assume a direct Postgres connection in Vercel; this project uses the pooled Supabase connection documented in `app/ENV_SETUP.md`.
