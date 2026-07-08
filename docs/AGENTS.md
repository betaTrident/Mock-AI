# MockAI Agent System

> Phase 3 multi-agent interview engine — server-side orchestration with Gemini 2.5 Flash.

## Architecture

```
Interview Orchestrator (state machine)
  ├── Planner Agent      → strategy + rubric
  ├── Question Agent     → generates questions (few-shot grounded)
  ├── Follow-up Agent    → adaptive follow-ups during live interview
  ├── Evaluator Agent    → rubric-based scoring
  ├── Coach Agent        → personalized practice plan
  └── Safety Guard       → input/output filtering (no LLM)
```

## Agents

### Planner (`src/agents/planner.agent.ts`)

| | |
|---|---|
| **Triggers** | New attempt enters `PLANNING` |
| **Input** | `{ role, description, experience, difficulty, techStack }` |
| **Output** | `{ role, strategy, topics, rubric[], questionCount }` |
| **Model** | `gemini-2.5-flash` via AI SDK `generateText` + `Output.object()` |
| **Failure modes** | Invalid schema → retry (3x) → `FAILED` status; missing `GEMINI_API_KEY` → 503 |

### Question (`src/agents/question.agent.ts`)

| | |
|---|---|
| **Triggers** | After planner completes |
| **Input** | Planner output + `fewShotExamples` from `sampleFewShotExamples()` |
| **Output** | `Question[]` validated by `QuestionSchema` |
| **Few-shot** | 3–5 HR dataset examples injected at call site in orchestrator |
| **Failure modes** | Schema validation failure → retry; empty bank → runs without examples |

### Follow-up (`src/agents/followup.agent.ts`)

| | |
|---|---|
| **Triggers** | Each candidate answer during `IN_PROGRESS` |
| **Input** | `{ currentQuestion, answerTranscript, conversationHistory }` (last 3 turns) |
| **Output** | `FOLLOW_UP` \| `NEXT_QUESTION` \| `CLOSE_INTERVIEW` |
| **Failure modes** | Guard blocks unsafe input before agent runs |

### Evaluator (`src/agents/evaluator.agent.ts`)

| | |
|---|---|
| **Triggers** | Interview complete → `EVALUATING` |
| **Input** | Transcript excerpts + questions + rubric |
| **Output** | `EvaluationResult` with per-question scores and evidence |
| **Failure modes** | Token overflow mitigated by transcript summarization |

### Coach (`src/agents/coach.agent.ts`)

| | |
|---|---|
| **Triggers** | After evaluator → `COACHING` |
| **Input** | `{ evaluation, role, weakAreas }` |
| **Output** | `PracticePlan` with weekly goals and resources |
| **Constraint** | System prompt requires role-specific advice, no generic study tips |

### Safety Guard (`src/agents/safety.guard.ts`)

| | |
|---|---|
| **Triggers** | All user inputs before any agent |
| **Method** | Regex pattern matching (no Gemini call) |
| **Blocks** | Prompt injection, inputs >5000 chars |

## State Machine

| Status | Meaning |
|---|---|
| `PENDING` | Attempt created |
| `PLANNING` | Planner + Question agents running |
| `READY` | Questions generated |
| `IN_PROGRESS` | Live interview |
| `EVALUATING` | Evaluator running |
| `COACHING` | Coach running |
| `COMPLETE` | Feedback available |
| `FAILED` | Recoverable agent error |

**API:** `POST /api/attempts/[id]/agent-step` with optional `{ candidateMessage }`

## Persistence

Agent runs stored in Firestore `agentRuns` collection with:
- `agentName`, `status`, `input`, `output`, `durationMs`, `modelUsed`, `tokenCount`

## Dataset

- **Preprocessing:** `npm run prepare:dataset` (seed files) or `npm run prepare:dataset -- --remote`
- **Loader:** `src/lib/question-bank.ts` → `sampleFewShotExamples(role, difficulty, count)`
- **Taxonomy:** `src/lib/role-taxonomy.ts` → 7 role buckets + `general`

## Voice/Video (Client)

- **STT:** Web Speech API (`src/features/interview/speech-recognition.ts`)
- **TTS:** Speech Synthesis API (`src/features/interview/text-to-speech.ts`)
- **Video:** MediaRecorder/getUserMedia in `VideoPanel`
- **Shortcuts:** `M` = mute TTS, `C` = toggle camera

## Retry Strategy

`src/lib/agent-runner.ts` — 3 attempts, exponential backoff (1s, 2s, 4s).
