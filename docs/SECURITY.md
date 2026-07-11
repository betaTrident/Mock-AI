# MockAI Security

> Phase 4 security hardening — threat surfaces and mitigations.

## Threat Model

| Surface | Risk | Mitigation |
|---------|------|------------|
| Gemini API key | Key theft, quota abuse | Server-only `GEMINI_API_KEY`; never `NEXT_PUBLIC_` |
| Firebase Admin credentials | Full database access | Server-only `FIREBASE_SERVICE_ACCOUNT_KEY`; Vercel secret |
| Client Firestore writes | Data tampering, privilege escalation | Firestore rules deny all client writes except `/users/{uid}` |
| Unauthenticated API access | Data exfiltration | HttpOnly session cookie verified via `verifySessionCookie` |
| Authorization bypass | Cross-user data access | `requireAuth` + ownership checks on every resource |
| Prompt injection | Agent manipulation | Regex safety guard before agent calls; HTTP 400 on violation |
| Rate abuse | Cost / DoS | Upstash sliding window (20 req/min per IP) on `/api/*` |
| Input overflow | Token exhaustion, crashes | Zod schemas with max lengths on all POST bodies |
| Audit tampering | Forensics loss | `auditLogs` collection — no client read/write |
| Session hijacking | Account takeover | HttpOnly, Secure (prod), SameSite=Lax session cookies |

## API Key Handling

### Server-only secrets

- `GEMINI_API_KEY` — used only in `src/lib/gemini.ts` and agent modules
- `FIREBASE_SERVICE_ACCOUNT_KEY` — used only in `src/lib/firebase-admin.ts`

### Public Firebase config

`NEXT_PUBLIC_FIREBASE_*` variables are intentionally public. Security relies on:

1. Strict Firestore rules (`firestore.rules`)
2. All privileged writes through Firebase Admin SDK in API routes

### Legacy exposure

The Vite-era `VITE_GEMINI_API_KEY` was bundled into the client. **Rotate this key** in Google AI Studio before production.

## Authentication

### Session flow

1. Client signs in via Firebase Auth (`signInWithEmailAndPassword`)
2. Client POSTs ID token to `/api/auth/session` with `X-Session-Request: 1` header
3. Server validates same-origin (`Origin`/`Referer`) and custom header (login CSRF protection)
4. Server creates Firebase session cookie (`createSessionCookie`)
4. Cookie set with `HttpOnly`, `Secure` (production), `SameSite=Lax`
5. All API routes use `requireAuth()` — reads session cookie, no Bearer tokens
6. `onIdTokenChanged` refreshes session server-side via `SessionRefreshProvider`
7. Sign-out: `DELETE /api/auth/session` revokes refresh tokens and clears cookie

### Middleware

- Protected pages (`/dashboard`, `/interview`, `/profile`) require session cookie presence
- API routes verify session in route handlers (Node.js runtime with Firebase Admin)

## Input Validation

All POST routes validate with Zod `safeParse` before Firestore or agent calls:

| Route | Schema |
|-------|--------|
| `POST /api/interviews` | `createInterviewSchema` |
| `POST /api/attempts` | `createAttemptSchema` |
| `POST /api/attempts/[id]/agent-step` | `agentStepSchema` |
| `POST /api/auth/session` | `sessionTokenSchema` |

Validation failures return HTTP 400 with flattened Zod errors.

## Firestore Rules

```
/users/{uid}     → read/write if auth.uid == uid
/interviews/*    → read if owner; write denied
/attempts/*      → read if owner; write denied
/agentRuns/*     → read if owner; write denied
/auditLogs/*     → no client access
/{everything}    → denied
```

Deploy: `firebase deploy --only firestore:rules`

## Rate Limiting

- **Library:** `@upstash/ratelimit` + `@upstash/redis`
- **Scope:** `/api/*` routes in `src/middleware.ts`
- **Limit:** 20 requests per minute per IP (sliding window)
- **Response:** HTTP 429 with `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers
- **Dev fallback:** Rate limiting skipped when Upstash env vars are unset

## Prompt Injection Guard

`src/agents/safety.guard.ts` blocks:

- Instruction override attempts (`ignore previous instructions`)
- Role reassignment (`you are now a`, `act as a different`)
- System prompt markers (`system:`, `[INST]`, `<|...|>`)
- Pretend/jailbreak phrases (`pretend you are`, `pretend to be`)
- Inputs exceeding 5,000 characters

Violations return HTTP 400 at the API route (not 422) to avoid leaking guard logic.

## Audit Logging

`src/lib/audit.ts` writes to Firestore `auditLogs` collection:

| Action | Trigger |
|--------|---------|
| `create_interview` | `POST /api/interviews` |
| `start_attempt` | `POST /api/attempts` |
| `agent_step` | `POST /api/attempts/[id]/agent-step` |
| `complete_attempt` | `POST /api/attempts/[id]/complete` |
| `get_feedback` | `GET /api/attempts/[id]/feedback` |
| `auth_session` | `POST /api/auth/session` |
| `auth_sign_out` | `DELETE /api/auth/session` |

Each entry includes: `userId`, `action`, `resourceId`, `ip`, `userAgent`, `success`, `timestamp`.

## Environment Variables

See `.env.example` for the full list. Required for production:

| Variable | Scope |
|----------|-------|
| `GEMINI_API_KEY` | Server |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Server |
| `UPSTASH_REDIS_REST_URL` | Server |
| `UPSTASH_REDIS_REST_TOKEN` | Server |
| `NEXT_PUBLIC_FIREBASE_*` | Public (client SDK) |

## Deployment Checklist

- [ ] Rotate `GEMINI_API_KEY` (legacy key was client-exposed)
- [ ] Store secrets in Vercel environment variables (not in repo)
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Configure Upstash Redis and add env vars to Vercel
- [ ] Verify rate limiting with burst test (21 requests → 429)
- [ ] Confirm no `VITE_*` secrets in `.env.local`
