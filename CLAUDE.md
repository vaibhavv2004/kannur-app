# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint (flat config, `eslint.config.js`)

There is no test runner configured in this project (no test script, no test files).

## Architecture

This is a React 19 + Vite single-page site for a Kerala MLA's public portal (`mla-website`), styled with Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — Tailwind v4 is CSS-driven, entry point `src/index.css`).

**No router.** `src/App.jsx` is the sole owner of navigation and top-level state: it holds `currentTab` (a path string matching `src/constants/routes.js`) and renders the matching view via a `switch` in `renderView()`. Navigation components (`Header`, `Footer`) don't navigate directly — they call a `setCurrentTab`/`handleAdminNavigation` callback passed down as a prop.

**No backend.** All "data" is client-side:
- Static content (profile, stats, landmarks, schemes, etc.) lives in `src/constants/data.js`.
- Site-wide info (name, contact, social links, and — notably — the admin login credentials) lives in `src/config/siteConfig.js` as `adminCredentials: { username, password }`. Admin login (`AdminLoginView.jsx`) checks the form input against this in-memory value; there is no real auth backend.
- Mutable app state (grievances/petitions, legislative attendance, legislative questions, current tab, admin-logged-in flag) is held in `App.jsx` via `useState` and persisted to `sessionStorage` through paired `useEffect`s (keys like `mla_grievances`, `mla_attendance`, `mla_questions`, `mla_tab`, `mla_admin_auth`). Effects are kept outside state updaters deliberately (see comment in `App.jsx`) to stay safe under React StrictMode's double-invoke.

**Admin/CMS editing pattern.** Every view accepts an `isAdmin` prop threaded down from `App.jsx`. Editable copy on public pages uses `src/components/common/EditableText.jsx`, which renders plain text for visitors but an inline hover-to-edit control (with save/cancel) when `isAdmin` is true — this is the site's in-place CMS mechanism rather than a separate admin form for content. `AdminView.jsx` is the separate dashboard (reachable at `/admin`) for managing grievances and legislative records specifically; it receives lifted state and setters (`grievances`/`setGrievances`, `attendance`/`setAttendance`, `questions`/`setQuestions`) directly as props from `App.jsx` rather than owning them.

**Structure:**
- `src/components/views/` — one component per top-level page/tab (`HomeView`, `AboutView`, `ConstituencyView`, `LegislativeView`, `DevelopmentView`, `NewsView`, `GalleryView`, `SchemesView`, `ContactView`, `AdminView`, `AdminLoginView`).
- `src/components/common/` — shared chrome and primitives (`Header`, `Footer`, `Button`, `Container`, `PageHeader`, `SectionTitle`, `Logo`, `EditableText`).
- `src/constants/` — `routes.js` (path constants), `navigation.js` (nav bar entries, built from `routes.js`), `data.js` (page content/copy), `color.js` (currently unreferenced — not imported anywhere).
- `src/styles/theme.css` also currently unreferenced (not imported anywhere); global styles actually in effect come from `src/index.css` and `src/App.css`.

Icons throughout come from `lucide-react`.
