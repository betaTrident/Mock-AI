# MockAI On-Call Runbook

Operational troubleshooting guide for production incidents.

## Quick Links

| System | URL / Command |
|--------|---------------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Firebase Console | https://console.firebase.google.com |
| Sentry | Configure via `SENTRY_DSN` env var |
| Vercel Logs | `vercel logs <deployment-url> --level error` |

## Severity Levels

| Level | Examples | Response |
|-------|----------|----------|
| P1 | Auth down, all interviews failing | Immediate — check Firebase + session API |
| P2 | Agent failures spike, 503 errors | Within 1h — check Gemini API key + Sentry |
| P3 | Slow agents (>8s), PDF export fails | Next business day |

## Common Incidents

### 1. Users cannot log in (401 on all API routes)

**Symptoms:** Dashboard redirects to `/login`; API returns 401.

**Check:**
1. Firebase Auth status in Firebase Console
2. `FIREBASE_SERVICE_ACCOUNT_KEY` is set in Vercel production env
3. Session cookie: `POST /api/auth/session` returns 200 with `X-Session-Request: 1` header
4. Vercel logs: `vercel logs --level error`

**Fix:**
- Rotate service account key if expired
- Redeploy after updating `FIREBASE_SERVICE_ACCOUNT_KEY` in Vercel

### 2. AI interviewer not responding (503)

**Symptoms:** `AI service unavailable` toast; agent-step returns 503.

**Check:**
1. `GEMINI_API_KEY` is set server-side (not `NEXT_PUBLIC_`)
2. Sentry for `agentName` tagged failures
3. Firestore `agentRuns` collection for `FAILED` status

**Fix:**
- Verify Gemini API quota in Google AI Studio
- Rotate `GEMINI_API_KEY` if compromised

### 3. Rate limiting (429)

**Symptoms:** `Rate limited` response; `X-RateLimit-Remaining: 0`.

**Check:**
1. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel env
2. Upstash dashboard for connection errors

**Fix:**
- Increase limit in `src/middleware.ts` if legitimate traffic spike
- Default: 20 requests/minute per IP on `/api/*`

### 4. Slow interview evaluation

**Symptoms:** Warning logs with `slow_agent` and `durationMs > 8000`.

**Check:**
1. Firestore `agentRuns` — filter by `agentName: evaluator`
2. Transcript length (long interviews increase token usage)

**Fix:**
- Transcript summarization is built into evaluator agent
- Consider reducing question count in planner if persistent

### 5. Feedback PDF export fails

**Symptoms:** 409 `Feedback not ready` or 500 on `/api/attempts/[id]/feedback/pdf`.

**Check:**
1. Attempt `status` must be `COMPLETE`
2. Both `evaluation` and `practicePlan` must exist on attempt doc

**Fix:**
- Re-trigger completion: `POST /api/attempts/[id]/complete`
- Check coach/evaluator agent runs in Firestore

## Structured Log Format

API routes emit JSON logs via pino:

```json
{
  "level": "info",
  "requestId": "abc123",
  "userId": "firebase-uid",
  "action": "agent_step",
  "durationMs": 234,
  "msg": "request_complete",
  "success": true
}
```

Search Vercel Function logs by `action` or `requestId`.

## Agent Run Debugging

Query Firestore `agentRuns` where `attemptId == <id>`:

| Field | Meaning |
|-------|---------|
| `status: FAILED` | Agent exhausted retries — check `error` field |
| `durationMs` | Wall-clock time; >8000ms triggers warning |
| `input` / `output` | Redacted agent I/O for replay |

## Deployment Rollback

```bash
vercel ls                    # List recent deployments
vercel rollback              # Roll back to previous production
vercel promote <preview-url> # Promote validated preview
```

## Health Check Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run test` passes (unit + integration + security)
- [ ] `npm run build` succeeds
- [ ] Login flow works on preview URL
- [ ] Create interview → start attempt → agent step returns response
- [ ] Sentry receiving events (trigger test error in preview)
- [ ] Vercel Analytics showing page views

## Escalation

1. Check Sentry issue details + Firestore `auditLogs` for the user
2. Review `docs/SECURITY.md` if suspected abuse
3. Rotate compromised keys per `docs/SECURITY.md` rotation policy
