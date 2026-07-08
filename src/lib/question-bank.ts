// SERVER-ONLY — never import in 'use client' components
import type { HrQuestion } from '@/types/dataset'
import { normalizeRole, ROLE_TAXONOMY } from './role-taxonomy'

import frontendSenior from '@/data/question-bank/frontend-senior.json'
import backendMid from '@/data/question-bank/backend-mid.json'
import fullstackJunior from '@/data/question-bank/fullstack-junior.json'
import dataScienceSenior from '@/data/question-bank/data-science-senior.json'
import devopsMid from '@/data/question-bank/devops-mid.json'
import productJunior from '@/data/question-bank/product-junior.json'

const QUESTION_BANKS: Record<string, HrQuestion[]> = {
  'frontend-senior': frontendSenior as HrQuestion[],
  'backend-mid': backendMid as HrQuestion[],
  'fullstack-junior': fullstackJunior as HrQuestion[],
  'data-science-senior': dataScienceSenior as HrQuestion[],
  'devops-mid': devopsMid as HrQuestion[],
  'product-junior': productJunior as HrQuestion[],
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function sampleFewShotExamples(
  role: string,
  difficulty: string,
  count = 4
): HrQuestion[] {
  const normalizedRole = normalizeRole(role, ROLE_TAXONOMY)
  const key = `${normalizedRole}-${difficulty.toLowerCase()}`
  const bank = QUESTION_BANKS[key]

  if (!bank || bank.length === 0) {
    return []
  }

  return shuffle(bank).slice(0, Math.min(count, bank.length))
}

export function listQuestionBankKeys(): string[] {
  return Object.keys(QUESTION_BANKS)
}
