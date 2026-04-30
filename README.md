# base-react-fn

A minimal, batteries-included React admin-console starter. Use it as the base for a new project: rename it, add routes/views/types/locales, and you're moving.

> **AI agents:** start with [project-structure.md](./project-structure.md) — it is the planning context (layout, contracts, global conventions, add-a-feature recipes).

---

## Tech Stack

| Area          | Choice                                                              |
| ------------- | ------------------------------------------------------------------- |
| Framework     | React 19 + TypeScript + Vite 8                                      |
| Compiler      | React Compiler (via `babel-plugin-react-compiler`)                  |
| Routing       | `@tanstack/react-router` (code-based route tree, auto code-split)   |
| State         | Zustand (global store exposed on `globalThis.$store`)               |
| UI            | shadcn/ui (Radix primitives) + Tailwind CSS 4 + `tw-animate-css`    |
| Icons         | `lucide-react`                                                      |
| HTTP          | Axios (singleton through `@/plugins/apiService`)                    |
| i18n          | `i18next` + `react-i18next` (en, th — auto-loaded JSON namespaces)  |
| Toasts        | `sonner`                                                            |
| Dev tooling   | ESLint 9, Prettier (inline in `package.json`), `agentation` (dev)   |

## Prerequisites

- Node.js 20+ (Vite 8 requirement)
- `bun` recommended — `npm` / `pnpm` also work

## Quickstart

```bash
bun install
bun run dev        # starts Vite dev server
bun run build      # tsc -b && vite build
bun run preview    # serve the production build
bun run lint       # eslint .
```

## Environment Variables

| Variable                  | Default                 | Notes                                     |
| ------------------------- | ----------------------- | ----------------------------------------- |
| `VITE_API_BASE_URL`       | `http://localhost:9000` | Base URL. `/api/v1` is appended internally. |
| `window.__API_BASE_URL__` | —                       | Runtime override (takes precedence).      |

The API client reads `localStorage.access_token` and sets `Authorization: Bearer …`, plus `Accept-Language` from `localStorage.lang` (defaults to `en`). On any `401`, it clears the token and dispatches a `CustomEvent('auth:unauthorized')`.

## Global Variables

Declared in [src/main.tsx](src/main.tsx) and attached to `globalThis` — usable inside any component without import.

| Global          | Source                                         | Purpose                                  |
| --------------- | ---------------------------------------------- | ---------------------------------------- |
| `ApiService`    | `@/plugins/apiService`                         | Typed HTTP facade.                       |
| `$t`            | `i18next` `t` bound to the current locale      | Translate a namespaced key.              |
| `$setLocale`    | —                                              | Switch locale + re-render the app.       |
| `$currentLang`  | —                                              | Current lang code (`'en'` / `'th'`).     |
| `$toast`        | `sonner`                                       | Fire toast notifications.                |
| `$store`        | `useGlobalStore.getState()` snapshot           | Imperative access to global state.       |

## Common Tasks

### Rename the app

1. Update `name` in [package.json](package.json).
2. Update `<title>` in [index.html](index.html).
3. Update `appName` / `appTagline` in [src/locales/en/menu.json](src/locales/en/menu.json) + `th/menu.json`.
4. Update `footerTitle` / `footerCopy` in [src/locales/en/login.json](src/locales/en/login.json) + `th/login.json`.
5. Optional: swap logo/background in [src/assets/images/](src/assets/images/).

### Add a page

1. Create `src/views/MyPage.tsx`.
2. Register a route in [src/routers/index.tsx](src/routers/index.tsx) under `layoutRoute` (authed) or `rootRoute` (public).
3. Add a menu entry in [src/constants/menu.ts](src/constants/menu.ts) with an `i18n` label key.
4. Add the label to each locale JSON under `src/locales/<lang>/menu.json`.

### Add an API call

Add a method on `ApiService` in [src/plugins/apiService.ts](src/plugins/apiService.ts) and a matching type in [src/types/](src/types/). Always wrap with `unwrapApiResponse<T>` from [src/plugins/axios.ts](src/plugins/axios.ts) — the backend envelope is `{ status, message, data }`.

### Add a translation

Drop a key into the matching namespace JSON under both `src/locales/en/<ns>.json` and `src/locales/th/<ns>.json`. Namespaces are derived from filename. Missing keys are warned in dev.

### Add a shadcn component

Use `bunx shadcn@latest add <component>` or copy manually into `src/components/ui/`. Tailwind theme tokens live in [src/assets/themes/](src/assets/themes/).

## Conventions

- **Formatting** — 4-space indent, single quotes, no semicolons, 120-char width, ES5 trailing commas (driven by the `prettier` block in `package.json`).
- **Imports** use the `@/…` alias (configured in both `tsconfig` and `vite.config.ts`).
- **Section comments** — larger components are divided by `// ─── SECTION ────────` banners (see [src/layouts/AppLayout.tsx](src/layouts/AppLayout.tsx) for the canonical set: `IMPORTS`, `FILE-LOCAL CONSTANTS`, `COMPONENT`, `DATA STATE & LIB`, `METHODS`, `RENDER`).
- **Components** — shadcn primitives in `src/components/ui/`, shared widgets in `src/components/common/`, feature-scoped in `src/components/<feature>/`.
- **Views** (routed pages) live in `src/views/`.
- **No default React import needed** — `jsx: "react-jsx"`.

## What's included out-of-the-box

- Login + OTP verification flow wired against a sample `/auth/*` API shape.
- Authed shell (sidebar + header + language toggle + user dropdown).
- Dashboard placeholder page.
- Bilingual scaffolding (en + th) for `common`, `login`, `menu`, `otp` namespaces.
- Full shadcn/ui primitive set under `src/components/ui/`.
- Global loading overlay wired through the Zustand store.

## Project Structure

See [project-structure.md](./project-structure.md) for the full directory map, layer contracts, and an **AI agent planning checklist** for common changes.
