# MockAI Architecture

> Phase 1 foundation — Next.js App Router + Firebase Admin + API route stubs.

## Overview

MockAI is migrating from a Vite/React SPA to a **Next.js App Router** application with server-side AI orchestration, Firebase Admin SDK for ownership checks, and a multi-agent interview coaching pipeline (Phase 3+).

The legacy Vite application is preserved in `/legacy` for reference during migration.

## Folder Structure

```
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (app)/
      dashboard/page.tsx
      interview/
        new/page.tsx
        [id]/page.tsx
        [id]/feedback/page.tsx
      profile/page.tsx
    api/
      interviews/route.ts
      interviews/[id]/route.ts
      attempts/route.ts
      attempts/[id]/route.ts
      attempts/[id]/agent-step/route.ts
      attempts/[id]/complete/route.ts
      attempts/[id]/feedback/route.ts
    layout.tsx
    page.tsx
  components/
    ui/               # shadcn/ui (Phase 2)
    interview/        # Interview-domain components (Phase 2)
    dashboard/        # Dashboard-domain components (Phase 2)
    shared/           # Global shared components (Phase 2)
  features/
    interview/
    dashboard/
    auth/
  agents/             # Multi-agent system — server-only (Phase 3)
    orchestrator.ts
    planner.agent.ts
    question.agent.ts
    followup.agent.ts
    evaluator.agent.ts
    coach.agent.ts
    safety.guard.ts
  lib/
    firebase-admin.ts   # SERVER-ONLY
    firebase-client.ts  # Client SDK (Phase 2)
    gemini.ts           # Server Gemini client (Phase 3)
    auth.ts
    role-taxonomy.ts
    question-bank.ts
    validations/
      interview.ts
      attempt.ts
  types/
    interview.ts
    attempt.ts
    agent.ts
    user.ts
    dataset.ts
  data/
    question-bank/      # Preprocessed HR dataset JSON (Phase 3)
scripts/
  prepare-dataset.ts    # Dataset preprocessing (Phase 3)
legacy/                 # Original Vite/React SPA (reference only)
backend/                # Legacy Express services (reference, Phase 3+ migration)
```

## Request Flow (Phase 1)

```mermaid
flowchart LR
  Client[Browser] --> Middleware[middleware.ts]
  Middleware -->|no session cookie| Login[/login]
  Middleware -->|protected route| Pages[App Pages]
  Client -->|Bearer token| API[API Routes]
  API --> Auth[requireAuth]
  Auth --> Admin[Firebase Admin]
  Admin --> Firestore[(Firestore)]
```

## Security Model

| Layer | Mechanism |
|---|---|
| Page routes | `middleware.ts` checks `session` cookie; redirects to `/login` |
| API routes | `requireAuth()` verifies Firebase ID token from `Authorization: Bearer` header |
| Resource access | Ownership check: `resource.userId === user.uid`; return 404 on mismatch |
| Secrets | `FIREBASE_SERVICE_ACCOUNT_KEY`, `GEMINI_API_KEY` — server-only, never `NEXT_PUBLIC_` |

## Environment Variables

See `.env.example` for the full list. Server-only keys must live in `.env.local` (gitignored).

## Phase Status

| Phase | Status |
|---|---|
| 0 — Audit & Stabilize | Complete |
| 1 — Architecture Foundation | **Current** |
| 2 — shadcn/ui Design System | Pending |
| 3 — Multi-Agent Engine | Pending |
