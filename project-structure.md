# Project Structure — AI Agent Context

**Purpose:** This is the planning context for AI agents working on `base-react-fn` (or any project cloned from it). Read this *before* proposing changes. It covers directory layout, layer contracts, global conventions, and ready-made recipes for common feature additions.

**Status of this template:** Minimal. It ships with login + OTP + a dashboard shell and nothing else. Every other feature is yours to add.

---

## TL;DR for AI Agents

Before writing code, confirm:

1. **Where does this belong?** — Views in `src/views/`, shared UI in `src/components/common/`, feature UI in `src/components/<feature>/`, shadcn primitives in `src/components/ui/`.
2. **Does the HTTP call go through `ApiService`?** — Yes, always. Views must never import axios directly.
3. **Are user-visible strings translated?** — Yes. `$t('namespace:key')` — add keys to *both* `en/` and `th/` JSON files.
4. **Am I expanding the global store?** — Only for truly cross-cutting state. Default to local `useState`.
5. **Did I add React imports?** — Not needed for JSX (`jsx: "react-jsx"`). `import type` for types (`verbatimModuleSyntax: true`).

When adding a new feature, follow the recipes in [Add-a-Feature Recipes](#add-a-feature-recipes) below.

---

## Top-Level Layout

```
base-react-fn/
├── index.html              # Vite entry — loads /src/main.tsx, sets <title>
├── package.json            # deps + prettier config + name
├── tsconfig*.json          # path alias: @/* → ./src/*
├── vite.config.ts          # React compiler, Tailwind, alias plugins
├── components.json         # shadcn/ui generator config
├── eslint.config.js
├── .env.example            # template for VITE_API_BASE_URL
├── README.md               # human quickstart
├── project-structure.md    # this file — AI agent planning context
└── src/
    ├── main.tsx            # boot: i18n, globals, root render, <App/>
    ├── routers/            # TanStack Router route tree
    ├── layouts/            # shell components (sidebar + header)
    ├── views/              # routed page components
    ├── components/         # UI — split into ui/, common/, <feature>/
    ├── stores/             # Zustand stores
    ├── plugins/            # axios + typed ApiService facade
    ├── constants/          # static app data (menu tree, etc.)
    ├── locales/            # i18n JSON, auto-loaded per namespace
    ├── types/              # domain types shared across layers (empty in template)
    ├── lib/                # small pure utilities (cn, etc.)
    ├── utils/              # app utilities (side-effectful OK; xlsx, sound)
    └── assets/
        ├── images/         # Logo.png, school-bg.jpg (replace with your own)
        └── themes/         # globals.scss + main.css (Tailwind tokens)
```

---

## Boot Sequence — `src/main.tsx`

1. Imports `locale`, `router`, `store`, `apiService`, and the two theme files.
2. Attaches globals to `globalThis`:
   - `ApiService`, `$t`, `$setLocale`, `$currentLang`, `$toast`, `$store`
3. Reads/creates the React root on `#root` (idempotent across HMR via `window.__root`).
4. `renderApp()` renders `<RouterProvider>` with **`key={$currentLang}`** — this forces a full remount on locale change so all `$t` reads refresh.
5. Exports `App` — consumed as the **root route component** in [src/routers/index.tsx](src/routers/index.tsx). `App` is *not* imported anywhere else.

### `App` responsibilities

- Subscribes to `$store.screenLoading` and renders the global `<LoadingOverlay>`.
- Wraps `<Outlet/>` with `<Template/>` and always-on toast + dev-only `<Agentation/>`.

---

## Routing — `src/routers/index.tsx`

Code-based TanStack Router tree (template default):

```
rootRoute           (component: App)
 ├── /login         — LoginPage (public)
 └── app-layout     (component: AppLayout — authed shell)
      └── /        — DashboardPage
```

- New **authed** pages → push into the `childrenRoute` array under `layoutRoute`.
- New **public** pages (forgot-password, signup, etc.) → add as top-level `createRoute` under `rootRoute`.
- `defaultNotFoundComponent: NotFoundPage`.
- Auto code-splitting is available via `@tanstack/router-plugin` (Vite plugin, optional — not wired into `vite.config.ts` by default).

---

## Layouts — `src/layouts/`

- **`AppLayout.tsx`** — the authed shell: collapsible sidebar, header, language toggle, user dropdown. Sidebar content is generated from `menuItems` + `menuSections` in `@/constants/menu`. Renders `<Outlet/>` inside the content area.

Create a new layout file only when a whole branch of routes needs a different shell (e.g. a print-friendly invoice layout, or an unauthenticated onboarding flow separate from login).

---

## Views — `src/views/`

One file per routed page. Naming: `<Something>Page.tsx` (exception: `OTPVerification.tsx` is a sub-step of the login flow, not a routed page).

Responsibilities:

- Fetch data via `ApiService` (never axios directly).
- Compose shadcn primitives and feature components.
- Use `$t` for all user-visible strings — never hard-code English.

**Template views:** `DashboardPage`, `LoginPage`, `OTPVerification`, `NotFoundPage`.

---

## Components — `src/components/`

Three buckets, picked by scope:

| Bucket       | Lives in                     | Examples                                 | When to use                                 |
| ------------ | ---------------------------- | ---------------------------------------- | ------------------------------------------- |
| shadcn/ui    | `components/ui/`             | `button`, `dialog`, `data-table`         | Generated primitives — keep patch-friendly. |
| Common app   | `components/common/`         | `Template`, `LoginLangSwitcher`          | Cross-feature widgets, app-flavored.        |
| Feature      | `components/<feature>/`      | `users/CreateUserDialog` (when you add)  | Tied to a specific page or domain.          |

### `components/ui/` — key modules (shipped with template)

- **`loading.tsx`** — `Spinner`, `LoadingButtonContent`, `Skeleton`, `SkeletonText/Card/Table`, `PageLoading`, `LoadingOverlay` (fade in/out), `InlineLoading`.
- **`states.tsx`** — `EmptyState`, `EmptySearchResults`, `EmptyDataState`, `ErrorState`, `ConnectionError`, `ServerError`, `OfflineBanner`, `WarningBanner`, `InfoBanner`, `NotFoundState`, `NoPermissionState`.
- **`data-table.tsx`**, **`pagination-bar.tsx`**, **`advanced-filter.tsx`** — list-view building blocks.
- **`confirm-dialog.tsx`**, **`form-field.tsx`**, **`form-select.tsx`**, **`form.tsx`** — form UX helpers.
- **`date-picker.tsx`**, **`input-otp.tsx`** — input specializations.
- **`utils.ts`** — exports `cn(...)` (clsx + tailwind-merge). Used by every primitive.
- **`sonner.tsx`** — default Toaster + re-exported `toast`.
- **`use-mobile.ts`** — responsive hook.

### Component style

See [src/layouts/AppLayout.tsx](src/layouts/AppLayout.tsx) for the canonical section banners. Order: `IMPORTS` → `FILE-LOCAL CONSTANTS` → `COMPONENT` → `DATA STATE & LIB` → `METHODS` → `RENDER`.

---

## State — `src/stores/`

Single Zustand store in `global.ts`:

```ts
interface GlobalState {
    screenLoading: boolean
    setScreenLoading: (loading: boolean) => void
}
```

Exported as **`useGlobalStore.getState()`** (snapshot of state + actions). Consumers:

- Call **actions** directly: `$store.setScreenLoading(true)` — works because the setter closes over `set`.
- For **reactive reads** inside components, subscribe via `store.subscribe(...)` (see `App` in [src/main.tsx](src/main.tsx)) or promote the state to a `useState` mirror.

**When to add global state:** only if multiple unrelated views need it. Default to local `useState`/`useReducer`.

---

## HTTP Layer — `src/plugins/`

### `axios.ts`

Creates an axios instance on demand:

- `baseURL` = `VITE_API_BASE_URL` (or `window.__API_BASE_URL__`) + `/api/v1`.
- Request interceptor injects `Authorization: Bearer <access_token>` and `Accept-Language`.
- Response interceptor: on `401` clears `access_token`, fires `auth:unauthorized` window event; on error rejects with an `Error` whose message is `response.data.message` or the axios message.
- `unwrapApiResponse<T>(req)` strips the `{ status, message, data }` envelope and returns `data`.

### `apiService.ts`

Typed facade. All endpoints live on the `ApiService` class and return already-unwrapped data. One shared instance is exported as default and also attached to `globalThis.ApiService`.

**Template shipped with:** `requestOTP`, `verifyOTP`, `requestPasswordReset`. Add feature endpoints below the `FEATURE ENDPOINTS` banner.

**Rule:** every network call goes through `ApiService`. Views must not import axios directly.

---

## i18n — `src/locales/`

- Filenames are namespaces: `en/menu.json` → namespace `menu`.
- `src/locales/index.ts` uses `import.meta.glob('./**/*.json', { eager: true })` to auto-load everything. No manual registration.
- `defaultNS: 'web'` (unused by default — will pick up an `en/web.json` if you add one).
- Missing keys log a warning in dev (`[i18n] Missing key: …`).
- Switch locale via `$setLocale('th')`. It updates `$t`, `$currentLang`, re-renders the app. `localStorage.lang` is what the axios client reads — persist there if you need stickiness across reloads.

**Template namespaces:** `common`, `login`, `menu`, `otp`.

---

## Types — `src/types/`

Domain models shared between `ApiService` and views. Add one file per aggregate (e.g. `user.ts`, `product.ts`). Keep mappers (`toApi…`) co-located with the DTO type so both sides of the wire are in one place.

*(Empty in the template — your first feature adds the first file.)*

---

## Constants — `src/constants/`

Static app configuration that isn't secrets or env-dependent.

- **`menu.ts`** — declarative sidebar: `menuItems` keyed by section, `menuSections` ordered list, `MenuSection` type. Adding a page means adding one entry here plus a translation key.

---

## Utilities — `src/lib/` and `src/utils/`

- **`lib/utils.ts`** — pure utilities (currently re-exports `cn`).
- **`utils/xlsxUtils.ts`** — generic xlsx download/parse helpers (`downloadAsXlsx`, `downloadJsonAsXlsx`, `parseXlsxFile`, `parseExcelDate`). Uses `xlsx-js-style` + `file-saver`.
- **`utils/NotifySound.ts`** — `playSound('success' | 'error' | 'info' | 'warning')` via Web Audio API.

Convention: `lib/` is side-effect-free, `utils/` may touch DOM/globals.

---

## Assets — `src/assets/themes/`

- `globals.scss` — Sass globals, including login/OTP page class styles.
- `main.css` — Tailwind 4 `@theme` tokens and base styles.

Imported once at the top of `main.tsx`. **Don't import CSS from components.**

---

## Path Aliases & TS

- `@/*` → `./src/*` (set in both `tsconfig.app.json` and `vite.config.ts`).
- `jsx: "react-jsx"` — no `import React` required in `.tsx` files.
- `verbatimModuleSyntax: true` — use `import type` for type-only imports (compile error otherwise).
- `noUnusedLocals` / `noUnusedParameters` are on — prefix intentionally-unused identifiers with `_`.
- `noFallthroughCasesInSwitch` on — every `case` needs `break`/`return`.
- Target: `es2023`, module resolution: `bundler`.

---

## Contracts at a Glance

| Boundary                   | Contract                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| View → backend             | Call `ApiService.<method>(…)`. Never import axios in a view.     |
| Component → translation    | `$t('namespace:key')`. Never hard-code copy.                     |
| Component → global state   | Actions: `$store.setX(...)`. Reactive reads: subscribe or mirror. |
| Route → layout             | Put authed routes under `layoutRoute`; public under `rootRoute`. |
| New menu entry             | `menu.ts` + `menu.json` (en + th). Icon from `lucide-react`.     |
| New shadcn primitive       | Drop into `components/ui/`. Use `cn` from `./utils`.             |
| Toast feedback             | `$toast.success(...)` / `$toast.error(...)`.                     |
| Global loading             | `$store.setScreenLoading(true)` → overlay appears.               |

---

## Add-a-Feature Recipes

### Recipe: Add a new CRUD page

1. **Types** — create `src/types/<entity>.ts` with the DTO, filters, and a paginated-response shape. Co-locate mappers (`toApi…`, `fromApi…`).
2. **API** — add methods on `ApiService` (`getX`, `getXById`, `createX`, `updateX`, `deleteX`). All use `unwrapApiResponse<T>`.
3. **View** — `src/views/<Entity>Page.tsx`. Compose `data-table` + `advanced-filter` + `pagination-bar` from `components/ui/`. Fetch via `ApiService` on mount and filter change.
4. **Feature components** — dialogs (create/edit/delete) under `src/components/<entity>/`.
5. **Route** — register in `childrenRoute` in `src/routers/index.tsx`.
6. **Menu** — add a `menuItem` in `src/constants/menu.ts` (pick a lucide icon).
7. **i18n** — create `src/locales/en/<entity>.json` + `src/locales/th/<entity>.json`. Add the menu label to `menu.json` in both languages.

### Recipe: Add a new menu section

1. Extend `menuItems` in `src/constants/menu.ts` with the new section key.
2. Push the section into `menuSections` (order = sidebar order).
3. Add `sectionMyKey: "..."` to `en/menu.json` and `th/menu.json`.
4. Update `defaultOpenGroups` in `src/layouts/AppLayout.tsx` (decide whether the section starts collapsed).

### Recipe: Add a public (unauthed) page

1. Create `src/views/<Page>.tsx`.
2. In `src/routers/index.tsx`, add a new `createRoute({ getParentRoute: () => rootRoute, path: '/xxx', component: ... })`.
3. Include it in the `rootRoute.addChildren([...])` array next to `loginRoute`.

### Recipe: Add a protected route guard

Not included by default. Recommended pattern:

- In `AppLayout.tsx`, check `localStorage.access_token` on mount and `navigate({ to: '/login' })` if missing.
- Listen for the `auth:unauthorized` window event (dispatched by `axios.ts` on `401`) and redirect there too.

### Recipe: Rename / rebrand the app

1. `name` in `package.json`.
2. `<title>` in `index.html`.
3. `appName` + `appTagline` in `src/locales/en/menu.json` + `th/menu.json`.
4. `footerTitle` + `footerCopy` in `src/locales/en/login.json` + `th/login.json`.
5. Replace `src/assets/images/Logo.png` and `src/assets/images/school-bg.jpg`.
6. Swap the `LayoutGrid` icon in `AppLayout.tsx` for something brand-appropriate.

---

## What's *Not* Included (By Design)

This template is deliberately minimal. If your project needs one of these, it's on you to add:

- **Protected-route guards** — see recipe above.
- **Token refresh** — only `401` clearing is wired; no refresh flow.
- **Form libraries** — shadcn `form.tsx` is there (react-hook-form + zod); pick your schema strategy.
- **React Query / SWR** — not installed. Fetching uses bare `ApiService` calls + component state.
- **Testing framework** — not installed.
- **CI configuration** — none included.
- **Domain features** — no users page, no settings page, no dashboard data; the dashboard is a placeholder card.
