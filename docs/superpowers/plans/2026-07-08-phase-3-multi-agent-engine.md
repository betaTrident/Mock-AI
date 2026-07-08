# Phase 3 — Multi-Agent Interview Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single flat Gemini prompt loop with a server-side orchestrated multi-agent system.

**Architecture:** Six specialized agents (Planner, Question, Follow-up, Evaluator, Coach, Safety Guard) coordinated by `orchestrator.ts` state machine. Gemini 2.5 Flash via Vercel AI SDK with structured `Output.object()` schemas. HR dataset few-shot grounding via `question-bank.ts`.

**Tech Stack:** Next.js 16 API routes, Firebase Admin, Vercel AI SDK + @ai-sdk/google, Zod v4, Vitest, Web Speech API

---

## Completed Tasks

- [x] Role taxonomy + question bank loader + 6 seed JSON buckets
- [x] `scripts/prepare-dataset.ts` with `--remote` HF download option
- [x] Zod agent schemas in `src/lib/schemas/agents.ts`
- [x] Gemini client (`src/lib/gemini.ts`) + agent runner with retry
- [x] All 6 agents implemented with typed I/O
- [x] Orchestrator state machine + Firestore agent run persistence
- [x] API routes wired (`attempts`, `agent-step`, `complete`, `feedback`)
- [x] Voice/video integration (`speech-recognition`, `text-to-speech`, `useInterviewSession`)
- [x] Vitest tests (10 passing) + `docs/AGENTS.md`
- [x] `tsc --noEmit`, `npm run build`, `npm run test` pass

## Gate Check Status

| Deliverable | Status |
|---|---|
| Dataset script runs | ✅ `npm run prepare:dataset` |
| 5+ role-difficulty buckets | ✅ 6 buckets |
| role-taxonomy.ts | ✅ |
| sampleFewShotExamples() | ✅ tested |
| 6 agents with Zod validation | ✅ |
| Few-shot wired at call site | ✅ orchestrator logs count in metadata |
| Prompts ≤1500 chars | ✅ tested |
| Safety guard on user input | ✅ orchestrator |
| Agent runs in Firestore | ✅ agent-persistence.ts |
| State machine via agent-step | ✅ |
| Retry + backoff | ✅ agent-runner.ts |
| Voice/video in InterviewWorkspace | ✅ |
| tsc + build | ✅ |
| docs/AGENTS.md | ✅ |
