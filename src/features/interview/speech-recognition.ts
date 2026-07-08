type SpeechRecognitionCtor = new () => SpeechRecognition

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isRecording = false

  constructor() {
    const Ctor = getSpeechRecognition()
    if (!Ctor) return
    this.recognition = new Ctor()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
  }

  isSupported(): boolean {
    return this.recognition !== null
  }

  startRecording(
    onResult: (finalTranscript: string, interimTranscript: string) => void,
    onEnd: (finalTranscript: string) => void
  ) {
    if (!this.recognition || this.isRecording) return

    let finalTranscript = ''
    let silenceTimer: ReturnType<typeof setTimeout> | null = null
    const SILENCE_THRESHOLD = 2000

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
          if (silenceTimer) clearTimeout(silenceTimer)
          silenceTimer = setTimeout(() => {
            if (this.isRecording && finalTranscript.trim()) {
              this.stopRecording()
            }
          }, SILENCE_THRESHOLD)
        } else {
          interimTranscript += transcript
        }
      }
      onResult(finalTranscript, interimTranscript)
    }

    this.recognition.onend = () => {
      this.isRecording = false
      if (silenceTimer) clearTimeout(silenceTimer)
      onEnd(finalTranscript)
    }

    this.recognition.onerror = () => {
      this.isRecording = false
      if (silenceTimer) clearTimeout(silenceTimer)
    }

    this.recognition.start()
    this.isRecording = true
  }

  stopRecording() {
    if (!this.recognition || !this.isRecording) return
    this.recognition.stop()
    this.isRecording = false
  }

  get recording() {
    return this.isRecording
  }
}
