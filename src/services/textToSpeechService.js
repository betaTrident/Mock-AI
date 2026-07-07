/**
 * Text-to-Speech Service using Web Speech API
 * Fallback service for speaking AI responses
 */
export class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.currentUtterance = null
  }

  /**
   * Initialize the service and preload voices
   */
  async initialize() {
    return new Promise((resolve) => {
      // Load voices
      const loadVoices = () => {
        this.voices = this.synth.getVoices()
        if (this.voices.length > 0) {
          console.log("Voices loaded:", this.voices.length)
          resolve(true)
        }
      }

      loadVoices()
      
      // Chrome loads voices asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices
      }
      
      // Fallback in case voices are already loaded
      setTimeout(() => resolve(true), 100)
    })
  }

  /**
   * Speak the given text using Web Speech API
   */
  async speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.stop()

        const utterance = new SpeechSynthesisUtterance(text)
        this.currentUtterance = utterance

        // Configure voice settings
        const voice = this.voices.find(v => 
          v.name.includes(options.voice || 'Google') || 
          v.name.includes('Microsoft') ||
          v.lang.startsWith('en')
        ) || this.voices[0]

        if (voice) {
          utterance.voice = voice
        }

        utterance.rate = options.rate || 1.0
        utterance.pitch = options.pitch || 1.0
        utterance.volume = options.volume !== undefined ? options.volume : 1.0
        utterance.lang = options.lang || 'en-US'

        utterance.onend = () => {
          this.currentUtterance = null
          resolve(true)
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          this.currentUtterance = null
          // Don't reject on 'interrupted' errors as they're expected when stopping
          if (event.error === 'interrupted') {
            resolve(false)
          } else {
            reject(event)
          }
        }

        this.synth.speak(utterance)
      } catch (error) {
        console.error("TTS Error:", error)
        reject(error)
      }
    })
  }

  /**
   * Stop any currently playing speech
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel()
    }
    this.currentUtterance = null
  }

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this.synth.speaking
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stop()
  }
}
