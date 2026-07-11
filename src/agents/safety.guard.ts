const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<\|.*?\|>/,
  /act\s+as\s+(a\s+)?(?:different|new|another)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
]

export interface GuardResult {
  safe: boolean
  reason?: string
}

export async function guardInput(text: string): Promise<GuardResult> {
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

export async function guardOutput(text: string): Promise<GuardResult> {
  if (text.length > 10000) {
    return { safe: false, reason: 'OUTPUT_TOO_LONG' }
  }
  return { safe: true }
}

export const INJECTION_PATTERN_COUNT = INJECTION_PATTERNS.length
