export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis
    }
  }

  isSupported(): boolean {
    return this.synth !== null
  }

  async initialize(): Promise<boolean> {
    if (!this.synth) return false

    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth!.getVoices()
        if (this.voices.length > 0) resolve(true)
      }
      loadVoices()
      if (this.synth!.onvoiceschanged !== undefined) {
        this.synth!.onvoiceschanged = loadVoices
      }
      setTimeout(() => resolve(true), 100)
    })
  }

  async speak(text: string): Promise<boolean> {
    if (!this.synth) return false

    return new Promise((resolve, reject) => {
      this.stop()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice =
        this.voices.find((v) => v.name.includes('Google') || v.lang.startsWith('en')) ??
        this.voices[0]
      if (voice) utterance.voice = voice
      utterance.rate = 1
      utterance.lang = 'en-US'
      utterance.onend = () => resolve(true)
      utterance.onerror = (event) => {
        if (event.error === 'interrupted') resolve(false)
        else reject(event)
      }
      this.synth!.speak(utterance)
    })
  }

  stop() {
    if (this.synth?.speaking) this.synth.cancel()
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false
  }
}
