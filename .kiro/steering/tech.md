# Tech Stack & Build System

## Monorepo

- **Package manager**: pnpm (workspace protocol)
- **Workspace packages**: `fe/`, `be/`, `shared/`
- **Catalog deps** (pinned across workspaces): `zod`, `@types/node`

## Frontend (`fe/`)

| Concern      | Library                                              |
| ------------ | ---------------------------------------------------- |
| Framework    | React 19                                             |
| Bundler      | Vite 8                                               |
| Routing      | TanStack Router (file-based)                         |
| Server state | TanStack React Query                                 |
| Forms        | TanStack React Form                                  |
| Client state | Zustand (persist middleware)                         |
| Styling      | Tailwind CSS 4 + shadcn components                   |
| Validation   | Zod 4 (shared schemas)                               |
| HTTP         | Axios                                                |
| i18n         | i18next + react-i18next (lazy-loaded JSON resources) |
| Icons        | Tabler Icons React                                   |
| Compiler     | React Compiler (via Babel plugin)                    |

## Backend (`be/`)

| Concern    | Library             |
| ---------- | ------------------- |
| Runtime    | Node.js (ESM)       |
| Framework  | Express 5           |
| ORM        | Prisma (PostgreSQL) |
| Auth       | jsonwebtoken (JWT)  |
| Security   | helmet, cors        |
| Dev runner | tsx (watch mode)    |

## Shared (`shared/`)

Zod schemas and inferred TypeScript types consumed by both FE and BE via `itam-shared/schemas/*` exports.

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

Currently shared via catalog: `zod`, `@types/node`, `i18next`.
