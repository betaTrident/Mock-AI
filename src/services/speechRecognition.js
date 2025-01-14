export class SpeechRecognitionService {
    constructor() {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  
    startRecording(onResult, onEnd) {
      let finalTranscript = '';
  
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
  
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
  
        onResult(finalTranscript, interimTranscript);
      };
  
      this.recognition.onend = () => {
        onEnd(finalTranscript);
      };
  
      this.recognition.start();
    }
  
    stopRecording() {
      this.recognition.stop();
    }
  }
  
  