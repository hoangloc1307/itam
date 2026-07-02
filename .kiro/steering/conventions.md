# Development Conventions

## i18n (Internationalization)

- **Always** add i18n keys for all user-facing text in both FE and BE.
- Never hardcode display strings — use translation keys instead.
- FE locales: `fe/src/i18n/locales/{en,vi,jp}/<namespace>.json`
- BE locales: `be/src/i18n/locales/{en,vi}/<namespace>.json`
- Use namespaced keys (e.g. `auth:validation.usernameRequired`, `common:error.title`).
- When creating a new feature, add translations to **all** existing locale files simultaneously.
- Fallback language is Vietnamese (`vi`).
- BE detects language via `Accept-Language` header (middleware `languageDetector`).
- Zod validation messages are i18n keys — the `requestValidator` middleware translates them before returning to client.

## Error Handling

### Backend

- Use `AppError` static factories: `AppError.unauthorized()`, `AppError.notFound()`, `AppError.badRequest()`, `AppError.conflict()`, `AppError.forbidden()`, `AppError.server()`.
- All `AppError` instances include: `httpStatusCode`, `errorCode`, `message`, `metadata` (optional).
- The global `errorHandler` middleware serializes `AppError` to JSON: `{ success, message, errorCode, metadata? }`.
- Non-AppError exceptions are caught as 500 with `INTERNAL_SERVER_ERROR` code.
- Always pass translated messages via `t('namespace:key')` to AppError factories.

### Frontend

- All mutations must go through `useAppMutation` wrapper (auto toast on error with errorCode).
- API errors (4xx/5xx) are handled by the mutation/query layer — no need for manual try-catch in components.
- Render crashes are caught by the root error boundary (`errorComponent` in `__root.tsx`).
- Unhandled promise rejections are caught globally in `main.tsx` (Axios errors suppressed, others toasted).

## API Response Format

All BE responses follow a consistent envelope:

```ts
// Success
{ success: true, message: string, data: T | null, pagination?: { page, limit, totalItems, totalPages } }

// Error
{ success: false, message: string, errorCode: string, metadata?: unknown }
```

Use `ApiResponse` class methods in controllers:

- `ApiResponse.ok(res, data?, message?)` — 200
- `ApiResponse.created(res, data?, message?)` — 201
- `ApiResponse.deleted(res)` — 204 (no body)
- `ApiResponse.paginated(res, data, { page, limit, totalItems }, message?)` — 200 with pagination

FE mirrors this with `ApiResponse<T>` type in `fe/src/types/api.ts`.

## Backend Module Pattern

Each feature module follows the structure:

```
modules/<name>/
├── <name>.route.ts        # Express Router, applies middleware (authorize, requestValidator)
├── <name>.controller.ts   # Thin layer: parse request → call service → send ApiResponse
└── <name>.service.ts      # Business logic, Prisma queries, throws AppError on failure
```

Register every new module in `modules/index.ts`:

```ts
export const modulesConfig: ModuleConfig[] = [
  { path: '/auth', router: authRouter, isPublic: true },
  { path: '/categories', router: categoryRouter },
];
```

- `isPublic: true` → route is mounted without `authenticate` middleware.
- Default (no `isPublic`) → `authenticate` is applied before the router.

## Authentication & Authorization

### Auth Flow

1. **Login**: validates credentials → returns `{ token, user, permissions }` + sets `refreshToken` as httpOnly cookie.
2. **Refresh**: reads `refreshToken` cookie → issues new `accessToken` + updated permissions.
3. **Logout**: clears the refresh token cookie.
4. **Register**: creates user with random password → sends credentials via email.

### Token Strategy

- **Access token**: short-lived JWT in response body, stored in Zustand (memory + localStorage).
- **Refresh token**: long-lived JWT in httpOnly cookie (path: `/api/auth/refresh`).
- FE axios interceptor handles 401 → queues failed requests → calls refresh → retries with new token.

### RBAC Authorization

- Middleware: `authorize(featureCode, action)` — checks permission before route handler.
- Permission model: Role-based with section scoping and user-level overrides (ALLOW/DENY).
- Actions: `CREATE`, `READ`, `UPDATE`, `DELETE`, `MANAGE` (wildcard), `APPROVAL`.
- FE stores permissions in `useAuthStore` with `hasPermission(featureCode, action?, section?)` helper.
- Sidebar menu items use `featureCode` to show/hide based on permissions.

## Frontend API Layer

### API Client Pattern

```
api/
├── <domain>.ts           # API methods (CRUD) using configured axios instance
└── <domain>.queries.ts   # queryOptions() factories for TanStack Query
```

- API files export an object with methods: `{ list, getById, create, update, remove }`.
- Query files export a factory object using `queryOptions()` for type-safe query keys and functions.
- Mutations are in `hooks/mutations/use-<domain>.ts`, wrapping API calls with `useAppMutation` + cache invalidation.

### Axios Instance (`lib/axios.ts`)

- Base URL from `configs/app.ts` (`VITE_MAIN_API` env var).
- Auto-attaches Bearer token from `useAuthStore`.
- Token refresh queue: on 401, queues concurrent requests, refreshes once, replays all.
- On refresh failure: clears auth state, redirects to `/login`.
- `withCredentials: true` for cookie-based refresh token.

## Frontend Forms

- Use `useAppForm` hook (from `hooks/use-app-form.ts`) — pre-configured TanStack Form with registered components.
- Field components: `TextField`, `NumberField` (in `components/app-input/`).
- Form components: `SubmitButton`.
- Validation uses shared Zod schemas from `itam-shared/schemas/*`.

## Soft Delete Pattern

- Records are never hard-deleted from the database.
- Use `isActive: Boolean @default(true)` column.
- "Delete" operations set `isActive = false` via `update()`.
- Queries should filter by `isActive` where appropriate.

## Email Service

- Uses Nodemailer with configurable SMTP (env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
- Email templates are Handlebars `.hbs` files in `be/src/templates/`.
- Template rendering uses `renderTemplate(templateName, data)` utility with in-memory cache.
- Call via `mailService.sendEmail({ to, subject, template, data })`.

## Pagination

- BE: controller parses `page` and `limit` from query params (defaults: page=1, limit=10, max=100).
- Service returns `{ data, totalItems }`.
- Controller uses `ApiResponse.paginated()` which calculates `totalPages`.
- FE: `ApiResponse<T>` type includes optional `pagination` field.

## Environment Configuration

- BE uses `.env.{NODE_ENV}` files (e.g. `.env.development`).
- All env vars are validated at startup with Zod schema (`be/src/schemas/env.ts`).
- Invalid env → process exits with descriptive error.
- Access via `env` object exported from `~/configs/env`.

## Naming Conventions

- **Files**: kebab-case (`category.service.ts`, `use-app-mutation.ts`).
- **Components**: PascalCase (`AppSidebar`, `CategoryForm`).
- **Hooks**: camelCase with `use` prefix (`useAppMutation`, `useCreateCategory`).
- **API objects**: camelCase (`categoryApi`, `authApi`).
- **Constants**: UPPER_SNAKE_CASE for values (`STORAGE_KEYS`, `HTTP_STATUS`, `ERROR_CODES`).
- **DB tables**: snake_case via Prisma `@@map` (e.g. `user_role`, `role_permission`).
- **DB columns**: snake_case via `@map` (e.g. `created_at`, `is_active`).
