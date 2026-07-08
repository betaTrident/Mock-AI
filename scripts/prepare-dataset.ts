/**
 * Dataset preprocessing — run once: npm run prepare:dataset
 * Output: src/data/question-bank/{role-tier}-{difficulty}.json
 *
 * By default uses bundled seed data. Pass --remote to download from HuggingFace.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ROLE_TAXONOMY, normalizeRole } from '../src/lib/role-taxonomy'
import type { HrQuestion, HrQuestionRaw } from '../src/types/dataset'

const HF_PARQUET_URL =
  'https://huggingface.co/datasets/Ankshi/hr-interview-dataset/resolve/refs%2Fconvert%2Fparquet/default/train/0000.parquet'

const OUTPUT_DIR = join(process.cwd(), 'src/data/question-bank')
const CAP_PER_BUCKET = 200

function toHrQuestion(row: HrQuestionRaw, normalizedRole: string): HrQuestion {
  return {
    question: row.question,
    category: row.category,
    idealAnswer: row.ideal_answer,
    keywords: row.keywords ?? [],
    difficulty: row.difficulty,
    role: normalizedRole,
  }
}

function writeBuckets(buckets: Record<string, HrQuestion[]>) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  for (const [key, questions] of Object.entries(buckets)) {
    writeFileSync(
      join(OUTPUT_DIR, `${key}.json`),
      JSON.stringify(questions, null, 2)
    )
  }
  console.log(`Generated ${Object.keys(buckets).length} question bank files`)
}

async function loadRemoteRows(): Promise<HrQuestionRaw[]> {
  const { parquetRead } = await import('hyparquet')
  const buffer = await fetch(HF_PARQUET_URL).then((r) => {
    if (!r.ok) throw new Error(`Failed to download parquet: ${r.status}`)
    return r.arrayBuffer()
  })

  const rows: HrQuestionRaw[] = []
  await parquetRead({
    file: buffer,
    onComplete: (data: Record<string, unknown[]>) => {
      const length = (data.question as unknown[] | undefined)?.length ?? 0
      for (let i = 0; i < length; i++) {
        rows.push({
          question: String(data.question?.[i] ?? ''),
          category: String(data.category?.[i] ?? 'general'),
          role: String(data.role?.[i] ?? ''),
          experience: String(data.experience?.[i] ?? ''),
          difficulty: String(data.difficulty?.[i] ?? 'mid'),
          source_type: String(data.source_type?.[i] ?? ''),
          ideal_answer: String(data.ideal_answer?.[i] ?? ''),
          keywords: Array.isArray(data.keywords?.[i])
            ? (data.keywords[i] as string[])
            : [],
        })
      }
    },
  })
  return rows
}

function bucketRows(rows: HrQuestionRaw[]): Record<string, HrQuestion[]> {
  const buckets: Record<string, HrQuestion[]> = {}

  for (const row of rows) {
    const normalizedRole = normalizeRole(row.role, ROLE_TAXONOMY)
    if (!normalizedRole) continue
    const key = `${normalizedRole}-${row.difficulty.toLowerCase()}`
    if (!buckets[key]) buckets[key] = []
    if (buckets[key].length < CAP_PER_BUCKET) {
      buckets[key].push(toHrQuestion(row, normalizedRole))
    }
  }

  return buckets
}

async function main() {
  const useRemote = process.argv.includes('--remote')

  if (!useRemote) {
    console.log('Using existing seed files in src/data/question-bank (pass --remote to download HF dataset)')
    const { listQuestionBankKeys } = await import('../src/lib/question-bank')
    console.log(`Found ${listQuestionBankKeys().length} question bank buckets`)
    return
  }

  console.log('Downloading HR interview dataset from HuggingFace...')
  const rows = await loadRemoteRows()
  const buckets = bucketRows(rows)

  if (Object.keys(buckets).length === 0) {
    throw new Error('No buckets generated from remote dataset')
  }

  writeBuckets(buckets)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
