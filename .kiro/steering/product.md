# Product: ITAM (IT Asset Management)

ITAM is an internal web application for managing IT assets (hardware, software, categories, models). It includes authentication, multi-language support (Vietnamese, English, Japanese), and a sidebar-based admin interface.

## Current Development State

The project is in **early development**. Core infrastructure is in place, with authentication and category management implemented end-to-end.

### Implemented Features

| Feature        | Status | Description                                                     |
| -------------- | ------ | --------------------------------------------------------------- |
| Authentication | Done   | Login, register, logout, token refresh (JWT + httpOnly cookie)  |
| Category CRUD  | Done   | Create, read, update, soft-delete categories                    |
| RBAC           | Done   | Role-based access control with section scoping + user overrides |
| Email service  | Done   | Account creation notification via SMTP + Handlebars templates   |
| i18n           | Done   | Multi-language (vi, en, jp on FE; vi, en on BE)                 |
| Theme          | Done   | Light/dark/system theme with persistence                        |

### Planned Features (Stubbed in Code)

- Asset management (hardware/software inventory)
- Model management (asset models under categories)
- Allocation tracking (asset assignment to users/departments)
- Maintenance scheduling
- Reporting

## Permission Model

ITAM uses a **section-scoped RBAC** system:

- **Roles** are assigned to users, optionally scoped to a **section** (e.g. department code `6100`).
- **RolePermission** grants actions on features (additive-only). Can be scoped to a section.
- **UserPermission** overrides role permissions per user (ALLOW to add, DENY to revoke). Also section-scoped.
- **Actions**: `CREATE`, `READ`, `UPDATE`, `DELETE`, `MANAGE` (wildcard), `APPROVAL`.
- **Section = null** means system-wide (applies to all sections).

Permission resolution order:

1. Collect role permissions matching user's roles + sections.
2. Check for user-level DENY overrides.
3. If denied at specific section only, check remaining sections.
4. Check for user-level ALLOW overrides (grants access outside role).

### Current Features (permission codes)

| Feature Code | Description         |
| ------------ | ------------------- |
| CATEGORY     | Category management |
| MODEL        | Model management    |

## Data Model (Prisma)

### Core Entities

- **User** — username (8-char PK), name, email, password (argon2), isActive, audit fields
- **Role** — code PK, name, isActive
- **Feature** — code PK, name, isActive

### Junction / Permission Tables

- **UserRole** — assigns roles to users with optional section scope
- **RolePermission** — grants feature+action to a role with optional section scope
- **UserPermission** — per-user ALLOW/DENY override with optional section scope

### Business Entities

- **Category** — asset category (id, name, serialKey, maintenanceIntervalHours, soft-delete)

## User Flows

### Registration

1. Admin submits username + email + name.
2. System generates random password, hashes with argon2.
3. Creates user record.
4. Sends email with credentials (template: `account-created.hbs`).

### Login

1. User submits username + password.
2. Validates credentials (argon2 verify).
3. Returns access token (body) + refresh token (httpOnly cookie) + user info + resolved permissions.
4. FE stores token + user + permissions in Zustand (persisted to localStorage).

### Session Refresh

1. FE interceptor detects 401 on any request.
2. Queues subsequent requests.
3. Calls `/api/auth/refresh` (cookie carries refresh token).
4. On success: updates token + permissions, replays queued requests.
5. On failure: clears auth state, redirects to login.

## UI Structure

- **Guest pages** (`_auth` layout): Centered card with banner image (login, register).
- **Authenticated pages** (`_app` layout): Collapsible sidebar + top header + content area.
- **Sidebar**: Permission-filtered navigation. Items with `featureCode` only show if user `hasPermission()`.
- **Toasts**: Sonner (top-right, rich colors, close button) for success/error notifications.
- **Loading**: `PageSkeleton` component shown during route transitions.
- **404**: Custom `NotFound` component rendered by router's `notFoundComponent`.
