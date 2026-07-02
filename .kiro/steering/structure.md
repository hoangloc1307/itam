# Project Structure

```
ITAM/
├── fe/                     # Frontend (React + Vite)
│   └── src/
│       ├── api/            # API client modules (one file per domain)
│       │   ├── auth.ts             # Auth API methods (login, register)
│       │   ├── category.ts         # Category CRUD API methods
│       │   └── category.queries.ts # TanStack Query queryOptions factory
│       ├── assets/         # Static images, SVGs, flags
│       ├── components/     # Reusable components
│       │   ├── ui/         # Primitive UI components (shadcn-style)
│       │   ├── app-input/  # Form field components bound to TanStack Form (TextField, NumberField, SubmitButton)
│       │   ├── app-sidebar.tsx     # Main sidebar component
│       │   ├── site-header.tsx     # Top header with breadcrumbs
│       │   ├── nav-main.tsx        # Primary navigation (permission-filtered)
│       │   ├── nav-secondary.tsx   # Secondary navigation (support, feedback)
│       │   ├── category-form.tsx   # Category create/edit form
│       │   ├── confirm-dialog.tsx  # Reusable confirmation dialog
│       │   ├── language-switcher.tsx # Language dropdown
│       │   ├── theme-toggle.tsx    # Light/dark theme toggle
│       │   ├── user-option.tsx     # User menu dropdown
│       │   ├── not-found.tsx       # 404 component
│       │   └── page-skeleton.tsx   # Loading skeleton placeholder
│       ├── configs/        # App-level configuration
│       │   ├── app.ts      # Environment vars (API URL, timeout)
│       │   └── menu.ts     # Sidebar menu structure (featureCode-based visibility)
│       ├── constants/      # Enums, storage keys, static values
│       │   ├── storage-keys.ts  # LocalStorage keys (THEME, LANGUAGE, AUTH)
│       │   └── languages.ts     # Supported languages with flags
│       ├── hooks/          # Custom React hooks
│       │   ├── mutations/  # TanStack Query mutation hooks (one per domain)
│       │   │   ├── use-auth.ts      # useLogin, useRegister
│       │   │   └── use-category.ts  # useCreateCategory, useUpdateCategory, useDeleteCategory
│       │   ├── use-app-form.ts      # TanStack Form hook with registered field/form components
│       │   ├── use-app-mutation.ts  # Mutation wrapper with auto error toast
│       │   ├── use-theme.ts         # Theme sync hook
│       │   └── use-mobile.ts        # Responsive breakpoint hook
│       ├── i18n/           # i18next setup + locale JSON files (en, vi, jp)
│       ├── lib/            # Utility modules
│       │   ├── auth.ts     # isAuthenticated() helper
│       │   ├── axios.ts    # Configured axios instance with token refresh queue
│       │   ├── http-client.ts # Generic HttpClient class (typed wrapper over axios)
│       │   └── utils.ts    # General utilities (cn, etc.)
│       ├── routes/         # TanStack Router file-based routes
│       │   ├── __root.tsx  # Root layout (QueryClientProvider, Toaster, error boundary)
│       │   ├── _app.tsx    # Authenticated layout (sidebar + header)
│       │   ├── _app/       # Authenticated child routes
│       │   │   ├── dashboard.tsx
│       │   │   └── category.tsx
│       │   ├── _auth.tsx   # Guest-only layout (centered card with banner)
│       │   ├── _auth/      # Guest child routes
│       │   │   ├── login.tsx
│       │   │   └── register.tsx
│       │   └── index.tsx   # Root index redirect
│       ├── stores/         # Zustand stores (one file per domain)
│       │   ├── auth.ts     # Token, user, permissions, hasPermission()
│       │   └── theme.ts    # Theme preference (light/dark/system)
│       ├── types/          # TypeScript type definitions
│       │   └── api.ts      # ApiResponse<T> interface (success, message, data, pagination)
│       ├── main.tsx        # App entry point + global error handler
│       └── routeTree.gen.ts # Auto-generated route tree (do not edit)
├── be/                     # Backend (Express)
│   └── src/
│       ├── configs/        # Middleware & service configs
│       │   ├── cors.ts     # CORS configuration
│       │   ├── env.ts      # dotenv + Zod validation
│       │   ├── helmet.ts   # Helmet security headers
│       │   ├── mail.config.ts # Nodemailer transporter setup
│       │   └── index.ts    # Re-exports all configs
│       ├── constants/      # Shared constants
│       │   ├── error-codes.ts  # Centralized error code enum
│       │   ├── http-status.ts  # HTTP status code map
│       │   └── index.ts        # Re-exports
│       ├── errors/         # Custom error classes
│       │   ├── app-error.ts    # AppError class with static factories (unauthorized, notFound, etc.)
│       │   └── index.ts        # Re-exports
│       ├── i18n/           # Backend i18n (i18next + fs-backend)
│       │   ├── index.ts    # i18next init, t() helper, changeLanguage()
│       │   └── locales/    # Translation files (en, vi)
│       ├── lib/            # Shared utilities
│       │   └── prisma.ts   # Prisma client singleton
│       ├── middlewares/    # Express middleware
│       │   ├── authenticate.ts     # JWT Bearer token verification
│       │   ├── authorize.ts        # RBAC permission check (feature + action + section)
│       │   ├── error-handler.ts    # Global error handler (AppError → JSON)
│       │   ├── language-detector.ts # Accept-Language header → i18n language
│       │   ├── not-found-handler.ts # 404 catch-all
│       │   ├── request-validator.ts # Zod schema body validation with i18n errors
│       │   └── index.ts            # Re-exports
│       ├── modules/        # Feature modules
│       │   ├── auth/       # Authentication module
│       │   │   ├── auth.route.ts
│       │   │   ├── auth.controller.ts
│       │   │   └── auth.service.ts
│       │   ├── category/   # Category CRUD module
│       │   │   ├── category.route.ts
│       │   │   ├── category.controller.ts
│       │   │   └── category.service.ts
│       │   └── index.ts    # modulesConfig array (path + router + isPublic)
│       ├── schemas/        # Env validation schemas
│       │   └── env.ts      # Zod schema for .env variables
│       ├── services/       # Shared services (cross-module)
│       │   └── mail.service.ts  # Email sending (nodemailer + Handlebars templates)
│       ├── templates/      # Handlebars email templates
│       │   ├── account-created.hbs
│       │   └── forgot-password.hbs
│       ├── utils/          # Pure utility functions
│       │   ├── api-response.ts  # ApiResponse class (ok, created, deleted, paginated)
│       │   ├── jwt.ts           # JWT sign/verify helpers (access + refresh tokens)
│       │   ├── password.ts      # argon2 hash/verify + random password generator
│       │   ├── template.ts      # Handlebars template renderer with cache
│       │   └── index.ts         # Re-exports
│       ├── app.ts          # Express app setup + middleware pipeline + module mounting
│       └── server.ts       # HTTP/HTTPS server bootstrap (auto-detects local certs)
│   ├── generated/          # Auto-generated (Prisma client — do not edit)
│   ├── prisma/
│   │   ├── schema.prisma   # Prisma schema definition
│   │   └── migrations/     # Migration history
│   └── prisma.config.ts    # Prisma config (datasource URL, migrations path)
├── shared/                 # Shared package (itam-shared)
│   └── src/
│       └── schemas/        # Zod schemas + inferred types
│           ├── auth.ts     # loginSchema, registerSchema + types
│           └── category.ts # createCategorySchema, updateCategorySchema + types
├── cert/                   # Local HTTPS certificates (localhost-key.pem, localhost.pem)
├── pnpm-workspace.yaml     # Workspace definition + catalog deps
└── commitlint.config.ts    # Commit convention config
```

## Key Conventions

- **Route layouts**: Prefix with `_` (e.g. `_app.tsx` for authenticated shell, `_auth.tsx` for guest pages). Child routes live in matching folders.
- **Route tree**: `routeTree.gen.ts` is auto-generated by the TanStack Router plugin — never edit manually.
- **API layer**: Each domain gets two files in `api/`: a methods file (e.g. `category.ts`) and a queries factory file (e.g. `category.queries.ts` using `queryOptions()`). Mutations wrap API methods via hooks in `hooks/mutations/`.
- **State**: Zustand stores in `stores/` — one store per domain, using `persist` middleware where needed.
- **Validation**: Schemas live in `shared/src/schemas/` so both FE and BE share the same validation logic and types.
- **i18n keys**: Validation messages use namespaced i18n keys (e.g. `auth:validation.usernameRequired`) so error strings are translatable.
- **UI components**: `components/ui/` contains low-level primitives (shadcn). App-specific composed components live directly in `components/`.
- **BE module pattern**: Each module has `<name>.route.ts`, `<name>.controller.ts`, `<name>.service.ts`. Registered in `modules/index.ts`.
- **BE utils vs services**: `utils/` holds pure functions (no side effects). `services/` holds stateful/async services (mail, external integrations).
- **FE types**: Shared TypeScript interfaces (e.g. `ApiResponse<T>`) live in `types/`.
