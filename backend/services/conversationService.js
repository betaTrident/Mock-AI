import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export class ConversationManager {
  constructor(interviewData) {
    this.interviewData = interviewData
    this.conversationHistory = []
    this.questionsAsked = 0
    this.maxQuestions = 5
    this.currentTopic = null
  }

  /**
   * Generate the initial greeting and first question
   */
  async generateGreeting() {
    const prompt = `You are a professional interviewer conducting a live interview for the position of ${this.interviewData.role}.

Job Description: ${this.interviewData.description}
Candidate Experience: ${this.interviewData.experience} years
Interview Difficulty: ${this.interviewData.difficulty}

Your task:
1. Greet the candidate warmly and professionally
2. Briefly introduce yourself as the AI interviewer
3. Ask your first relevant question about their background

Keep your response natural and conversational. Speak as if you're in a live video interview.
Keep it concise (2-3 sentences for greeting, then 1 question).

Format your response naturally, do not use labels like "Greeting:" or "Question:". Just speak naturally.`

    // Use flash-lite for high-frequency conversation calls during interview
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    this.questionsAsked++
    return response
  }

  /**
   * Generate the next question or follow-up based on the candidate's answer
   */
  async generateNextResponse(candidateAnswer) {
    // Build conversation context
    const conversationContext = this.conversationHistory
      .map(msg => `${msg.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
      .join('\n')

    const shouldAskFollowUp = this.shouldAskFollowUp(candidateAnswer)
    
    let prompt

    if (shouldAskFollowUp) {
      // Ask a follow-up question
      prompt = `You are a professional interviewer. The candidate just answered:

"${candidateAnswer}"

Previous conversation:
${conversationContext}

Ask ONE relevant follow-up question to dig deeper into their answer. Keep it natural and conversational.
Make it feel like a real conversation, not an interrogation. Be encouraging.

Response should be 1-2 sentences maximum.`
    } else if (this.questionsAsked < this.maxQuestions) {
      // Move to next main question
      prompt = `You are a professional interviewer conducting a live interview for the position of ${this.interviewData.role}.

Job Description: ${this.interviewData.description}
Candidate Experience: ${this.interviewData.experience} years

Candidate's last answer: "${candidateAnswer}"

Previous conversation:
${conversationContext}

Questions asked so far: ${this.questionsAsked} out of ${this.maxQuestions}

Your task:
1. Briefly acknowledge their answer (1 sentence, be positive/encouraging)
2. Smoothly transition to the next question
3. Ask your next relevant interview question

Keep it natural and conversational. Total response should be 2-3 sentences.`
      
      this.questionsAsked++
    } else {
      // Closing the interview
      prompt = `You are a professional interviewer concluding the interview.

The candidate just said: "${candidateAnswer}"

This was the final question. Now:
1. Thank them for their time
2. Briefly summarize 1-2 positive things about the interview
3. Explain that they'll receive feedback shortly
4. End on a positive, encouraging note

Keep it warm, professional, and concise (3-4 sentences).`
    }

    // Use flash-lite for all conversation responses
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return {
      response,
      isComplete: this.questionsAsked >= this.maxQuestions,
      questionsAsked: this.questionsAsked,
      totalQuestions: this.maxQuestions
    }
  }

  /**
   * Determine if we should ask a follow-up question
   */
  shouldAskFollowUp(answer) {
    // Simple heuristic: if answer is short (< 50 words), ask follow-up
    const wordCount = answer.trim().split(/\s+/).length
    const isShort = wordCount < 50
    
    // Only ask follow-up 30% of the time to keep interview moving
    const shouldFollowUp = isShort && Math.random() < 0.3
    
    return shouldFollowUp
  }

  /**
   * Add a message to conversation history
   */
  addMessage(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Get conversation progress
   */
  getProgress() {
    return {
      questionsAsked: this.questionsAsked,
      totalQuestions: this.maxQuestions,
      percentage: Math.round((this.questionsAsked / this.maxQuestions) * 100)
    }
  }

  /**
   * Check if interview is complete
   */
  isInterviewComplete() {
    return this.questionsAsked >= this.maxQuestions
  }
}
