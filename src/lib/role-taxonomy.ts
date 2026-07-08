export const ROLE_TAXONOMY: Record<string, string[]> = {
  frontend: [
    'frontend',
    'front-end',
    'react',
    'vue',
    'angular',
    'ui developer',
    'web developer',
    'javascript developer',
    'next.js',
  ],
  backend: [
    'backend',
    'back-end',
    'node',
    'python developer',
    'java developer',
    'golang',
    'django',
    'express',
    'api developer',
    'server-side',
  ],
  fullstack: [
    'fullstack',
    'full stack',
    'full-stack',
    'software engineer',
    'swe',
    'software developer',
    'web engineer',
  ],
  'data-science': [
    'data scientist',
    'machine learning',
    'ml engineer',
    'ai engineer',
    'data analyst',
    'nlp engineer',
    'deep learning',
  ],
  devops: [
    'devops',
    'sre',
    'platform engineer',
    'cloud engineer',
    'infrastructure',
    'kubernetes',
    'docker',
    'ci/cd',
    'aws engineer',
  ],
  product: ['product manager', 'pm', 'product owner', 'po', 'product lead'],
  design: ['designer', 'ux', 'ui/ux', 'product designer', 'ux researcher'],
  general: [],
}

export function normalizeRole(
  input: string,
  taxonomy: typeof ROLE_TAXONOMY = ROLE_TAXONOMY
): string {
  const lower = input.toLowerCase().trim()
  for (const [bucket, keywords] of Object.entries(taxonomy)) {
    if (bucket === 'general') continue
    if (keywords.some((kw) => lower.includes(kw))) return bucket
  }
  return 'general'
}
