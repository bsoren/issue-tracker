# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains Next.js App Router pages, layouts, loading states, and error boundaries. Issue workflows live in `app/issues/`; API handlers live in `app/api/`.
- `app/components/` holds shared UI; `app/issues/_components/` holds issue-specific components. Authentication configuration lives in `app/auth/`.
- `lib/prisma.ts` provides the shared database client. `prisma/` contains the MySQL schema and versioned migrations; `generated/prisma/` is generated and ignored by Git.
- `public/` contains static assets; `docs/` contains troubleshooting notes. Root instrumentation and Sentry files configure error reporting.

## Build, Test, and Development Commands

Use npm and keep `package-lock.json` synchronized with dependency changes.

- `npm ci`: install locked dependencies.
- `npx prisma generate`: generate the client before building or running locally.
- `npx prisma migrate dev --name <description>`: create and apply schema migrations against a development database.
- `npm run dev`: start development at `http://localhost:3000`.
- `npm run build`: create the production build; `npm start` serves it.
- `npm run lint`: invokes the existing `next lint` script. The repository uses Next.js 16 and a legacy ESLint configuration; verify compatibility before relying on this command.

## Coding Style & Naming Conventions

Use strict TypeScript and explicit prop types. Prefer two-space indentation, double quotes, and semicolons for new TS/TSX code; preserve surrounding style when editing existing files. No formatter is configured.

Use PascalCase for component files (`IssueTable.tsx`), camelCase for functions and variables, and App Router filenames such as `page.tsx` and `loading.tsx`. Prefer `@/` imports for shared modules. Reuse Radix UI and Tailwind conventions, validate API input with Zod, and retain authentication checks on mutations.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. For changes, run the production build and manually verify affected flows: sign-in, issue creation/editing/deletion, filtering, pagination, assignment, and loading/error states. Record checks and any blocked validation in the PR.

## Commit & Pull Request Guidelines

Recent commits favor `feat: <description>`; use concise, action-oriented subjects. Keep changes focused. PRs should explain the behavior change, link related issues, describe validation, include screenshots for UI changes, and flag migrations or configuration changes.

## Security & Configuration

Copy `.env.app.example` to `.env.app` and `.env.mysql.example` to `.env.mysql` for Docker; keep credentials untracked. For local Next.js development, use `.env` instead of `.env.app` and adjust database connectivity. Configure both `DATABASE_URL` for Prisma CLI and individual `DATABASE_*` settings for the runtime adapter. Supply NextAuth and Google OAuth settings, preserve verified TLS, and never edit generated Prisma files directly.
