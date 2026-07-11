# MockAI UI Redesign Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the authenticated MockAI product UI to match the provided high-fidelity mockups while preserving the existing route model, interview workflow, Firebase-backed data flow, and server-side AI orchestration.

**Architecture:** Shell-first redesign on the current Next.js App Router codebase. Establish a stronger product-wide layout system, then refactor each major screen in sequence: dashboard, interview setup, feedback reports, live workspace, and account/settings.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, Lucide, Framer Motion, Recharts, Firebase Auth/Firestore, existing API routes and interview data models

---

## Composer 2.5 Execution Protocol

> This plan is tailored for Composer 2.5 execution. Follow these operating rules exactly.

1. **Stay inside scope.** This plan is a UI redesign plan, not a backend rewrite. Do not invent new data services, auth models, or agent workflows unless a phase explicitly requires a small supporting change.
2. **One phase at a time.** Finish the current phase, verify it, then stop at the gate.
3. **Preserve working contracts.** Existing routes, API endpoints, and validation schemas are the source of truth unless a task says to extend them.
4. **Refactor presentation first.** Prefer reusing current domain logic and data loaders while replacing layout, composition, and visual hierarchy.
5. **Do not flatten the mockups into generic SaaS UI.** Keep the coaching-studio direction: calm, premium, dense, and purpose-built for interview practice.
6. **Use repo patterns.** Reuse shadcn primitives, the current component organization, and typed data shapes already present in `src/lib`, `src/types`, and `src/components`.
7. **Do not introduce fake product behavior.** If the mockup implies features the app does not yet support, represent them honestly or keep them visual-only with existing backing data.
8. **Verify every phase.** Run the listed checks before moving on.

---

## Design Direction Constraints

- Keep the product desktop-first with strong tablet/mobile fallbacks.
- Preserve the dark coaching-studio visual direction already established in `src/app/globals.css`, but raise the quality bar on spacing, hierarchy, density, and component polish.
- Avoid generic AI visuals, decorative clutter, and shallow marketing-style cards.
- Make the product feel like a serious interview-preparation workspace.
- Prefer crisp borders, restrained glows, clear score/status semantics, and dense but readable panels.
- Keep the redesign feasible for the current stack: no speculative 3D, no canvas-heavy custom systems, no unnecessary design-only dependencies.

---

## Phase 1: Shell and Design System Foundation

**Goal:** Build the product shell and shared visual primitives that all redesign screens depend on.

**Primary files:**
- `src/app/globals.css`
- `src/components/shared/AppShell.tsx`
- `src/components/shared/Sidebar.tsx`
- `src/components/shared/PageHeader.tsx`
- `src/components/shared/UserMenu.tsx`
- `src/components/ui/*` only where shared primitive variants are needed

### Deliverables

- [ ] Replace the current minimal app shell with a stronger desktop shell:
  - persistent left navigation
  - top utility bar
  - consistent page content container
- [ ] Expand the navigation model to support the redesign information architecture:
  - `Dashboard`
  - `Interviews`
  - `Feedback`
  - `Practice Plan`
  - `Shared Reports`
  - `Profile`
  - `Settings`
- [ ] Add top-bar utility regions for:
  - search
  - streak/status indicator
  - notifications affordance
  - account/avatar menu
- [ ] Establish shared page-level spacing, panel spacing, table spacing, and section rhythm tokens in `globals.css`
- [ ] Add reusable visual styles for:
  - metric cards
  - status badges
  - score chips
  - section containers
  - table rows
  - settings rows
- [ ] Ensure mobile shell still works using the existing sheet/drawer approach

### Constraints

- Do not redesign individual feature pages yet beyond what is necessary for the shell to render them correctly.
- Do not add search backends in this phase. The search field may remain visual or command-palette-backed.

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Manually verify shell layout on:
  - `/dashboard`
  - `/interview/new`
  - `/profile`

### Phase Gate

- [ ] Shell is consistent across app routes and no page is visually broken by the new layout system

---

## Phase 2: Dashboard Redesign

**Goal:** Transform the dashboard into the denser coaching overview shown in the mockup.

**Primary files:**
- `src/components/dashboard/DashboardClient.tsx`
- `src/components/dashboard/ProgressSection.tsx`
- `src/components/dashboard/ResumeInterviewBanner.tsx`
- `src/components/interview/InterviewCard.tsx`
- `src/lib/dashboard-data.ts`
- `src/lib/dashboard-types.ts`

### Deliverables

- [ ] Replace the current simple page composition with:
  - welcome header
  - KPI strip
  - resume interview panel
  - weekly activity chart section
  - recent interviews table/list
  - skill improvement panels
  - lower conversion/empty-state CTA block
- [ ] Convert recent interviews from a simple card grid into a denser, more informative presentation
- [ ] Introduce UI states for:
  - score trend
  - next suggested practice
  - focus skill
- [ ] Improve progress and activity visualization using the existing chart stack
- [ ] Preserve current create-interview flow entry points

### Constraints

- Prefer computed values from current dashboard data before extending backend loaders
- If additional derived metrics are needed, add them to `dashboard-data.ts` without changing the underlying persistence model

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Verify dashboard renders with:
  - no interviews
  - interviews only
  - in-progress attempt

### Phase Gate

- [ ] Dashboard visually matches the target information density and still works with current data sources

---

## Phase 3: New Interview Setup Redesign

**Goal:** Replace the current tabbed setup wizard with the two-column guided setup experience from the mockup.

**Primary files:**
- `src/components/interview/InterviewSetupWizard.tsx`
- `src/app/(app)/interview/new/page.tsx`
- `src/lib/validations/interview.ts`

### Deliverables

- [ ] Replace tab-style navigation with an explicit stepper UI
- [ ] Recompose the page into:
  - left: editable interview setup form
  - right: AI coach preview panel
- [ ] Add a more polished skills/tag input experience
- [ ] Add interview type selection cards:
  - behavioral
  - technical
  - system design
  - mixed
- [ ] Add preview modules for:
  - likely topics
  - question style
  - AI follow-up behavior
  - estimated duration
  - evaluation focus
- [ ] Preserve submission behavior through the existing create interview route

### Constraints

- Keep `createInterviewSchema` as the validation source of truth
- Do not invent new required backend fields unless they are optional and handled safely
- If a feature like "save draft" is not implemented, do not pretend it persists; either omit it or make it clearly non-persistent

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Validate happy-path interview creation from `/interview/new`

### Phase Gate

- [ ] New interview flow matches the target composition and still creates interviews correctly

---

## Phase 4: Feedback and Shared Report Redesign

**Goal:** Rebuild the private feedback page and public shared report so they match the mockups and present scoring more clearly.

**Primary files:**
- `src/components/interview/FeedbackPageClient.tsx`
- `src/components/interview/PublicFeedbackPageClient.tsx`
- `src/components/interview/FeedbackReport.tsx`
- supporting components under `src/components/interview/*`

### Deliverables

- [ ] Replace the current report stack with a structured report surface containing:
  - overall score summary
  - score breakdown
  - strengths
  - areas to improve
  - AI coach summary
  - question-by-question review
  - personalized practice plan
- [ ] Create a separate public/shared presentation instead of reusing the private report layout verbatim
- [ ] Add clear read-only shared state and strong CTA back into the product
- [ ] Keep export and share actions intact on the private report page
- [ ] Use the existing evaluation/practice-plan data contracts as the base report input

### Constraints

- Prefer extending the `FeedbackReportData` presentation model rather than changing API payloads unless absolutely necessary
- Do not break the PDF export route or share-link generation while redesigning the UI

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Verify private feedback page loads from a real attempt
- [ ] Verify public shared report still loads from `/feedback/[slug]`

### Phase Gate

- [ ] Both feedback surfaces are clearly differentiated, polished, and compatible with existing report flows

---

## Phase 5: Live Interview Workspace Redesign

**Goal:** Recompose the live interview workspace into the immersive, multi-panel coaching interface from the mockup.

**Primary files:**
- `src/components/interview/InterviewWorkspace.tsx`
- `src/components/interview/VideoPanel.tsx`
- `src/components/interview/TranscriptPanel.tsx`
- `src/components/interview/QuestionDisplay.tsx`
- `src/components/interview/RecordingControls.tsx`
- `src/components/interview/AgentStatusIndicator.tsx`

### Deliverables

- [ ] Rebuild the layout into a three-region workspace:
  - user video
  - AI interviewer/status panel
  - transcript panel
- [ ] Create a stronger question/response stage with:
  - current question
  - recording state
  - timer
  - answer actions
- [ ] Upgrade transcript presentation to a clearer conversational stream
- [ ] Replace the compact agent indicator with richer per-agent status cards or a status rail
- [ ] Rework the bottom session controls and progress presentation
- [ ] Keep mobile transcript access via sheet or equivalent fallback

### Constraints

- Do not misrepresent the AI interviewer as a fully animated avatar if the product behavior remains text/audio/status driven
- Keep browser-only voice/camera logic in client components and existing event-driven boundaries
- Preserve existing session control semantics unless a bug fix is required

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] `npm run test`
- [ ] Manual verification of:
  - recording controls
  - transcript visibility on mobile
  - end interview flow

### Phase Gate

- [ ] Workspace feels substantially closer to the target mockup without regressing current interview functionality

---

## Phase 6: Profile and Settings

**Goal:** Replace the placeholder profile page and add the account/settings experience shown in the mockups.

**Primary files:**
- `src/app/(app)/profile/page.tsx`
- likely new route(s) under `src/app/(app)/settings/`
- `src/components/shared/UserMenu.tsx`

### Deliverables

- [ ] Replace placeholder profile page with a real account overview
- [ ] Add sections for:
  - profile summary
  - practice preferences
  - interview role defaults
  - privacy and session controls
  - connected accounts
  - notification preferences
  - danger zone
- [ ] Add settings route if needed to keep profile and settings concerns cleanly separated
- [ ] Use realistic persistence boundaries:
  - wire real settings only when current infrastructure supports them
  - otherwise make unsupported controls clearly non-destructive or defer them

### Constraints

- Do not create fake account-management behavior
- If persistence is added, keep it minimal and typed

### Verification

- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Verify profile/settings routes render inside the new shell without placeholder regressions

### Phase Gate

- [ ] Profile and settings experience is no longer a stub and visually belongs to the redesigned product

---

## Cross-Phase Rules

- [ ] After each phase, inspect the changed routes in the browser before continuing
- [ ] Keep visual reuse high; if a pattern appears on two or more pages, extract a shared component
- [ ] Do not introduce dead demo components that are not wired to real routes
- [ ] Avoid large one-shot rewrites across unrelated files in a single session
- [ ] Keep data contracts typed; no `any`

---

## Recommended Session Breakdown for Composer 2.5

**Context budget per session:** ~20k to 35k tokens. Do not attempt the full redesign in one session.

### Suggested execution order

1. Phase 1 shell foundation
2. Phase 2 dashboard
3. Phase 3 interview setup
4. Phase 4 feedback + shared report
5. Phase 5 live workspace
6. Phase 6 profile/settings

### Suggested branch strategy

- `track-1-shell-and-tokens`
- `track-2-dashboard-and-setup`
- `track-3-feedback-and-shared-report`
- `track-4-workspace-and-settings`

---

## Success Criteria

- The product visually matches the supplied redesign direction across all major authenticated screens
- The redesign remains grounded in the current MockAI architecture and does not break existing workflows
- The app feels like a premium interview coaching studio rather than a generic AI dashboard
- All redesigned routes build cleanly and preserve current navigation, auth, and interview lifecycle behavior

---

*Last updated: 2026-07-12 | Tailored for Composer 2.5 execution | Scope: UI redesign only*
