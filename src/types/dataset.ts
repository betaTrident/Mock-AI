export interface HrQuestion {
  question: string
  category: string
  idealAnswer: string
  keywords: string[]
  difficulty: string
  role: string
}

export interface HrQuestionRaw {
  question: string
  category: string
  role: string
  experience: string
  difficulty: string
  source_type: string
  ideal_answer: string
  keywords: string[]
}
