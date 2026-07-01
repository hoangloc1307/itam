# Development Conventions

## i18n (Internationalization)

- **Always** add i18n keys for all user-facing text in both FE and BE.
- Never hardcode display strings — use translation keys instead.
- FE locales: `fe/src/i18n/locales/{en,vi,jp}/<namespace>.json`
- BE locales: `be/src/i18n/locales/{en,vi}/<namespace>.json`
- Use namespaced keys (e.g. `auth:validation.usernameRequired`, `common:error.title`).
- When creating a new feature, add translations to **all** existing locale files simultaneously.
- Fallback language is Vietnamese (`vi`).

## Error Handling

- All mutations must go through `useAppMutation` wrapper (auto toast on error).
- API errors (4xx/5xx) are handled by the mutation/query layer — no need for manual try-catch in components.
- Render crashes are caught by the root error boundary (`errorComponent` in `__root.tsx`).
- Unhandled promise rejections are caught globally in `main.tsx`.
