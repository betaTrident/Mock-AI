import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

/**
 * Gemini Live Conversation Service
 * Uses gemini-2.5-flash-native-audio-dialog for real-time speech-to-speech
 */
export class LiveConversationService {
  constructor(interviewData) {
    this.interviewData = interviewData
    this.session = null
    this.audioContext = null
    this.mediaStream = null
    this.questionsAsked = 0
    this.maxQuestions = 5
    this.conversationHistory = []
    this.isConnected = false
    this.onTranscriptUpdate = null
    this.onAudioResponse = null
    this.onStateChange = null
  }

  /**
   * Initialize Gemini Live session with native audio
   */
  async initialize() {
    try {
      // Initialize audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Get user media for microphone input
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })

      // For now, use text-based conversation with Gemini
      // The native audio dialog API is still in development
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite" // Fast model for conversation
      })

      // Start chat session
      this.session = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 200, // Keep responses concise
          temperature: 0.9, // Natural conversation
        },
        systemInstruction: {
          parts: [{ text: this.getSystemPrompt() }],
          role: "user"
        }
      })

      this.isConnected = true
      console.log("Gemini conversation session initialized")
      
      return true
    } catch (error) {
      console.error("Failed to initialize Gemini Live:", error)
      throw error
    }
  }

  /**
   * Get system prompt for the interview
   */
  getSystemPrompt() {
    return `You are a professional interviewer conducting a live video interview for the position of ${this.interviewData.role}.

Job Details:
- Role: ${this.interviewData.role}
- Description: ${this.interviewData.description}
- Candidate Experience: ${this.interviewData.experience} years
- Difficulty Level: ${this.interviewData.difficulty}

Your responsibilities:
1. Conduct a natural, conversational interview
2. Ask ${this.maxQuestions} relevant technical and behavioral questions
3. Listen actively and ask follow-up questions when appropriate
4. Keep responses concise and professional
5. Show warmth and encouragement
6. Speak naturally as if in a live video call

Interview Flow:
1. Start with a warm greeting and introduction
2. Ask about their background and experience
3. Progress through technical questions appropriate for their level
4. Conclude professionally when all questions are covered

Keep your responses conversational, natural, and concise. Avoid long monologues.`
  }

  /**
   * Set up event listeners for Live session
   */
  setupEventListeners() {
    // Event listeners for future Live API implementation
    // Currently using text-based chat
  }

  /**
   * Start the conversation with greeting
   */
  async startConversation() {
    if (!this.session || !this.isConnected) {
      throw new Error("Session not initialized")
    }

    try {
      // Send initial prompt to get AI greeting
      const result = await this.session.sendMessage(
        "Please greet the candidate warmly and begin the interview with your first question about their background and experience."
      )

      const response = result.response.text()
      
      // Create AI message
      const message = {
        id: Date.now(),
        role: 'interviewer',
        content: response,
        timestamp: new Date().toISOString()
      }
      
      this.conversationHistory.push(message)
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(message)
      }
      
      // Speak the response using TTS
      if (this.onAudioResponse) {
        this.onAudioResponse(response)
      }

      this.questionsAsked++
    } catch (error) {
      console.error("Failed to start conversation:", error)
      throw error
    }
  }

  /**
   * Send user's spoken response to AI
   */
  async sendUserResponse(transcript) {
    if (!this.session || !this.isConnected) {
      throw new Error("Session not initialized")
    }

    try {
      // Add user message
      const userMessage = {
        id: Date.now(),
        role: 'candidate',
        content: transcript,
        timestamp: new Date().toISOString()
      }
      
      this.conversationHistory.push(userMessage)
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(userMessage)
      }

      // Check if we should end interview
      if (this.questionsAsked >= this.maxQuestions) {
        // Generate closing
        const result = await this.session.sendMessage(
          `The candidate answered: "${transcript}". This was question ${this.questionsAsked} of ${this.maxQuestions}. Please provide a brief, warm closing statement thanking them for their time and letting them know they'll receive feedback shortly.`
        )
        
        const response = result.response.text()
        
        const aiMessage = {
          id: Date.now() + 1,
          role: 'interviewer',
          content: response,
          timestamp: new Date().toISOString()
        }
        
        this.conversationHistory.push(aiMessage)
        
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(aiMessage)
        }
        
        if (this.onAudioResponse) {
          this.onAudioResponse(response)
        }
        
        return { response, isComplete: true }
      }

      // Generate next question or follow-up
      const result = await this.session.sendMessage(
        `The candidate answered: "${transcript}". ${this.questionsAsked < this.maxQuestions ? 'Ask your next relevant interview question.' : 'This is the last question.'}`
      )

      const response = result.response.text()
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'interviewer',
        content: response,
        timestamp: new Date().toISOString()
      }
      
      this.conversationHistory.push(aiMessage)
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(aiMessage)
      }
      
      if (this.onAudioResponse) {
        this.onAudioResponse(response)
      }

      this.questionsAsked++
      
      return { response, isComplete: false }
    } catch (error) {
      console.error("Failed to send user response:", error)
      throw error
    }
  }

  /**
   * Start streaming audio from microphone
   * (Placeholder for future native audio implementation)
   */
  startAudioStreaming() {
    console.log("Audio streaming ready - using Web Speech API for now")
    // Will be implemented when Gemini Live API is available
  }

  /**
   * Stop audio streaming
   */
  stopAudioStreaming() {
    // Placeholder
  }

  /**
   * Play AI audio response
   * (Will be handled by TTS service)
   */
  async playAudioResponse(audioData) {
    // Placeholder - TTS service will handle this
  }

  /**
   * Send text message (for follow-ups or clarifications)
   */
  async sendText(text) {
    if (!this.session) {
      throw new Error("Session not initialized")
    }

    const result = await this.session.sendMessage(text)
    return result.response.text()
  }

  /**
   * Check if interview should end
   */
  shouldEndInterview() {
    return this.questionsAsked >= this.maxQuestions
  }

  /**
   * Get conversation progress
   */
  getProgress() {
    return {
      questionsAsked: this.questionsAsked,
      totalQuestions: this.maxQuestions,
      percentage: (this.questionsAsked / this.maxQuestions) * 100
    }
  }

  /**
   * Get all conversation messages
   */
  getConversationHistory() {
    return this.conversationHistory
  }

  /**
   * End the conversation gracefully
   */
  async endConversation() {
    try {
      if (this.session) {
        await this.session.send({
          text: "Thank you for the interview. Please provide a brief closing statement."
        })
        
        // Wait a moment for response
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        this.session.close()
        this.session = null
      }

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
        this.mediaStream = null
      }

      if (this.audioContext) {
        await this.audioContext.close()
        this.audioContext = null
      }

      this.isConnected = false
      console.log("Conversation session ended")
    } catch (error) {
      console.error("Error ending conversation:", error)
    }
  }
}