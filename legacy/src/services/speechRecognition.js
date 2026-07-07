export class SpeechRecognitionService {
    constructor() {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.isRecording = false;
    }
  
    startRecording(onResult, onEnd) {
      // Prevent starting if already recording
      if (this.isRecording) {
        console.warn('Speech recognition already running');
        return;
      }

      let finalTranscript = '';
      let silenceTimer = null;
      const SILENCE_THRESHOLD = 2000; // 2 seconds of silence
  
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
  
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            
            // Reset silence timer on new final result
            if (silenceTimer) clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
              if (this.isRecording && finalTranscript.trim()) {
                this.stopRecording();
              }
            }, SILENCE_THRESHOLD);
          } else {
            interimTranscript += transcript;
          }
        }
  
        onResult(finalTranscript, interimTranscript);
      };
  
      this.recognition.onend = () => {
        this.isRecording = false;
        if (silenceTimer) clearTimeout(silenceTimer);
        onEnd(finalTranscript);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isRecording = false;
        if (silenceTimer) clearTimeout(silenceTimer);
      };
  
      try {
        this.recognition.start();
        this.isRecording = true;
        console.log('Started speech recognition');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        this.isRecording = false;
      }
    }
  
    stopRecording() {
      if (this.isRecording) {
        try {
          this.recognition.stop();
          this.isRecording = false;
          console.log('Stopped speech recognition');
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    }
  }
