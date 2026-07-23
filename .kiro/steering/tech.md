# Tech Stack & Build System

## Monorepo

- **Package manager**: pnpm (workspace protocol)
- **Workspace packages**: `fe/`, `be/`, `shared/`
- **Catalog deps** (pinned across workspaces): `zod`, `@types/node`, `i18next`

## Frontend (`fe/`)

| Concern       | Library                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| Framework     | React 19                                                                                  |
| Bundler       | Vite 8                                                                                    |
| Routing       | TanStack Router (file-based)                                                              |
| Server state  | TanStack React Query                                                                      |
| Forms         | TanStack React Form                                                                       |
| Client state  | Zustand (persist middleware)                                                              |
| Styling       | Tailwind CSS 4 + shadcn components                                                        |
| CSS utilities | clsx, tailwind-merge, class-variance-authority (cva)                                      |
| Animations    | tw-animate-css                                                                            |
| Validation    | Zod 4 (shared schemas)                                                                    |
| HTTP          | Axios                                                                                     |
| i18n          | i18next + react-i18next + i18next-browser-languagedetector + i18next-resources-to-backend |
| Icons         | Tabler Icons React (`@tabler/icons-react`)                                                |
| Toasts        | Sonner                                                                                    |
| Number input  | react-number-format                                                                       |
| Fonts         | @fontsource-variable/inter, @fontsource-variable/roboto                                   |
| Compiler      | React Compiler (via Babel plugin)                                                         |
| Devtools      | TanStack React Devtools, Router Devtools, Form Devtools                                   |

## Backend (`be/`)

| Concern    | Library                                 |
| ---------- | --------------------------------------- |
| Runtime    | Node.js (ESM)                           |
| Framework  | Express 5                               |
| ORM        | Prisma 7 (PostgreSQL, pg driver)        |
| Auth       | jsonwebtoken (JWT)                      |
| Password   | argon2                                  |
| Security   | helmet, cors                            |
| Cookies    | cookie-parser                           |
| Email      | nodemailer                              |
| Templates  | handlebars (email templates)            |
| Env        | dotenv + Zod validation                 |
| i18n       | i18next + i18next-fs-backend            |
| Dev runner | tsx (watch mode)                        |
| Build      | tsc + tsc-alias (path alias resolution) |
| Cross-env  | cross-env (NODE_ENV injection)          |

## Shared (`shared/`)

- Zod schemas and inferred TypeScript types consumed by both FE and BE via `itam-shared/schemas/*` exports.
- Shared constants (endpoints, feature codes, actions) via `itam-shared/constants` export.
- Shared TypeScript types (ApiResponse, Permission, Category, etc.) via `itam-shared/types` export.

## Common Commands

```bash
# Install all workspace dependencies
pnpm install

# Frontend
pnpm --filter itam-fe dev      # Start Vite dev server
pnpm --filter itam-fe build    # TypeScript check + Vite production build
pnpm --filter itam-fe lint     # ESLint

# Backend
pnpm --filter itam-be dev          # Start Express with tsx watch
pnpm --filter itam-be lint         # ESLint
pnpm --filter itam-be build        # tsc + tsc-alias
pnpm --filter itam-be db:migrate   # Run Prisma migrations (dev)
pnpm --filter itam-be db:generate  # Generate Prisma client
pnpm --filter itam-be db:studio    # Open Prisma Studio
```

## Code Quality

- **Linting**: ESLint with TypeScript, React Hooks, React Refresh, TanStack Query & Router plugins
- **Formatting**: EditorConfig (2-space indent, UTF-8, CRLF, trailing whitespace trimmed)
- **Commits**: Conventional Commits enforced via commitlint + Husky (`feat`, `fix`, `docs`, `refactor`, etc.) with scopes `fe` / `be`. Emoji is required and must match the type:
  - `feat` → ✨, `fix` → 🐛, `docs` → 📝, `style` → 💄, `refactor` → ♻️, `perf` → ⚡️, `test` → ✅, `build` → 📦️, `ci` → 🎡, `chore` → 🔨, `revert` → ⏪️
  - Format: `type(scope): emoji message`
- **Path alias**: `~` maps to `src/` in both FE and BE

## Dependency Sync Rules

When a library is used by both `fe/` and `be/`:

1. **Always** add it to `catalog` in `pnpm-workspace.yaml` so both use the same version.
2. Use `"catalog:"` as the version in each workspace's `package.json`.
3. Keep configuration patterns consistent between FE and BE (same fallback language, same namespace structure, same conventions).

Currently shared via catalog: `zod` (^4.4.3), `@types/node` (^24.13.2), `i18next` (^26.3.2), `date-fns` (^4.4.0).

## Database

- **Engine**: PostgreSQL
- **ORM**: Prisma 7 with `@prisma/adapter-pg`
- **Client output**: `be/generated/prisma/` (auto-generated, do not edit)
- **Migrations**: `be/prisma/migrations/` (auto-generated by `prisma migrate dev`)
- **Config**: `be/prisma.config.ts` (datasource URL, output path)
- **Env vars**: `DATABASE_URL` (Prisma migrations), `APP_DATABASE_URL` (runtime via pg adapter)

## HTTPS (Local Dev)

- Local certs in `cert/` folder (`localhost-key.pem`, `localhost.pem`).
- Server auto-detects cert presence: HTTPS if found, HTTP fallback otherwise.
- Generate with `mkcert localhost` or similar tool.

## Environment Variables (BE)

Required in `.env.{NODE_ENV}`:

| Variable           | Description                   |
| ------------------ | ----------------------------- |
| PORT               | Server port                   |
| DATABASE_URL       | Prisma connection string      |
| APP_DATABASE_URL   | Runtime pg connection string  |
| JWT_SECRET         | Access token signing secret   |
| JWT_REFRESH_SECRET | Refresh token signing secret  |
| JWT_ACCESS_EXPIRY  | Access token TTL (e.g. `15m`) |
| JWT_REFRESH_EXPIRY | Refresh token TTL (e.g. `7d`) |
| SMTP_HOST          | Mail server host              |
| SMTP_PORT          | Mail server port              |
| SMTP_USER          | Mail auth user (optional)     |
| SMTP_PASS          | Mail auth password (optional) |
| SMTP_FROM          | Sender email address          |

## Environment Variables (FE)

Set in `.env` or `.env.local`:

| Variable      | Description          |
| ------------- | -------------------- |
| VITE_MAIN_API | Backend API base URL |
