# Changelog

All notable changes to MockAI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — Phase 1 Architecture Foundation

**Date:** 2026-07-08

### Added

- Next.js 16 App Router scaffold with TypeScript and Tailwind CSS v4.
- `legacy/` — preserved Vite/React SPA for migration reference.
- `src/lib/firebase-admin.ts` — lazy-initialized Firebase Admin SDK (`adminDb`, `adminAuth`).
- `src/lib/auth.ts` — `requireAuth`, `assertOwnership`, `UnauthorizedError`.
- `src/middleware.ts` — session cookie guard for `/dashboard`, `/interview`, `/profile`.
- Nine API route stubs under `src/app/api/` with auth + ownership patterns.
- Domain types in `src/types/` and Zod validation stubs in `src/lib/validations/`.
- Stub module graph for `agents/`, `features/`, `components/`.
- `docs/ARCHITECTURE.md` — folder structure and security model.
- `docs/superpowers/plans/2026-07-08-phase-1-architecture-foundation.md` — implementation plan.

### Changed

- `.env.example` — Phase 1 variables (`FIREBASE_SERVICE_ACCOUNT_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_FIREBASE_*`).
- `vercel.json` — Next.js framework config (removed SPA rewrite).
- Root `package.json` — Next.js scripts replace Vite.

### Security

- Gemini and Firebase Admin credentials are server-only env vars (no `VITE_*` in Next.js app).
- API routes return 404 (not 403) on ownership mismatch to avoid resource enumeration.

## [0.0.1] — Audit Baseline

**Date:** 2026-07-08

### Added

- `docs/AUDIT.md` — Phase 0 security audit, Firestore inventory, route map, Gemini call sites, lint/build baseline, and known issues.
- `.env.example` — documented environment variables with `PUBLIC`, `SERVER_ONLY`, and `LEGACY` classifications.
- `CHANGELOG.md` — project change history starting at audit baseline.

### Changed

- `.gitignore` — ignore all `.env*` files except `.env.example`.
- `eslint.config.js` — disabled `react/prop-types` (project does not use PropTypes); removed trivial `no-unused-vars` violations across source files.

### Security

- **Action required (developer):** Rotate `VITE_GEMINI_API_KEY` in [Google AI Studio](https://aistudio.google.com/app/apikey). The current key is bundled into the client via Vite and must be considered compromised for production use.
- Confirmed no `.env` files are tracked in git.

### Documented (not fixed — deferred to later phases)

- Gemini API calls run client-side (`src/services/`).
- Interview/attempt IDs stored in `localStorage`.
- No Firestore security rules file in repository.
- Firebase config hardcoded in `src/firebase.js`.
