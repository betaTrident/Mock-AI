# MockAI — Scaling Roadmap
> From a client-heavy Vite/React prototype to a production-grade, multi-agent, full-stack interview coaching platform.

---

## Overview

MockAI is currently a Vite + React SPA that calls Gemini directly from the browser, stores state in `localStorage`, and uses a mix of NextUI and custom components. The API key is exposed in the client bundle (`VITE_GEMINI_API_KEY`), there are no server-side ownership checks, and the agent "system" is a single flat prompt loop.

This roadmap transforms MockAI into a **Next.js App Router** application with:
- A **multi-agent orchestrator** (Planner → Question → Follow-up → Evaluator → Coach) running server-side
- **shadcn/ui** as the unified, reusable component system
- A **dark-mode, professional coaching studio** aesthetic (clean, dense, functional — not decorative)
- **Full voice + video simulation** (webcam + microphone + TTS + Speech-to-text)
- **Firebase Admin SDK** server-side, with strict Firestore rules and server-owned ownership checks
- **TypeScript** end-to-end for type safety and maintainability
- Deployment on **Vercel + Firebase**

---

## Confirmed Architecture Decisions

| Decision | Choice |
|---|---|
| Deployment | Vercel + Firebase (keep current infra) |
| Framework | Full Next.js App Router migration |
| Language | TypeScript throughout |
| Agent pattern | Orchestrator -> specialized sub-agents |
| AI Model | Gemini 2.5 Flash (all agents) |
| UI aesthetic | Dark mode default, coaching studio feel |
| Security | Firebase Admin SDK server-side, strict Firestore rules |
| Voice/Video | Full simulation (webcam + mic + TTS + STT) |
| Pace | 6 phased milestones — do it right once |
| Audience | Free personal/portfolio tool (no monetization for now) |

---

## Composer 2.5 Execution Protocol

> **READ THIS FIRST — before touching any code.**
> This section is mandatory operating procedure for Composer 2.5 executing this roadmap.

### What You Are

You are Composer 2.5 executing a phased engineering roadmap for the MockAI project. You are operating on a Next.js + Firebase + Gemini codebase. Your job is to implement each phase exactly as specified — not to improvise, invent new features, or go beyond the scope of the current phase.

### Anti-Hallucination Rules

1. **Read before writing.** Before editing any file, use the Read tool to see its current contents. Never assume what a file contains.
2. **One phase at a time.** Do not jump ahead to a later phase. Each phase has a defined deliverable list — finish that list, then stop.
3. **Check before creating.** Before creating any new file, use Glob to verify it does not already exist. If it exists, read it first.
4. **No invented APIs.** All library calls (Next.js, Firebase Admin, Gemini, shadcn, Zod, Upstash) must match the actual library API. Use the `context7-mcp` skill to fetch current docs if unsure.
5. **No invented file paths.** The folder structure in Phase 1.1 is the canonical reference. Do not create files outside it.
6. **Validate schema output.** Any agent output type defined in `src/types/` must be Zod-validated at the API boundary before use.
7. **Stop at gate checkpoints.** Each phase ends with a **Phase Gate**. Reach it, verify the deliverables, then stop and report.
8. **Do not rewrite working code.** If a file already implements something correctly, leave it alone. Only modify what is explicitly required by the current phase task.

### Context Budget Rules (Hard Limits)

| Rule | Limit |
|---|---|
| Max context per session | **150,000 tokens** |
| Max files open at once | **8 files** |
| Max file size to fully read | **500 lines** (read in slices beyond this) |
| Max single agent prompt length | **4,000 characters** |
| Max Zod schema in one file | **200 lines** (split if larger) |

**When approaching 120k tokens in a session:**
- Summarize completed work into a brief status note
- Close context on completed sub-tasks
- Start a fresh session for the next sub-task, referencing only required files

**If you feel uncertain about what a function does or what a file contains — STOP and read the file.** Never guess.

### Skill Loading Protocol

Every phase below lists **Required Skills**. Before starting that phase's work:

1. Use the Read tool to open each listed skill file
2. Follow any pre-task instructions in the skill
3. Do not proceed until all required skills are loaded

Skills live at the paths listed under each phase. They are short files — read them fully.

### Phase Execution Order

```
Phase 0 → gate check → Phase 1 → gate check → Phase 2 → gate check
  → Phase 3 → gate check → Phase 4 → gate check → Phase 5 → gate check
  → Phase 6 → gate check → DONE
```

**Never skip a gate check.** A gate check means: verify every deliverable in the phase's Deliverables section exists and works before moving on.

### How to Handle Blockers

If you hit a blocker (broken build, unexpected existing code, missing env var, type error you cannot resolve):
1. Document the blocker in `docs/BLOCKERS.md` (create if absent)
2. Stop work on the current sub-task
3. Report the blocker clearly: file, line, error message, what you tried
4. Do not attempt workarounds that bypass the type system or skip validation

---

## Current State Audit

### What Exists

```
src/
  pages/          # 18 page-level files, flat, no feature grouping
  components/     # TranscriptPanel.jsx + ui/ (minimal reuse)
  services/       # answerService, attemptService, feedback, liveConversation,
                  # questionGenerator, speechRecognition, textToSpeech
  firebase.js     # Client-side Firebase SDK (public config)
backend/
  auth/
  services/
```

### Critical Problems to Fix

| Problem | Severity | Fix |
|---|---|---|
| `VITE_GEMINI_API_KEY` exposed in browser bundle | CRITICAL | Move all AI calls to Next.js API routes/Server Actions |
| No server-side auth/ownership checks | CRITICAL | Firebase Admin SDK on every API route |
| Gemini called directly from client | CRITICAL | Server-only agent layer |
| `localStorage` as source of truth | HIGH | Route params + server-persisted attempt state |
| No input validation or prompt injection guards | HIGH | Zod schemas + prompt boundary enforcement |
| Mixed NextUI + custom CSS (no design system) | MEDIUM | Replace entirely with shadcn/ui |
| Flat page structure (no feature grouping) | MEDIUM | Next.js App Router file-system structure |
| No retry/fallback for AI failures | MEDIUM | Agent error boundaries + partial result handling |
| No rate limiting | MEDIUM | Vercel Edge middleware or Upstash rate limiter |
| TypeScript not used | MEDIUM | Full TypeScript migration |

---

## Phase 0 — Audit & Stabilization

**Goal:** Stop the bleeding. Document what exists, lock secrets, and set up a clean baseline before any migration begins.

**Context budget for this phase: ~20k tokens. Each sub-task below is a separate focused session.**

### Required Skills — Phase 0

Load these before starting Phase 0 work. Read each file fully with the Read tool.

| Skill | Purpose | Path |
|---|---|---|
| `writing-plans` | Structure the audit output before writing files | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\writing-plans\SKILL.md` |
| `context7-mcp` | Fetch current Firebase / Next.js docs if uncertain | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\context7-plugin\58a36cea87ea887e7bb4850409f1f9ea58dae5e5\skills\context7-mcp\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 0 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### 0.1 Security Lockdown

**Open only these files in this session:** `.env`, `.env.example`, `.gitignore`, `src/firebase.js`

- [ ] Rotate the exposed `VITE_GEMINI_API_KEY` (create a new key in Google AI Studio — do not do this in code, flag it to the developer)
- [ ] Audit `.env` — list every environment variable, mark each as `PUBLIC`, `SERVER_ONLY`, or `LEGACY`
- [ ] Review `.gitignore` — confirm no `.env*` files are committed; add entries if missing
- [ ] Review `src/firebase.js` — note which config values are public-safe (apiKey, projectId, appId) vs. never-client (service account key, admin credentials)
- [ ] Document current Firestore security rules verbatim in `docs/AUDIT.md`

### 0.2 Codebase Inventory

**Open only these folders in this session:** `src/pages/`, `src/services/`, `src/components/`

- [ ] List all Firestore collections referenced in `src/services/` — document the document shape for each
- [ ] Map all routes (`src/pages/`) and note which require auth and which are public
- [ ] Identify every direct Gemini SDK call in `src/services/` — file name, function name, line number
- [ ] Identify all `localStorage` reads/writes — key names and what data lives there
- [ ] Document current auth flow (Firebase Auth + Google Sign-In) in `docs/AUDIT.md`

### 0.3 Baseline Quality Checks

**One terminal command session — do not read source files here.**

- [ ] Run `npm run lint` — record all lint errors in `docs/AUDIT.md`; fix any that are trivially one-line fixes
- [ ] Run `npm run build` — record any build errors
- [ ] Document known UI bugs from the current codebase in `docs/AUDIT.md`
- [ ] Create `CHANGELOG.md` with a `## [0.0.1] — Audit Baseline` entry

### Phase 0 Gate Check

> Use the `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each exists and is complete:**
- [ ] `docs/AUDIT.md` — codebase inventory, secret audit, Firestore schema, lint errors, known issues
- [ ] `CHANGELOG.md` — created with baseline entry
- [ ] `.env.example` — all required variables documented, no real values
- [ ] All trivial lint errors resolved
- [ ] Zero secrets in `.gitignore`-ignored files committed to git

---

## Phase 1 — Architecture Foundation (Next.js Migration)

**Goal:** Establish the new project structure. Move secrets server-side. No user-facing features change yet.

**Context budget for this phase: ~40k tokens. Split into sub-task sessions by section (1.1, 1.2, 1.3, 1.4, 1.5).**

### Required Skills — Phase 1

Load these before starting Phase 1 work:

| Skill | Purpose | Path |
|---|---|---|
| `writing-plans` | Draft the migration plan before touching files | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\writing-plans\SKILL.md` |
| `executing-plans` | Execute the plan sub-task by sub-task | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\executing-plans\SKILL.md` |
| `nextjs` | Next.js App Router patterns, Server Components, API routes | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\nextjs\SKILL.md` |
| `context7-mcp` | Fetch current Firebase Admin SDK / Next.js 15 docs | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\context7-plugin\58a36cea87ea887e7bb4850409f1f9ea58dae5e5\skills\context7-mcp\SKILL.md` |
| `dispatching-parallel-agents` | Run file scaffold tasks in parallel where independent | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\dispatching-parallel-agents\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 1 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 1

> **Session 1.1 only:** Run `npx create-next-app@latest` — do not touch existing `src/` during this session. After scaffolding, move the legacy Vite source to `/legacy`. Then stop.
>
> **Session 1.2 onward:** Work only on the files listed per sub-task. Do not open the legacy folder unless explicitly reading something for reference.

### 1.1 Project Setup

```bash
# Run this from the repo root
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**After running — immediately move the old Vite source:**
```bash
mkdir legacy
# Move all Vite-era source into /legacy for reference
# Do NOT delete it — it is the reference during migration
```

**Canonical folder structure to create:**

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
    ui/               # shadcn/ui generated (Phase 2)
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
    firebase-admin.ts
    firebase-client.ts
    gemini.ts
    auth.ts
    role-taxonomy.ts        # Maps free-text roles to dataset buckets
    question-bank.ts        # Dataset loader utility (server-only)
    validations/
      interview.ts
      attempt.ts
  types/
    interview.ts
    attempt.ts
    agent.ts
    user.ts
    dataset.ts              # HrQuestion type from preprocessing
  data/
    question-bank/          # Generated by scripts/prepare-dataset.ts (committed)
      frontend-senior.json
      backend-mid.json
      # ... one file per role-difficulty bucket
scripts/
  prepare-dataset.ts        # One-time dataset preprocessing script
```

> **Composer 2.5 note:** Create stub files (empty exports) for everything in `agents/`, `features/`, and `components/` sub-folders. Do not implement content yet — stubs prevent import errors and establish the module graph. Only `lib/`, `types/`, and `app/api/` get real content in Phase 1.

### 1.2 Firebase Admin SDK Setup

**Session scope:** Create and verify `src/lib/firebase-admin.ts` only.

```typescript
// src/lib/firebase-admin.ts
// SERVER-ONLY — never import this in a Client Component or 'use client' file
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const app = getApps().length === 0
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)) })
  : getApps()[0]

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
```

**New environment variables — add to `.env.local` and `.env.example`:**

```env
# Server-only (never NEXT_PUBLIC_)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GEMINI_API_KEY=your_key_here

# Public Firebase config (safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> **Composer 2.5 note:** After writing `firebase-admin.ts`, run `npx tsc --noEmit` to verify no type errors before continuing.

### 1.3 Auth Middleware

**Session scope:** `src/middleware.ts` only.

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Firebase session cookie validation happens here
  // Redirect to /login if no session cookie present on protected routes
  const sessionCookie = request.cookies.get('session')?.value
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/interview') ||
    request.nextUrl.pathname.startsWith('/profile')

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/interview/:path*', '/profile/:path*']
}
```

### 1.4 Server-Side Auth Helper

**Session scope:** `src/lib/auth.ts` only.

```typescript
// src/lib/auth.ts
import { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

export class UnauthorizedError extends Error {
  constructor() { super('Unauthorized') }
}

export async function requireAuth(request: NextRequest): Promise<DecodedIdToken> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) throw new UnauthorizedError()
  try {
    return await adminAuth.verifyIdToken(token)
  } catch {
    throw new UnauthorizedError()
  }
}

// Ownership check — call after requireAuth
export function assertOwnership(resourceUserId: string, requestingUserId: string): void {
  if (resourceUserId !== requestingUserId) {
    throw new UnauthorizedError()
  }
}
```

### 1.5 API Routes — Core Endpoints

**Session scope:** All files under `src/app/api/`. Write stub implementations with auth + ownership pattern baked in.**

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/interviews` | List user's interviews | Required |
| `POST` | `/api/interviews` | Create new interview | Required |
| `GET` | `/api/interviews/[id]` | Get interview + questions | Required + Ownership |
| `DELETE` | `/api/interviews/[id]` | Delete interview | Required + Ownership |
| `POST` | `/api/attempts` | Start a new attempt | Required + Ownership |
| `GET` | `/api/attempts/[id]` | Get attempt state | Required + Ownership |
| `POST` | `/api/attempts/[id]/agent-step` | Advance agent state machine | Required + Ownership |
| `POST` | `/api/attempts/[id]/complete` | Finalize + generate feedback | Required + Ownership |
| `GET` | `/api/attempts/[id]/feedback` | Retrieve feedback report | Required + Ownership |

**Ownership check pattern — apply on every route that touches a resource:**

```typescript
// Pattern used in every data route handler
const interview = await adminDb.collection('interviews').doc(id).get()
if (!interview.exists || interview.data()!.userId !== user.uid) {
  // Return 404 — never 403; do not leak resource existence
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
```

**Stub route template:**

```typescript
// src/app/api/interviews/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    // TODO: query Firestore for user's interviews
    return NextResponse.json({ interviews: [] })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    // TODO: validate body with Zod + create interview document (Phase 4)
    return NextResponse.json({ id: 'stub' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

### Phase 1 Gate Check

> Use the `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each exists:**
- [ ] `npx create-next-app` scaffolded, `package.json` shows Next.js 15+
- [ ] Legacy Vite app preserved in `/legacy/`
- [ ] `src/lib/firebase-admin.ts` — exports `adminDb` and `adminAuth`, server-only
- [ ] `src/lib/auth.ts` — exports `requireAuth` and `assertOwnership`
- [ ] `src/middleware.ts` — protects dashboard, interview, profile routes
- [ ] All 9 API route stubs created with `requireAuth` called first
- [ ] `.env.example` updated with all required variables
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `docs/ARCHITECTURE.md` created with the folder structure diagram

---

## Phase 2 — shadcn/ui Design System

**Goal:** Replace all NextUI and custom CSS with a unified shadcn/ui component library. Establish the coaching studio visual language.

**Context budget for this phase: ~35k tokens. Split into three sessions: (2.1 install), (2.2–2.3 theme + components), (2.4 page layouts).**

### Required Skills — Phase 2

Load these before starting Phase 2 work:

| Skill | Purpose | Path |
|---|---|---|
| `shadcn` (Vercel plugin) | shadcn/ui CLI, component patterns, composition | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\shadcn\SKILL.md` |
| `shadcn` (shadcn plugin) | Installing and debugging shadcn components | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\shadcn\10f1717a3e2a3c16cfbd43877c1e44063d9d749a\skills\shadcn\SKILL.md` |
| `react-best-practices` | Validate TSX files after writing components | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\react-best-practices\SKILL.md` |
| `brainstorming` | Before designing new components not listed below | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\brainstorming\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 2 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 2

> Before writing any component, use the `shadcn` skills to check the correct CLI syntax for the current version. **Do not guess shadcn API** — it changes between versions.
>
> After writing any `.tsx` file, trigger the `react-best-practices` skill to validate it.
>
> Do NOT remove NextUI imports from existing pages until the replacement component is written and confirmed working. Remove old imports last.

### 2.1 Install and Configure shadcn/ui

**Session scope:** Run CLI, verify `components.json` created, verify `globals.css` updated.

```bash
npx shadcn@latest init
# Select: Dark theme, CSS variables, TypeScript, Tailwind
```

**Install all required components in one session:**

```bash
npx shadcn@latest add button card dialog form input label
npx shadcn@latest add select textarea badge progress tabs
npx shadcn@latest add sheet command toast sonner
npx shadcn@latest add avatar dropdown-menu separator
npx shadcn@latest add skeleton alert accordion scroll-area
npx shadcn@latest add chart
```

> **Composer 2.5 note:** After each `npx shadcn@latest add` block, run `npx tsc --noEmit` to catch any type issues introduced by the new components.

### 2.2 Design Tokens — Coaching Studio Theme

**Session scope:** `src/app/globals.css` only.

```css
/* src/app/globals.css */
@layer base {
  :root {
    /* Base — dark mode default */
    --background: 222 84% 4.9%;
    --foreground: 210 40% 98%;

    /* Surface levels */
    --card: 222 84% 7%;
    --card-foreground: 210 40% 98%;
    --popover: 222 84% 7%;
    --popover-foreground: 210 40% 98%;
    --muted: 217 32% 12%;
    --muted-foreground: 215 20% 55%;

    /* Brand accent — deep teal/cyan */
    --primary: 186 100% 42%;
    --primary-foreground: 222 84% 4.9%;

    /* Secondary — subtle violet */
    --secondary: 265 40% 18%;
    --secondary-foreground: 265 40% 85%;

    /* Functional */
    --accent: 217 32% 14%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 32% 16%;
    --input: 217 32% 14%;
    --ring: 186 100% 42%;
    --radius: 0.5rem;
  }
}
```

**Typography — `src/app/layout.tsx`:**

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### 2.3 Component Library — Custom Domain Components

> **Composer 2.5 note:** Build each component in a dedicated session. Maximum 3 components per session. After each component, run `react-best-practices` skill check.

**Session A — Shared layout components:**

| Component | File | Built With | Purpose |
|---|---|---|---|
| `<AppShell>` | `components/shared/AppShell.tsx` | Sheet, Separator | Main layout with collapsible sidebar |
| `<Sidebar>` | `components/shared/Sidebar.tsx` | Command, Avatar | Navigation + user context |
| `<UserMenu>` | `components/shared/UserMenu.tsx` | DropdownMenu, Avatar | User avatar + profile/signout |
| `<PageHeader>` | `components/shared/PageHeader.tsx` | Badge, Separator | Consistent page titles + breadcrumbs |
| `<EmptyState>` | `components/shared/EmptyState.tsx` | Card | Empty list/data states |
| `<ErrorBoundary>` | `components/shared/ErrorBoundary.tsx` | Alert | Graceful error surfaces |
| `<LoadingSkeleton>` | `components/shared/LoadingSkeleton.tsx` | Skeleton | Consistent loading placeholders |

**Session B — Interview domain components:**

| Component | File | Built With | Purpose |
|---|---|---|---|
| `<InterviewCard>` | `components/interview/InterviewCard.tsx` | Card, Badge, Progress | Dashboard interview card |
| `<InterviewSetupWizard>` | `components/interview/InterviewSetupWizard.tsx` | Tabs, Form, Select | Multi-step interview config |
| `<InterviewWorkspace>` | `components/interview/InterviewWorkspace.tsx` | Sheet, Tabs, Progress | Full live interview layout |
| `<VideoPanel>` | `components/interview/VideoPanel.tsx` | Custom | Webcam + AI avatar display |
| `<TranscriptPanel>` | `components/interview/TranscriptPanel.tsx` | ScrollArea, Badge | Live scrolling transcript |
| `<QuestionDisplay>` | `components/interview/QuestionDisplay.tsx` | Card, Badge | Current question + progress |
| `<RecordingControls>` | `components/interview/RecordingControls.tsx` | Button, Badge | Start/stop/pause mic |
| `<AgentStatusIndicator>` | `components/interview/AgentStatusIndicator.tsx` | Badge, Skeleton | Which agent is active |
| `<FeedbackReport>` | `components/interview/FeedbackReport.tsx` | Accordion, Chart, Badge | Full structured feedback |
| `<ScoreCard>` | `components/interview/ScoreCard.tsx` | Card, Progress, Badge | Per-question score summary |
| `<PracticePlanCard>` | `components/interview/PracticePlanCard.tsx` | Card, Accordion | Practice plan from Coach agent |

### 2.4 Page-by-Page Layouts

> **Composer 2.5 note:** Do each page in its own session. Only import components already built — do not import anything from Phase 3 agents. Use placeholder data (typed constants, not `any`) for data that will come from APIs.

#### Session C — Homepage `/`

- Hero: Full-viewport dark background, single strong headline, CTA button
- Features section: 3-column card grid with icon, title, one-line description
- No decorative AI imagery — functional, editorial
- Footer: "Built with Gemini 2.5 Flash" badge + GitHub link

#### Session D — Dashboard `/dashboard`

- `<AppShell>` wrapping `<Sidebar>` + main content area
- Header: `<UserMenu>` + search `Command` (`Ctrl+K`)
- Interview grid: `<InterviewCard>` in responsive CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Quick stats row: Total attempts, avg score, streak — compact `<Badge>` row
- Empty state: `<EmptyState>` with prompt to create first interview
- `+ New Interview` button → `<InterviewSetupWizard>` in `<Dialog>`

#### Session E — Interview Setup `/interview/new`

Multi-step `<Tabs>` wizard (no page navigation — lives in Dialog/Sheet):
1. **Role** — job title Input + description Textarea
2. **Level** — experience Select + difficulty Select
3. **Tech Stack** — tag-based Input (comma-separated, rendered as Badges)
4. **Review** — summary Card before confirming

All steps validated with Zod before advancing tab. Submit calls `POST /api/interviews`.

#### Session F — Live Interview `/interview/[id]`

Full-screen coaching workspace — three zones:
- **Left:** `<VideoPanel>` (webcam feed + AI avatar indicator)
- **Center:** `<QuestionDisplay>` + `<RecordingControls>` + Progress bar
- **Right (Sheet):** `<TranscriptPanel>` (collapsible via Sheet)
- **Bottom bar:** Timer + `<AgentStatusIndicator>` + End Interview button

#### Session G — Feedback `/interview/[id]/feedback`

`<FeedbackReport>` with:
- Overall score (large `Card`, prominent number)
- Per-question breakdown (`<Accordion>`)
- Strengths vs Areas for Improvement (two-column grid)
- `<PracticePlanCard>` from Coach agent output
- Export PDF button (Phase 5 placeholder — disabled, not hidden)

### Phase 2 Gate Check

> Use the `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each:**
- [ ] `npx shadcn@latest init` completed — `components.json` exists
- [ ] All listed shadcn/ui primitives installed in `src/components/ui/`
- [ ] Global CSS design tokens defined (dark coaching studio palette)
- [ ] All 7 shared components built and exported
- [ ] All 11 interview domain components built and exported
- [ ] All 5 main page layouts built using new components
- [ ] NextUI fully removed from `package.json` and all imports
- [ ] No custom `*.css` files other than `globals.css`
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` succeeds

---

## Phase 3 — Multi-Agent Interview Engine

**Goal:** Replace the single flat Gemini prompt loop with a server-side orchestrated multi-agent system.

**Context budget for this phase: ~50k tokens. This is the largest phase — split into one session per agent, then one session for state machine + API wiring.**

### Required Skills — Phase 3

Load these before starting Phase 3 work:

| Skill | Purpose | Path |
|---|---|---|
| `writing-plans` | Plan agent contracts before writing any agent code | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\writing-plans\SKILL.md` |
| `executing-plans` | Execute the agent implementation plan sub-task by sub-task | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\executing-plans\SKILL.md` |
| `subagent-driven-development` | Implement each agent in a bounded isolated session | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\subagent-driven-development\SKILL.md` |
| `test-driven-development` | Write Zod schemas and type tests before agent logic | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\test-driven-development\SKILL.md` |
| `context7-mcp` | Fetch current Gemini SDK / Google AI docs | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\context7-plugin\58a36cea87ea887e7bb4850409f1f9ea58dae5e5\skills\context7-mcp\SKILL.md` |
| `systematic-debugging` | Debug any agent output or Gemini API error | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\systematic-debugging\SKILL.md` |
| `ai-sdk` | AI SDK patterns for structured output, streaming, tool calls | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\ai-sdk\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 3 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 3

> **Start every agent session by writing its Zod input and output schemas first** (`test-driven-development` skill). Do not write the agent's Gemini call until the types are defined and `tsc --noEmit` passes.
>
> **Each agent is implemented in its own session.** Do not implement two agents in the same session. The context budget per agent session is ~10k tokens.
>
> **Use `context7-mcp`** to fetch the current Gemini SDK docs before writing any `generateContent` or `generateObject` call. The Gemini SDK API changes — do not rely on training data alone.
>
> **Agent prompts are plain strings.** Keep each system prompt under 1,500 characters. Long prompts drift and hallucinate. Test each agent with a real API call before wiring to the state machine.

### 3.1 Agent Architecture

```
                    +---------------------------+
                    |   Interview Orchestrator  |
                    |   (State Machine)         |
                    +-------------+-------------+
          +---------+-------------+-------------+---------+
          v                       v                       v
   +--------------+    +------------------+    +---------------------+
   | Planner      |    | Question Agent   |    | Follow-up Agent     |
   | Agent        |    | (structured Q    |    | (adaptive,          |
   | (strategy +  |    |  generation)     |    |  context-aware)     |
   |  rubric)     |    +--------+---------+    +-----------+---------+
   +--------------+             |                          |
                                +-------------+------------+
                                              v
                                   +---------------------+
                                   | Evaluator Agent     |
                                   | (rubric scoring,    |
                                   |  per-question)      |
                                   +----------+----------+
                                              v
                                   +---------------------+
                                   | Coach Agent         |
                                   | (personalized plan, |
                                   |  weak areas, steps) |
                                   +----------+----------+
                                              v
                                   +---------------------+
                                   | Safety/Policy Guard |
                                   | (I/O filtering,     |
                                   |  injection detect)  |
                                   +---------------------+
```

### 3.2 Interview State Machine

**Session scope:** `src/types/attempt.ts` only — write types first, no implementation.

```typescript
// src/types/attempt.ts
export type AttemptStatus =
  | 'PENDING'       // Created, not started
  | 'PLANNING'      // Planner agent running
  | 'READY'         // Questions generated, ready to start
  | 'IN_PROGRESS'   // Active interview session
  | 'EVALUATING'    // Evaluator agent running post-interview
  | 'COACHING'      // Coach agent generating practice plan
  | 'COMPLETE'      // All agents done, feedback available
  | 'FAILED'        // Agent error — recoverable

export interface AttemptState {
  id: string
  interviewId: string
  userId: string
  status: AttemptStatus
  currentQuestionIndex: number
  questions: Question[]
  transcriptEvents: TranscriptEvent[]
  agentRuns: AgentRun[]
  evaluation: EvaluationResult | null
  feedbackReport: FeedbackReport | null
  practicePlan: PracticePlan | null
  startedAt: Timestamp
  completedAt: Timestamp | null
  metadata: Record<string, unknown>
}
```

### 3.3 Dataset Integration — HR Interview Dataset

**Source:** [Ankshi/hr-interview-dataset](https://huggingface.co/datasets/Ankshi/hr-interview-dataset) on Hugging Face  
**Size:** 1M–10M rows (Parquet format)  
**License:** Open — contributed by the HF Datasets community

**Dataset schema:**

| Field | Type | Description |
|---|---|---|
| `question` | string | The interview question |
| `category` | string | Question category (technical, behavioral, etc.) |
| `role` | string | Target job role |
| `experience` | string | Experience level required |
| `difficulty` | string | junior / mid / senior |
| `source_type` | string | Source of the question |
| `ideal_answer` | string | Model answer for the question |
| `keywords` | string[] | Key terms expected in a good answer |

**Usage pattern in MockAI:** Filter by `role` + `difficulty`, sample 3–5 rows, inject as **few-shot grounding examples** in the Question Agent's system prompt. The `ideal_answer` and `keywords` serve as implicit rubric grounding — Gemini uses them to calibrate what a good question (and answer) looks like for this role tier.

---

#### 3.3.1 Dataset Preprocessing Pipeline

**Session scope:** `scripts/prepare-dataset.ts` — a one-time build-time script. Does not run at interview time.

**Purpose:** Download the Parquet file, filter to the most useful rows, normalize roles to a taxonomy, and output per-role/difficulty JSON files that ship with the app.

**Script flow:**

```typescript
// scripts/prepare-dataset.ts
// Run once: npx ts-node scripts/prepare-dataset.ts
// Output: src/data/question-bank/{role-tier}.json

import { readParquet } from 'parquet-wasm' // or @dsnp/parquetjs
import { writeFileSync, mkdirSync } from 'fs'
import { ROLE_TAXONOMY } from '../src/lib/role-taxonomy'

const HF_PARQUET_URL =
  'https://huggingface.co/datasets/Ankshi/hr-interview-dataset/resolve/refs%2Fconvert%2Fparquet/default/train/0000.parquet'

async function main() {
  const buffer = await fetch(HF_PARQUET_URL).then(r => r.arrayBuffer())
  const rows = await readParquet(buffer) // returns array of row objects

  const buckets: Record<string, HrQuestion[]> = {}

  for (const row of rows) {
    const normalizedRole = normalizeRole(row.role, ROLE_TAXONOMY)
    if (!normalizedRole) continue // skip unmappable roles
    const key = `${normalizedRole}-${row.difficulty.toLowerCase()}`
    if (!buckets[key]) buckets[key] = []
    if (buckets[key].length < 200) { // cap per bucket
      buckets[key].push({
        question: row.question,
        category: row.category,
        idealAnswer: row.ideal_answer,
        keywords: row.keywords ?? [],
        difficulty: row.difficulty,
        role: normalizedRole,
      })
    }
  }

  mkdirSync('src/data/question-bank', { recursive: true })
  for (const [key, questions] of Object.entries(buckets)) {
    writeFileSync(
      `src/data/question-bank/${key}.json`,
      JSON.stringify(questions, null, 2)
    )
  }
  console.log(`Generated ${Object.keys(buckets).length} question bank files`)
}

main()
```

**Add to `package.json` scripts:**

```json
{
  "scripts": {
    "prepare:dataset": "ts-node scripts/prepare-dataset.ts"
  }
}
```

**Output file naming:** `src/data/question-bank/{role-tier}-{difficulty}.json`  
Example: `frontend-senior.json`, `backend-mid.json`, `data-science-junior.json`

**Add to `.gitignore`:**  
The raw Parquet download is temporary — only the output JSON files are committed.

---

#### 3.3.2 Role Taxonomy

**File:** `src/lib/role-taxonomy.ts`

Maps free-text user-entered roles to a normalized set of role buckets that match the dataset's `role` field distribution.

```typescript
// src/lib/role-taxonomy.ts
export const ROLE_TAXONOMY: Record<string, string[]> = {
  'frontend': [
    'frontend', 'front-end', 'react', 'vue', 'angular', 'ui developer',
    'web developer', 'javascript developer', 'next.js'
  ],
  'backend': [
    'backend', 'back-end', 'node', 'python developer', 'java developer',
    'golang', 'django', 'express', 'api developer', 'server-side'
  ],
  'fullstack': [
    'fullstack', 'full stack', 'full-stack', 'software engineer',
    'swe', 'software developer', 'web engineer'
  ],
  'data-science': [
    'data scientist', 'machine learning', 'ml engineer', 'ai engineer',
    'data analyst', 'nlp engineer', 'deep learning'
  ],
  'devops': [
    'devops', 'sre', 'platform engineer', 'cloud engineer', 'infrastructure',
    'kubernetes', 'docker', 'ci/cd', 'aws engineer'
  ],
  'product': [
    'product manager', 'pm', 'product owner', 'po', 'product lead'
  ],
  'design': [
    'designer', 'ux', 'ui/ux', 'product designer', 'ux researcher'
  ],
  'general': [] // catch-all — used when no specific match found
}

export function normalizeRole(input: string, taxonomy: typeof ROLE_TAXONOMY): string {
  const lower = input.toLowerCase().trim()
  for (const [bucket, keywords] of Object.entries(taxonomy)) {
    if (bucket === 'general') continue
    if (keywords.some(kw => lower.includes(kw))) return bucket
  }
  return 'general'
}
```

---

#### 3.3.3 Dataset Loader Utility

**File:** `src/lib/question-bank.ts` (server-only — loaded at request time, not client)

```typescript
// src/lib/question-bank.ts
// SERVER-ONLY — never import in 'use client' components
import type { HrQuestion } from '@/types/dataset'
import { normalizeRole, ROLE_TAXONOMY } from './role-taxonomy'

export interface HrQuestion {
  question: string
  category: string
  idealAnswer: string
  keywords: string[]
  difficulty: string
  role: string
}

export function sampleFewShotExamples(
  role: string,
  difficulty: string,
  count = 4
): HrQuestion[] {
  const normalizedRole = normalizeRole(role, ROLE_TAXONOMY)
  const key = `${normalizedRole}-${difficulty.toLowerCase()}`

  try {
    // Dynamic require at runtime — these are static JSON files bundled with the app
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bank: HrQuestion[] = require(`@/data/question-bank/${key}.json`)
    // Shuffle and sample
    const shuffled = bank.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  } catch {
    // Fallback: return empty array — Question Agent will generate without examples
    return []
  }
}
```

---

### 3.4 Individual Agent Specs

> **Composer 2.5 note:** Implement each agent in the order listed. Each is a separate session. Start every session by reading the agent's type definitions from `src/types/` before writing any code.

#### Session — Planner Agent (`src/agents/planner.agent.ts`)

- **Triggers:** When a new attempt is created
- **Input type:** `{ role: string; description: string; experience: number; difficulty: string; techStack: string[] }`
- **Output type:** `{ strategy: string; topics: string[]; rubric: RubricItem[]; questionCount: number }`
- **System prompt target:** ≤1,200 characters — focused on role-specific question planning and fair rubric design
- **Gemini call:** `generateObject` with structured output schema — never `generateText` for structured data

#### Session — Question Agent (`src/agents/question.agent.ts`)

- **Triggers:** After Planner agent completes
- **Input type:** `PlannerOutput & { fewShotExamples: HrQuestion[] }` — examples fetched from dataset at call site
- **Output type:** `Question[]` (defined in `src/types/interview.ts`)
- **System prompt target:** ≤1,000 characters — diversity of question types, difficulty calibration
- **Validation:** Every output `Question` must pass the `QuestionSchema` Zod validator before storing

**Dataset injection — how few-shot examples are wired into the Question Agent:**

```typescript
// src/app/api/attempts/[id]/agent-step/route.ts
// (called when status transitions PLANNING -> READY)
import { sampleFewShotExamples } from '@/lib/question-bank'
import { runPlannerAgent } from '@/agents/planner.agent'
import { runQuestionAgent } from '@/agents/question.agent'

// 1. Run planner to get strategy + rubric
const plannerOutput = await runPlannerAgent(plannerInput)

// 2. Sample relevant examples from the HR dataset
const fewShotExamples = sampleFewShotExamples(
  interview.role,
  interview.difficulty,
  4 // 3–5 examples
)

// 3. Inject examples into Question Agent
const questions = await runQuestionAgent({
  ...plannerOutput,
  fewShotExamples
})
```

**Question Agent system prompt with few-shot injection (template):**

```typescript
// src/agents/question.agent.ts — buildPrompt function
export function buildQuestionAgentPrompt(
  plannerOutput: PlannerOutput,
  fewShot: HrQuestion[]
): string {
  const examplesBlock = fewShot.length > 0
    ? `\n\nHere are real-world examples of strong ${plannerOutput.role} interview questions at this difficulty level:\n` +
      fewShot.map((ex, i) =>
        `${i + 1}. "${ex.question}" (category: ${ex.category}, key terms: ${ex.keywords.slice(0, 3).join(', ')})`
      ).join('\n') +
      '\n\nUse these as stylistic reference. Generate NEW, DISTINCT questions — do not copy or paraphrase them directly.'
    : ''

  return `Generate ${plannerOutput.questionCount} interview questions for a ${plannerOutput.role} role.
Strategy: ${plannerOutput.strategy}
Topics to cover: ${plannerOutput.topics.join(', ')}
${examplesBlock}
Output a JSON array of Question objects matching the provided schema.`
}
```

**Why this works:**
- The dataset provides **grounding** — Gemini sees what real, high-quality interview questions look like for a specific role/difficulty tier
- Gemini still **generates** — so questions are fresh, varied, and adapted to the user's specific job description and tech stack
- The few-shot examples act as a **style calibrator**, preventing generic or off-target questions
- If the dataset has no matching bucket for the role, `sampleFewShotExamples` returns `[]` and the agent runs without examples (graceful fallback)

#### Session — Follow-up Agent (`src/agents/followup.agent.ts`)

- **Triggers:** After each candidate response during live interview
- **Input type:** `{ currentQuestion: Question; answerTranscript: string; conversationHistory: TranscriptEvent[] }`
- **Output type:**
```typescript
export type FollowUpDecision =
  | { type: 'FOLLOW_UP'; question: string; reason: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'CLOSE_INTERVIEW' }
```
- **System prompt target:** ≤800 characters — active listening, probe incomplete answers, recognize when to move on
- **Context window guard:** Pass only the last 3 conversation turns, not the full transcript

#### Session — Evaluator Agent (`src/agents/evaluator.agent.ts`)

- **Triggers:** After all interview questions are answered
- **Input type:** `{ transcript: TranscriptEvent[]; questions: Question[]; rubric: RubricItem[] }`
- **Output type:** `EvaluationResult` (defined in `src/types/interview.ts`)
- **System prompt target:** ≤1,200 characters — rubric-based scoring, evidence from transcript only
- **Context window guard:** Summarize transcript to key answer excerpts — do not pass full raw transcript (can exceed token limits)

#### Session — Coach Agent (`src/agents/coach.agent.ts`)

- **Triggers:** After Evaluator agent completes
- **Input type:** `{ evaluation: EvaluationResult; role: string; weakAreas: string[] }`
- **Output type:** `PracticePlan` (defined in `src/types/interview.ts`)
- **System prompt target:** ≤1,000 characters — constructive, specific, actionable
- **No generic advice:** System prompt must include: "Give specific, role-targeted recommendations. Never give generic study advice."

#### Session — Safety/Policy Guard (`src/agents/safety.guard.ts`)

- **Applied:** On ALL user inputs before sending to any agent
- **No Gemini call** — pure string pattern matching
- **Return type:** `{ safe: boolean; reason?: string }`

```typescript
// src/agents/safety.guard.ts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<\|.*?\|>/,
]

export async function guardInput(text: string): Promise<{ safe: boolean; reason?: string }> {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'PROMPT_INJECTION' }
    }
  }
  if (text.length > 5000) {
    return { safe: false, reason: 'INPUT_TOO_LONG' }
  }
  return { safe: true }
}
```

### 3.4 Agent State Persistence

**Session scope:** `src/agents/orchestrator.ts` + Firestore write helpers.

Every agent run stored in Firestore `/agentRuns/{runId}`:

```typescript
interface AgentRun {
  id: string
  attemptId: string
  userId: string
  agentName: 'planner' | 'question' | 'followup' | 'evaluator' | 'coach' | 'guard'
  status: 'RUNNING' | 'COMPLETE' | 'FAILED'
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  error: string | null
  durationMs: number
  startedAt: Timestamp
  completedAt: Timestamp | null
  modelUsed: string
  tokenCount: number | null
}
```

### 3.5 Retry and Fallback Strategy

**Session scope:** `src/lib/agent-runner.ts`.

```typescript
// src/lib/agent-runner.ts
export async function runAgentWithRetry<T>(
  fn: () => Promise<T>,
  options = { maxAttempts: 3, backoffMs: 1000 }
): Promise<T> {
  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === options.maxAttempts - 1) {
        throw new AgentError(String(error), { attempt })
      }
      await new Promise(resolve => setTimeout(resolve, options.backoffMs * Math.pow(2, attempt)))
    }
  }
  throw new AgentError('Max attempts reached', {})
}
```

### 3.6 Voice + Video Integration

**Session scope:** `src/features/interview/` — browser-only service files.

```
Candidate (browser)                    Server
-------------------                    ------
MediaRecorder (webcam + mic)
    |
    +-- Video stream: displayed locally (no upload in v1)
    |
    +-- Audio stream: Web Speech API (STT)
            |
            +-- transcript text --> POST /api/attempts/[id]/agent-step
                                          |
                                  Follow-up Agent processes
                                          |
                                  Response text returned
                                          |
                              SpeechSynthesis (TTS v1) plays
                              AI interviewer voice response
```

**Implementation constraints:**
- `MediaRecorder` API for webcam capture (display only — no server upload in v1)
- `SpeechRecognition` Web Speech API for STT — no third-party dependency
- `SpeechSynthesis` API for TTS v1 — Google Cloud TTS is available as v2 upgrade
- AI "interviewer" displayed as animated `<AgentStatusIndicator>`, not a video avatar
- Mute/unmute and camera on/off via keyboard shortcuts (`M` = mute, `C` = camera)

> **Composer 2.5 note:** `MediaRecorder`, `SpeechRecognition`, and `SpeechSynthesis` are browser-only APIs. They must only be called inside `useEffect` hooks or event handlers — never at module top level. Add `'use client'` to any file that uses them.

### Phase 3 Gate Check

> Use the `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each:**
- [ ] Dataset preprocessing script (`scripts/prepare-dataset.ts`) runs successfully — JSON files in `src/data/question-bank/`
- [ ] At least 5 role-difficulty buckets populated (e.g., `frontend-senior.json`, `backend-mid.json`, etc.)
- [ ] `src/lib/role-taxonomy.ts` — 7 role buckets + `normalizeRole()` function
- [ ] `src/lib/question-bank.ts` — `sampleFewShotExamples()` returns 3–5 rows for known roles, `[]` for unknown
- [ ] All 6 agents implemented with typed inputs/outputs and Zod output validation
- [ ] Question Agent receives `fewShotExamples` from `sampleFewShotExamples()` at call site — verified in logs
- [ ] Each agent system prompt is ≤1,500 characters (enforce this)
- [ ] Safety guard runs before every user input reaches any agent
- [ ] Agent runs persisted to Firestore `/agentRuns/`
- [ ] Interview state machine functional via `POST /api/attempts/[id]/agent-step`
- [ ] Retry + exponential backoff logic in `src/lib/agent-runner.ts`
- [ ] Voice/video integration connected in `<InterviewWorkspace>`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] `docs/AGENTS.md` created — each agent's system prompt, inputs, outputs, and failure modes documented


---

## Phase 4 — Security Hardening

**Goal:** Make the app production-safe. Every attack surface addressed.

**Context budget for this phase: ~20k tokens. Can complete in 2–3 focused sessions.**

### Required Skills — Phase 4

Load these before starting Phase 4 work:

| Skill | Purpose | Path |
|---|---|---|
| `context7-mcp` | Fetch current Zod / Upstash docs if API is uncertain | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\context7-plugin\58a36cea87ea887e7bb4850409f1f9ea58dae5e5\skills\context7-mcp\SKILL.md` |
| `routing-middleware` | Vercel Edge middleware for rate limiting | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\routing-middleware\SKILL.md` |
| `review-security` | Security review of all API routes and Firestore rules | `C:\Users\Dennis\.cursor\skills-cursor\review-security\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 4 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 4

> This phase is **security-focused**. The rule is: validate everything, trust nothing from the client.
>
> After completing each section, trigger the `review-security` skill on the files you just modified. Fix every finding before moving to the next section.
>
> Do not create new features in this phase. This is hardening only.

### 4.1 API Key Security Audit

**Session scope:** `.env.local`, `.env.example`, `vercel.json` (if exists)

- [ ] Confirm `GEMINI_API_KEY` is server-only — never `NEXT_PUBLIC_`
- [ ] Confirm `FIREBASE_SERVICE_ACCOUNT_KEY` is server-only — stored as Vercel secret
- [ ] Verify zero `VITE_` prefixed secrets remain in any `.env` file
- [ ] Rotate all keys post-migration (flag this to the developer — cannot be done in code)

### 4.2 Input Validation — Zod Schemas

**Session scope:** `src/lib/validations/interview.ts` and `src/lib/validations/attempt.ts`

```typescript
// src/lib/validations/interview.ts
import { z } from 'zod'

export const CreateInterviewSchema = z.object({
  role: z.string().min(2).max(100).trim(),
  description: z.string().min(10).max(2000).trim(),
  experience: z.number().int().min(0).max(40),
  difficulty: z.enum(['junior', 'mid', 'senior', 'staff']),
  techStack: z.array(z.string().max(50)).min(1).max(20)
})

export const TranscriptEventSchema = z.object({
  attemptId: z.string().uuid(),
  role: z.enum(['candidate', 'interviewer']),
  content: z.string().min(1).max(5000).trim(),
  questionIndex: z.number().int().min(0)
})

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>
export type TranscriptEventInput = z.infer<typeof TranscriptEventSchema>
```

**Wire validation into every API route before any Firestore or agent call:**

```typescript
// Pattern — apply in every POST/PUT route handler
const body = await request.json()
const parsed = CreateInterviewSchema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
}
// Now use parsed.data — fully typed and safe
```

### 4.3 Firestore Security Rules

**Session scope:** `firestore.rules` only.

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // All write paths go through Firebase Admin SDK — deny client writes
    match /interviews/{interviewId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    match /attempts/{attemptId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    match /agentRuns/{runId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    // Audit logs — no client access at all
    match /auditLogs/{eventId} {
      allow read, write: if false;
    }

    // Deny everything else explicitly
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> **Composer 2.5 note:** After updating `firestore.rules`, run `firebase deploy --only firestore:rules` to deploy and confirm in the Firebase console that the rules are active.

### 4.4 Rate Limiting

**Session scope:** `src/middleware.ts` — extend existing middleware.

```typescript
// src/middleware.ts — add rate limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 req/min per IP
  analytics: true,
})

// Add to existing middleware function:
const { success, limit, remaining } = await ratelimit.limit(
  request.ip ?? 'anonymous'
)
if (!success) {
  return new Response('Rate limited', {
    status: 429,
    headers: { 'X-RateLimit-Limit': String(limit), 'X-RateLimit-Remaining': String(remaining) }
  })
}
```

**Add to `.env.example`:**
```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### 4.5 Prompt Injection Protection

**Session scope:** `src/agents/safety.guard.ts` — already scaffolded in Phase 3. Verify and extend.

```typescript
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<\|.*?\|>/,
  /act\s+as\s+(a\s+)?(?:different|new|another)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
]
// Violations return HTTP 400 — not 422, to avoid leaking guard logic
```

### 4.6 Audit Logging

**Session scope:** `src/lib/audit.ts` (new file) + wire into API routes.

```typescript
// src/lib/audit.ts
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

type AuditAction = 'create_interview' | 'start_attempt' | 'agent_step' | 'complete_attempt'

export async function writeAuditLog(event: {
  userId: string
  action: AuditAction
  resourceId: string
  ip: string
  userAgent: string
  success: boolean
  errorCode?: string
}): Promise<void> {
  await adminDb.collection('auditLogs').add({
    ...event,
    timestamp: FieldValue.serverTimestamp()
  })
}
```

### 4.7 Auth Session Hardening

**Session scope:** `src/app/(auth)/login/page.tsx` + server-side session cookie setup.

- Firebase session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`)
- Session cookie set via `POST /api/auth/session` route after client-side Firebase login
- Token refresh handled server-side via middleware
- Sign-out invalidates session cookie server-side

### Phase 4 Gate Check

> Trigger the `review-security` skill on all modified files. Fix every finding before marking passed.

**Deliverables — verify each:**
- [ ] All API routes validate input with Zod `safeParse` before any Firestore/agent call
- [ ] `firestore.rules` deployed — client writes denied on all collections except `/users/`
- [ ] Rate limiting deployed — verified with a burst test (21 requests returns 429)
- [ ] Safety guard blocks all patterns in the injection list — verify with unit test
- [ ] Audit log entries written for every API action — verify in Firestore console
- [ ] Session cookie auth implemented — no client-side token passing in API headers
- [ ] Zero `NEXT_PUBLIC_` secrets in `.env.local`
- [ ] `docs/SECURITY.md` created — all threat surfaces and mitigations documented

---

## Phase 5 — UX Polish & Analytics

**Goal:** Make the app feel alive, trustworthy, and data-rich. Add progress tracking.

**Context budget for this phase: ~25k tokens. Split by section — animations, analytics, recovery, PDF.**

### Required Skills — Phase 5

Load these before starting Phase 5 work:

| Skill | Purpose | Path |
|---|---|---|
| `brainstorming` | Before designing any new UX interaction not listed below | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\brainstorming\SKILL.md` |
| `react-best-practices` | Validate all new TSX components after writing | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\react-best-practices\SKILL.md` |
| `nextjs` | Server Components for analytics data fetching | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\nextjs\SKILL.md` |
| `context7-mcp` | Fetch current Framer Motion API docs before writing animations | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\context7-plugin\58a36cea87ea887e7bb4850409f1f9ea58dae5e5\skills\context7-mcp\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 5 done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 5

> **Use `context7-mcp`** before writing any Framer Motion animation — the API for `AnimatePresence`, `motion`, and layout animations changes between versions.
>
> **Animations must be subtle.** Duration ≤300ms. Do not add animations that fire on every render. Use `AnimatePresence` only for mount/unmount transitions.
>
> **Analytics data must be server-fetched.** Use async Server Components for all chart data — do not fetch analytics from the client.

### 5.1 Micro-Interactions & Animations

**Session scope:** Animation additions to existing components. Do not create new component files.

Using **Framer Motion** integrated with existing shadcn primitives:

| Interaction | Component | Animation |
|---|---|---|
| Page transitions | `app/(app)/layout.tsx` | Subtle fade + `translateY(4px)` on route change |
| Interview card hover | `<InterviewCard>` | `scale(1.02)` + box-shadow lift |
| Agent status | `<AgentStatusIndicator>` | Pulsing dot (`animate={{ opacity: [1, 0.3, 1] }}`) |
| Score reveal | Feedback page | Count-up number animation on mount |
| Recording active | `<RecordingControls>` | Radial pulse animation (`scale: [1, 1.4, 1]`) |
| Transcript entries | `<TranscriptPanel>` | Slide-in from right (`x: 20 → 0`) |

### 5.2 Keyboard Navigation & Accessibility

**Session scope:** `src/app/(app)/interview/[id]/page.tsx` + all interactive components.

- Full keyboard navigation in interview workspace
- `Ctrl+K` command palette for dashboard quick actions (already using `<Command>`)
- ARIA `role`, `aria-label`, `aria-live` on all interactive elements and agent status changes
- Focus traps in all `<Dialog>` and `<Sheet>` components (shadcn handles this — verify it's not broken)
- Screen reader `aria-live="polite"` for agent state changes

### 5.3 Responsive Layout Verification

**Session scope:** Responsive audit of all 5 main pages.

| Breakpoint | Layout |
|---|---|
| Mobile (<768px) | Single-column, bottom `<Sheet>` for transcript |
| Tablet (768–1024px) | Two-column, side-by-side panels |
| Desktop (>1024px) | Full three-panel coaching workspace |

Check every page at all three breakpoints. Fix any overflow, text clipping, or broken grid.

### 5.4 Progress Analytics Dashboard

**Session scope:** New `components/dashboard/ProgressSection.tsx` + Firestore aggregate queries.

New section in `/dashboard` — **Your Progress**:

| Metric | Display | Data Source |
|---|---|---|
| Total interviews | Counter badge | Firestore collection count |
| Average score | Donut chart (`<Chart>`) | Attempt evaluations |
| Score trend | Line chart (`<Chart>`) | Per-attempt scores over time |
| Strongest skill | Badge highlight | Evaluator agent output aggregated |
| Weakest skill | Badge highlight | Evaluator agent output aggregated |
| Practice streak | Heatmap calendar | Attempt timestamps |
| Completion rate | Progress bar | Completed / started attempts |

> **Composer 2.5 note:** All analytics queries are async Server Components. Firestore does not have native aggregate queries on free tier — compute aggregates client-side from the fetched attempt array. Do not add a separate analytics service.

### 5.5 Interview Interruption Recovery

**Session scope:** `src/features/interview/recovery.ts` + dashboard banner component.

- Attempt state already persisted server-side (Phase 3) — resume is just loading from `/api/attempts/[id]`
- `GET /dashboard` fetches any `IN_PROGRESS` attempt for the user
- If found: show `<Alert>` banner "Resume your interview" with link to `/interview/[id]`
- Auto-save transcript events every 10 seconds during live interview via `setInterval`

### 5.6 Feedback Report Enhancements

**Session scope:** `src/components/interview/FeedbackReport.tsx` extensions.

- **Export to PDF** — `@react-pdf/renderer` server-side PDF generation via a new `GET /api/attempts/[id]/feedback/pdf` route
- **Share link** — generate a `publicSlug` (nanoid) on demand; public read-only URL at `/feedback/[slug]`
- **Comparison view** — overlay two `EvaluationResult` objects in a two-column layout (Phase 5 bonus — implement only if PDF export is done and time allows)

### Phase 5 Gate Check

> Use the `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each:**
- [ ] All 6 Framer Motion animations implemented and visible in dev
- [ ] ARIA labels and `aria-live` on all interactive elements
- [ ] Full responsive layout verified at mobile/tablet/desktop
- [ ] Progress analytics section rendering in dashboard with real Firestore data
- [ ] Interruption recovery banner shown when `IN_PROGRESS` attempt exists
- [ ] PDF export working — downloads a valid PDF from `GET /api/attempts/[id]/feedback/pdf`
- [ ] Share link generates and renders public feedback page
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices on all key pages

---

## Phase 6 — Observability & Production Readiness

**Goal:** Ensure the app is observable, debuggable, and reliable in production.

**Context budget for this phase: ~20k tokens. Two sessions: (6.1–6.3 observability), (6.4–6.5 testing + CI).**

### Required Skills — Phase 6

Load these before starting Phase 6 work:

| Skill | Purpose | Path |
|---|---|---|
| `deployments-cicd` | Vercel deploy, CI/CD pipeline, preview URLs | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\deployments-cicd\SKILL.md` |
| `test-driven-development` | Write tests before fixing any test-revealed bugs | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\test-driven-development\SKILL.md` |
| `verification` | Full-story verification of the complete app before production | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\vercel\3d9d9cd0fe5d1bdaedb891135a5c45f19190b83f\skills\verification\SKILL.md` |
| `finishing-a-development-branch` | Wrap up all branches and prepare for merge to main | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\finishing-a-development-branch\SKILL.md` |
| `requesting-code-review` | Request final code review after all tests pass | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\requesting-code-review\SKILL.md` |
| `verification-before-completion` | Gate check before declaring Phase 6 (and roadmap) done | `C:\Users\Dennis\.cursor\plugins\cache\cursor-public\superpowers\b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37\skills\verification-before-completion\SKILL.md` |

### Composer 2.5 Instruction — Phase 6

> Before writing any test, use the `test-driven-development` skill. Write the test stub, confirm it fails, then write the implementation to make it pass.
>
> Before declaring the roadmap complete, use the `verification` skill to do a full-story walkthrough: signup → create interview → complete interview → view feedback.
>
> Before merging to main, use the `finishing-a-development-branch` skill and the `requesting-code-review` skill.

### 6.1 Error Tracking

**Session scope:** Sentry integration in `src/app/layout.tsx`, `next.config.ts`, and `sentry.client.config.ts`.

- Install `@sentry/nextjs` — use `npx @sentry/wizard@latest -i nextjs` for guided setup
- Custom error boundaries in React with `Sentry.captureException`
- Agent failures reported as Sentry events with `{ agentName, attemptId, input }` context
- Sentry source maps configured in `next.config.ts`

### 6.2 Logging

**Session scope:** `src/lib/logger.ts` + wire into API routes.

- Server-side structured JSON logging via `pino`
- Log format: `{ level, timestamp, requestId, userId, action, durationMs, error? }`
- Agent run logs already in Firestore (Phase 3) — logger is for API route-level timing
- Vercel Function logs are automatic — no additional config needed

### 6.3 Performance Monitoring

**Session scope:** `src/lib/timing.ts` + Vercel Analytics setup.

- Vercel Analytics — add `<Analytics />` from `@vercel/analytics/react` to root layout
- Custom server-side timing for agent runs — wrap `runAgentWithRetry` with `performance.now()`
- Store `durationMs` per agent run in Firestore (already in `AgentRun` type — ensure it's populated)
- Log a warning if any agent exceeds 8,000ms

### 6.4 Testing Strategy

> **One session per test suite.** Do not mix unit, integration, and E2E in one session.

**Session — Unit Tests (Vitest):**

Tests to write in `src/__tests__/unit/`:
- `safety.guard.test.ts` — all injection patterns blocked, safe inputs pass
- `evaluator.scoring.test.ts` — score calculation logic with mock rubric
- `validations.test.ts` — Zod schemas accept valid + reject invalid inputs
- `auth.test.ts` — `requireAuth` throws `UnauthorizedError` on missing/invalid token

**Session — Integration Tests (Vitest + Supertest or `next/jest`):**

Tests to write in `src/__tests__/integration/`:
- Interview creation → attempt start → agent step → completion flow (mocked Gemini)
- Unauthenticated access → 401
- Cross-user access → 404 (not 403 — do not leak resource existence)
- Malformed input → 400 with Zod error details

**Session — E2E Tests (Playwright):**

Tests to write in `e2e/`:
- `auth.spec.ts` — login flow with Google Sign-In (use Playwright auth state)
- `interview-creation.spec.ts` — create interview → complete setup wizard → land on `/interview/[id]`
- `interview-flow.spec.ts` — start interview → type answer (mock STT) → receive AI response → view feedback
- `feedback.spec.ts` — view feedback report → export PDF

**Session — Security Tests (Vitest):**

Tests to write in `src/__tests__/security/`:
- Prompt injection strings → rejected by `guardInput()` with `safe: false`
- Missing auth token → 401
- Valid auth + wrong `userId` → 404
- Burst of 21 requests → 429 on request 21

### 6.5 CI/CD Pipeline

**Session scope:** `.github/workflows/ci.yml` only.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run type-check   # tsc --noEmit
      - run: npm run lint
      - run: npm run test         # Vitest unit + integration
      - run: npm run build        # production build check

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  # Vercel preview deploy — configured via Vercel GitHub integration (no YAML needed)
  # Vercel production deploy — triggers on merge to main (no YAML needed)
```

### Phase 6 Gate Check — Final Roadmap Completion

> Run the `verification` skill (full-story walkthrough) + `verification-before-completion` skill before marking this gate passed.

**Deliverables — verify each:**
- [ ] Sentry integrated — client errors and server agent failures captured
- [ ] Structured logging in all API routes
- [ ] Vercel Analytics `<Analytics />` in root layout
- [ ] All Vitest unit tests passing
- [ ] All Vitest integration tests passing (with mocked Gemini)
- [ ] All Playwright E2E tests passing
- [ ] All security tests passing
- [ ] CI/CD pipeline passing on a test PR
- [ ] Lighthouse ≥ 90 on Performance, Accessibility, Best Practices
- [ ] `docs/RUNBOOK.md` created — on-call troubleshooting guide
- [ ] `finishing-a-development-branch` skill completed — all branches merged
- [ ] `requesting-code-review` skill triggered — final review requested

---

## Milestone Summary

| Phase | Name | Key Output | Skills Used | Est. Effort |
|---|---|---|---|---|
| **0** | Audit & Stabilize | Security lockdown, codebase inventory | `writing-plans`, `context7-mcp`, `verification-before-completion` | 2–3 days |
| **1** | Architecture Foundation | Next.js migration, Firebase Admin, API routes | `nextjs`, `executing-plans`, `dispatching-parallel-agents`, `context7-mcp` | 1–2 weeks |
| **2** | shadcn Design System | UI rebuild, coaching studio aesthetic | `shadcn` (×2), `react-best-practices`, `brainstorming` | 1–2 weeks |
| **3** | Multi-Agent Engine | 6-agent system, full voice/video simulation | `ai-sdk`, `test-driven-development`, `subagent-driven-development`, `systematic-debugging`, `context7-mcp` | 2–3 weeks |
| **4** | Security Hardening | Zod, Firestore rules, rate limits, guard | `routing-middleware`, `review-security`, `context7-mcp` | 1 week |
| **5** | UX Polish & Analytics | Animations, progress tracking, PDF export | `brainstorming`, `react-best-practices`, `nextjs`, `context7-mcp` | 1–2 weeks |
| **6** | Observability & Production | Sentry, CI/CD, test suites | `deployments-cicd`, `test-driven-development`, `verification`, `finishing-a-development-branch`, `requesting-code-review` | 1 week |

**Total estimated timeline: 8–14 weeks** (solo developer, part-time)

---

## Domain Type System

```typescript
// src/types/interview.ts
import type { Timestamp } from 'firebase-admin/firestore'

export interface Interview {
  id: string
  userId: string
  role: string
  description: string
  experience: number
  difficulty: 'junior' | 'mid' | 'senior' | 'staff'
  techStack: string[]
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Question {
  id: string
  interviewId: string
  index: number
  text: string
  type: 'technical' | 'behavioral' | 'situational' | 'followup'
  expectedAnswer: string
  keyPoints: string[]
  maxScore: number
  rubricVersion: string
}

export interface TranscriptEvent {
  id: string
  attemptId: string
  role: 'candidate' | 'interviewer'
  content: string
  questionIndex: number
  agentName?: string
  timestamp: Timestamp
}

export interface EvaluationResult {
  attemptId: string
  overallScore: number
  maxScore: number
  percentageScore: number
  perQuestionScores: QuestionScore[]
  strengths: string[]
  areasForImprovement: string[]
  rubricVersion: string
  evaluatedAt: Timestamp
}

export interface QuestionScore {
  questionIndex: number
  score: number
  maxScore: number
  feedback: string
  evidenceQuotes: string[]
}

export interface FeedbackReport {
  id: string
  attemptId: string
  evaluation: EvaluationResult
  practicePlan: PracticePlan
  generatedAt: Timestamp
  isPublic: boolean
  publicSlug?: string
}

export interface PracticePlan {
  summary: string
  weeklyGoals: WeeklyGoal[]
  resources: Resource[]
  focusAreas: string[]
  estimatedImprovementWeeks: number
}

export interface WeeklyGoal {
  week: number
  goal: string
  tasks: string[]
}

export interface Resource {
  title: string
  url: string
  type: 'article' | 'video' | 'course' | 'book' | 'practice'
  focusArea: string
}

export interface AgentRun {
  id: string
  attemptId: string
  userId: string
  agentName: 'planner' | 'question' | 'followup' | 'evaluator' | 'coach' | 'guard'
  status: 'RUNNING' | 'COMPLETE' | 'FAILED'
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  error: string | null
  durationMs: number
  tokenCount: number | null
  modelUsed: string
  startedAt: Timestamp
  completedAt: Timestamp | null
}

export interface RubricItem {
  skill: string
  description: string
  maxPoints: number
  criteria: string[]
}
```

---

## Stack Summary (Post-Migration)

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSR, API routes, middleware, file-system routing |
| Language | TypeScript 5+ | Type safety, editor tooling, maintainability |
| Styling | Tailwind CSS + shadcn/ui | Consistent design system, zero runtime CSS |
| Animation | Framer Motion | Already in project, best-in-class React animation |
| Auth | Firebase Auth + Session Cookies | Battle-tested, already configured |
| Database | Firebase Firestore | Already in use, sufficient for current scale |
| AI | Google Gemini 2.5 Flash | Already integrated, fast + cost-effective |
| Server AI | Firebase Admin SDK + Gemini server-only | Secrets never reach the browser |
| Rate Limiting | Upstash Redis + @upstash/ratelimit | Edge-compatible, generous free tier |
| Error Tracking | Sentry | Free tier, excellent Next.js integration |
| Analytics | Vercel Analytics | Built-in, zero config |
| CI/CD | GitHub Actions + Vercel | Already on Vercel, GitHub integration automatic |
| Testing | Vitest + Playwright | Fast unit tests + reliable E2E |

---

## What This Is NOT

- A general-purpose agent builder or prompt playground
- A monetized SaaS product (no payment system in scope)
- A mobile native app (responsive web only)
- A real-time collaborative tool (single-user per interview session)
- A deepfake AI avatar system (audio TTS + animated status indicator only)

---

*Last updated: 2026-07-08 | Tailored for Composer 2.5 execution | Context window budget: 150k max per session*
