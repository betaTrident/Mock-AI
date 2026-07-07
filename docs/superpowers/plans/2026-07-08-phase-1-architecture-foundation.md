# Phase 1 — Architecture Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Next.js App Router structure, move secrets server-side, preserve legacy Vite app in `/legacy`, stub API routes with auth.

**Architecture:** Scaffold Next.js 15+ with TypeScript in repo root; move Vite source to `legacy/`; implement Firebase Admin + Bearer token auth on API routes; middleware redirects unauthenticated users on protected pages.

**Tech Stack:** Next.js 15+, TypeScript, Tailwind, Firebase Admin SDK, Zod (types prep)

---

### Task 1: Preserve legacy Vite app

**Files:**
- Move: `src/`, `vite.config.js`, `index.html`, `public/`, `postcss.config.js`, `tailwind.config.js`, `eslint.config.js`, `package.json`, `package-lock.json` → `legacy/`

- [ ] Create `legacy/` directory
- [ ] Move Vite-era files into `legacy/`
- [ ] Keep `backend/`, `docs/`, `firebase.json`, `.firebaserc`, `.gitignore`, `.env.example`, `CHANGELOG.md`, `README.md` at root

### Task 2: Scaffold Next.js

- [ ] Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`
- [ ] Verify `package.json` shows `next` 15+

### Task 3: Canonical folder structure

- [ ] Create app routes: `(auth)/login`, `(auth)/register`, `(app)/dashboard`, `(app)/interview/new`, `[id]`, `[id]/feedback`, `(app)/profile`
- [ ] Create stub dirs: `agents/`, `features/`, `components/` subfolders, `lib/validations/`, `types/`, `data/question-bank/`
- [ ] Create stub `index.ts` exports for agents, features, components

### Task 4: Firebase Admin (`src/lib/firebase-admin.ts`)

- [ ] Implement per roadmap spec with `adminDb`, `adminAuth`
- [ ] Add `firebase-admin` dependency
- [ ] Create `src/lib/firebase-client.ts` stub (client SDK — Phase 2)

### Task 5: Auth (`src/lib/auth.ts`, `src/middleware.ts`)

- [ ] Implement `requireAuth`, `assertOwnership`, `UnauthorizedError`
- [ ] Implement middleware protecting `/dashboard`, `/interview`, `/profile`

### Task 6: API route stubs (9 routes)

- [ ] `GET/POST /api/interviews`
- [ ] `GET/DELETE /api/interviews/[id]`
- [ ] `POST /api/attempts`
- [ ] `GET /api/attempts/[id]`
- [ ] `POST /api/attempts/[id]/agent-step`
- [ ] `POST /api/attempts/[id]/complete`
- [ ] `GET /api/attempts/[id]/feedback`

### Task 7: Types & lib stubs

- [ ] `src/types/*.ts` — domain types from roadmap Domain Type System
- [ ] `src/lib/gemini.ts`, `role-taxonomy.ts`, `question-bank.ts` — stubs
- [ ] `src/lib/validations/*.ts` — minimal Zod stubs

### Task 8: Config & docs

- [ ] Update `.env.example` with Phase 1 variables
- [ ] Create `docs/ARCHITECTURE.md` with folder diagram
- [ ] Update `vercel.json` for Next.js (remove SPA rewrite)

### Task 9: Verification

- [ ] Run `npx tsc --noEmit` — zero errors
- [ ] Run `npm run build` — succeeds
