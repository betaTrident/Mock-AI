# MockAI — Phase 0 Audit Baseline

> Generated: 2026-07-08  
> Scope: Vite + React SPA (`lingua-sphere`) before Next.js migration  
> Roadmap reference: `docs/SCALING_ROADMAP.md` — Phase 0

---

## Executive Summary

MockAI is a client-heavy Vite/React interview coaching prototype. The highest-severity issues are:

1. **Gemini API key exposed in the browser** via `VITE_GEMINI_API_KEY` (bundled by Vite).
2. **No Firestore security rules in the repository** — rules must be verified in Firebase Console.
3. **Interview state in `localStorage`** — no URL-based ownership or server validation on navigation.
4. **Duplicate `backend/services/` tree** — mirrors `src/services/` but is not wired into the Vite app.

Build passes. Lint has **9 warnings** remaining (all `react-hooks/exhaustive-deps` or `react-refresh/only-export-components`). All **errors** from the baseline audit were resolved.

---

## 0.1 Security Lockdown

### Developer action required: rotate Gemini API key

The app reads `import.meta.env.VITE_GEMINI_API_KEY`. Vite inlines `VITE_*` variables into the production JS bundle, so **any user can extract the key from `dist/assets/*.js`**.

**Do this manually (not in code):**

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Revoke or restrict the key currently in your local `.env`.
3. Create a new key and store it only in `.env` (gitignored) until Phase 1 moves AI calls server-side.

### Environment variable audit

| Variable | Present in `.env` | Classification | Notes |
|---|---|---|---|
| `VITE_GEMINI_API_KEY` | Yes | **LEGACY** | Client-bundled secret. Replace with server-only `GEMINI_API_KEY` in Phase 1. |
| Firebase client config | Hardcoded in `src/firebase.js` | **PUBLIC** | `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` — intended for client SDK; security depends on Firestore rules + Auth. |
| `GEMINI_API_KEY` | No | **SERVER_ONLY** | Planned Phase 1 — never use `NEXT_PUBLIC_` or `VITE_` prefix. |
| Firebase Admin credentials | No | **SERVER_ONLY** | Planned Phase 1 — service account JSON or individual env vars. |

Local `.env` exists and contains `VITE_GEMINI_API_KEY` only (value not recorded in this document).

### `.gitignore` review

**Before Phase 0:**

```
.env
.env.local
.env.*.local
```

**After Phase 0:**

```
.env
.env.*
!.env.example
.env.local
.env.*.local
```

- `.env.example` is explicitly allowed (template only, no real secrets).
- All other `.env*` variants are ignored.

### Git secret check

```text
git ls-files | Select-String "\.env"  →  (empty — no .env files tracked)
```

**Hardcoded in committed source (public Firebase client config):**

```6:13:src/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyBvAO6vvvGmKHjEM_K6mgvANMTPEtyernE",
    authDomain: "linguasphere-e056b.firebaseapp.com",
    projectId: "linguasphere-e056b",
    storageBucket: "linguasphere-e056b.firebasestorage.app",
    messagingSenderId: "873926621961",
    appId: "1:873926621961:web:2375a8dbd61af967f3b1d8"
};
```

These are **public-safe by Firebase design** when paired with strict Firestore rules. They are **not** admin credentials.

**Never client-side:** service account private key, `FIREBASE_PRIVATE_KEY`, Admin SDK JSON.

### Firestore security rules

**Status: NOT IN REPOSITORY**

`firebase.json` only configures Hosting — no `firestore.rules` or `firestore` block:

```1:17:firebase.json
{
  "hosting": {
    "public": "public",
    "site": "linguasphere-e056b-b0774",
    ...
  }
}
```

**Action required:** Export rules from [Firebase Console](https://console.firebase.google.com/) → Firestore → Rules and add to the repo in Phase 1. Until then, treat data access as **unknown / unverified**.

---

## 0.2 Codebase Inventory

### Firestore collections and document shapes

#### `userProfiles/{userId}`

| Field | Type | Source |
|---|---|---|
| `name` | string | ProfileSetup form |
| `username` | string | ProfileSetup form |
| `dateOfBirth` | string | ProfileSetup form |
| `phoneNumber` | string | ProfileSetup form |
| `address` | string | ProfileSetup form |
| `email` | string | `auth.currentUser.email` |
| `createdAt` | ISO string | set on create |
| `lastUpdated` | ISO string | set on create/update |

**Access:** Login checks existence to route to `/dashboard` vs `/profile-setup`. Dashboard and UserProfiles read/update.

#### `interviews/{interviewId}`

| Field | Type | Source |
|---|---|---|
| `role` | string | Interview creation form |
| `difficulty` | string | Interview creation form |
| `description` | string | Job/tech stack description |
| `experience` | string | Years of experience |
| `userId` | string | `auth.currentUser.uid` |
| `createdAt` | Date / Firestore timestamp | set on create |

**Subcollection:** `interviews/{interviewId}/attempts/{attemptId}`

| Field | Type | Source |
|---|---|---|
| `interviewId` | string | attemptService |
| `userId` | string | attemptService |
| `status` | `"in-progress"` \| `"completed"` | attemptService |
| `startedAt` | Date | attemptService |
| `completedAt` | Date \| null | attemptService |
| `questionsAnswered` | number | attemptService (initial 0) |
| `totalQuestions` | number | attemptService (initial 5) |
| `score` | number | calculated on complete |

**Subcollection:** `interviews/{interviewId}/attempts/{attemptId}/answers/{questionId}`

Document ID pattern: `question_{index}`

| Field | Type | Source |
|---|---|---|
| `question` | string | answerService |
| `userAnswer` | string | answerService |
| `expectedAnswer` | string | answerService |
| `maxScore` | number | default 10 |
| `keyPoints` | string[] | from generated questions |
| `timestamp` | ISO string | answerService |
| `aiFeedback` | string | feedback service (optional) |

### Route map

| Path | Component | Auth |
|---|---|---|
| `/` | `Homepage.jsx` | Public |
| `/register`, `/registration` | `Registration.jsx` | Public |
| `/login` | `Login.jsx` | Public |
| `/profile-setup` | `ProfileSetup.jsx` | Protected (`ProtectedRoute`) |
| `/dashboard` | `Dashboard.jsx` | Protected |
| `/interview-setup` | `InterviewSetup.jsx` | Protected |
| `/interview-page` | `InterviewPage.jsx` | Protected |
| `/feedback` | `FeedbackPage.jsx` | Protected |
| `/profile` | `UserProfiles.jsx` | Protected |
| `*` (catch-all) | Redirect → `/login` | — |

**Orphan / helper pages (not top-level routes):**

- `InterviewModal.jsx` — used by Dashboard
- `Toast.jsx`, `ToastTwo.jsx`, `interviewToast.jsx` — toast utilities
- `Sidebar.jsx`, `AuthLayout.jsx`, `DarkModeToggle.jsx`, `SuccessPopup.jsx` — unused or embedded helpers
- `src/assets/feedbackPagebackup` — backup file, not routed

### Direct Gemini SDK calls (`src/services/`)

| File | Function / class | Line | Model | API surface |
|---|---|---|---|---|
| `questionGenerator.js` | `generateQuestions` | 3, 9–31 | `gemini-2.5-flash` | `GoogleGenerativeAI`, `generateContent` |
| `feedback.js` | `generateAndStoreFeedback` | 5, 16, 34 | `gemini-2.5-pro` | `generateContent` |
| `liveConversationService.js` | `LiveConversationService` | 3, 43–48, 117, 175, 202, 266, 301 | `gemini-2.5-flash-lite` | `startChat`, `sendMessage` |

**Note:** Duplicate copies exist under `backend/services/` with the same `VITE_GEMINI_API_KEY` pattern — not imported by the Vite entry point.

**No Gemini calls in:** `answerService.js`, `attemptService.js`, `speechRecognition.js`, `textToSpeechService.js`.

### `localStorage` usage

| Key | Read | Write | Data |
|---|---|---|---|
| `currentInterviewId` | InterviewSetup, InterviewPage, FeedbackPage, Dashboard | Dashboard, InterviewModal, InterviewPage (via flow) | Firestore `interviews` document ID |
| `currentAttemptId` | InterviewPage, FeedbackPage | InterviewSetup, InterviewPage | Firestore attempt document ID |
| `darkMode` | DarkModeToggle | DarkModeToggle | `"true"` / `"false"` string |

**Risk:** IDs are not in the URL. Any authenticated user with a stale ID in storage could hit the wrong interview if rules are permissive.

### Auth flow (Firebase Auth)

1. **Registration** (`Registration.jsx`): `createUserWithEmailAndPassword` or `signInWithPopup(GoogleAuthProvider)` → redirect to `/login`.
2. **Login** (`Login.jsx`): `signInWithEmailAndPassword` or Google popup → check `userProfiles/{uid}`:
   - Profile exists → `/dashboard`
   - No profile → `/profile-setup`
3. **Profile setup** (`ProfileSetup.jsx`): `onAuthStateChanged` guard → `setDoc(userProfiles/{uid})` → `/dashboard`.
4. **Route protection** (`App.jsx`): `ProtectedRoute` uses `auth.onAuthStateChanged`; unauthenticated users → `/login`.
5. **Service-layer checks:** `answerService` and `attemptService` verify `auth.currentUser` and (for answers) `interview.userId === user.uid`.

**Gaps:** No server-side ownership on Gemini calls. Firestore rules not verified in repo.

---

## 0.3 Baseline Quality Checks

### Lint (`npm run lint`)

**Baseline (pre-fix):** 151 problems (142 errors, 9 warnings)

**Post Phase 0 fixes:**

- Resolved all `no-unused-vars` errors (removed unused imports/state).
- Resolved all `react/prop-types` errors (disabled rule — project is JS without PropTypes).
- Resolved `react/no-unescaped-entities` in `Login.jsx`.

**Remaining warnings (documented, not trivial one-line fixes):**

| File | Rule | Issue |
|---|---|---|
| `src/components/ui/Modal.jsx` | `react-refresh/only-export-components` | Exports non-component helpers |
| `src/components/ui/Toast.jsx` | `react-refresh/only-export-components` | Exports context hook |
| `src/pages/Dashboard.jsx` | `react-hooks/exhaustive-deps` | `useEffect` missing `showToast` |
| `src/pages/FeedbackPage.jsx` | `react-hooks/exhaustive-deps` | `useEffect` missing `fetchFeedback` |
| `src/pages/InterviewPage.jsx` | `react-hooks/exhaustive-deps` | Multiple effects missing deps |
| `src/pages/interviewToast.jsx` | `react-refresh/only-export-components` | Exports hook |

### Build (`npm run build`)

**Result:** Success (exit code 0)

```
vite v6.4.3 building for production...
✓ 4844 modules transformed.
✓ built in ~59s
```

**Warning:** Main chunk `index-*.js` ≈ 1.34 MB (gzip 363 KB) — code-splitting deferred to Phase 1+.

### Known UI / product issues

| Issue | Severity | Location |
|---|---|---|
| Login success uses 3s + 6s `setTimeout` delays before redirect | Medium | `Login.jsx` |
| Registration redirects to `/login` instead of profile/dashboard | Low | `Registration.jsx` |
| `InterviewModal.jsx` and `Dashboard.jsx` both create interviews (duplicate flows) | Medium | Dashboard |
| `DarkModeToggle.jsx` exists but is not wired into main routes | Low | Orphan component |
| `backend/` folder duplicates `src/services/` — source of truth unclear | Medium | Project root |
| `feedback.js` imports `db` from `../../src/firebase` (fragile path) | Low | `src/services/feedback.js` |
| Catch-all route sends unknown paths to `/login` instead of 404 | Low | `App.jsx` |
| Gemini Live audio is stubbed; uses Web Speech API + text chat | Info | `liveConversationService.js` |
| Large bundle size may cause slow first load | Medium | Vite build output |

---

## Phase 0 Gate Checklist

| Deliverable | Status |
|---|---|
| `docs/AUDIT.md` | Complete |
| `CHANGELOG.md` | Complete |
| `.env.example` | Complete |
| Trivial lint errors resolved | Complete (0 errors; 9 warnings documented) |
| No secrets committed to git | Verified (`.env` gitignored and untracked) |

---

## Recommended next steps (Phase 1)

1. Rotate Gemini API key (developer action).
2. Export Firestore rules from Firebase Console into the repo.
3. `npx create-next-app@latest` and move Vite source to `/legacy`.
4. Move `GEMINI_API_KEY` and Firebase Admin credentials server-side only.
