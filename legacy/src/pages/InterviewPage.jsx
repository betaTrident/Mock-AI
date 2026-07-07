
import { useState, useRef, useEffect } from "react"
import { Mic, Video, VideoOff, Loader2, MicOff } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/ui/Navbar"
import TranscriptPanel from "../components/TranscriptPanel"
import { LiveConversationService } from "../services/liveConversationService"
import { TextToSpeechService } from "../services/textToSpeechService"
import { SpeechRecognitionService } from "../services/speechRecognition"
import { saveAnswer } from "../services/answerService"
import { useInterviewToast } from "./interviewToast"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { createAttempt, completeAttempt } from "../services/attemptService"
import { BeforeUnloadDialog } from "../components/ui/before-unload-dialog"

export default function InterviewPage() {
  // Conversation state
  const [messages, setMessages] = useState([])
  const [conversationState, setConversationState] = useState('idle') // idle, ai-speaking, listening, processing
  const [interimTranscript, setInterimTranscript] = useState("")
  
  // Interview state
  const [isLoading, setIsLoading] = useState(true)
  const [isEndingInterview, setIsEndingInterview] = useState(false)
  const [interviewInProgress, setInterviewInProgress] = useState(false)
  
  // Camera/Audio state
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [stream, setStream] = useState(null)
  
  // Navigation dialog state
  const [showNavigationDialog, setShowNavigationDialog] = useState(false)
  
  // Refs
  const videoRef = useRef(null)
  const liveConversation = useRef(null)
  const ttsService = useRef(null)
  const speechRecognition = useRef(null)
  const beforeUnloadRef = useRef(null)
  
  const { ToastContainer, showToast } = useInterviewToast()
  const navigate = useNavigate()

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (interviewInProgress && messages.length > 0) {
        event.preventDefault()
        window.history.pushState(null, '', window.location.href)
        setShowNavigationDialog(true)
      }
    }

    if (interviewInProgress && messages.length > 0) {
      window.history.pushState(null, '', window.location.href)
      window.addEventListener('popstate', handlePopState)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [interviewInProgress, messages.length])

  useEffect(() => {         
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("User authenticated:", authUser.uid)
      } else {
        console.log("No user authenticated")
        showToast("Please log in to access the interview", "error")
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleConfirmNavigation = () => {
    setInterviewInProgress(false)
    setShowNavigationDialog(false)
    // Allow navigation by going back
    window.history.back()
  }

  const handleCancelNavigation = () => {
    setShowNavigationDialog(false)
  }

  const initializeInterview = async () => {
    setIsLoading(true)
    try {
      const interviewId = localStorage.getItem("currentInterviewId")
      const interviewDoc = await getDoc(doc(db, "interviews", interviewId))

      if (!interviewDoc.exists()) {
        throw new Error("Interview not found")
      }

      const data = interviewDoc.data()

      // Create a new attempt
      const attemptId = await createAttempt(interviewId)
      localStorage.setItem("currentAttemptId", attemptId)

      // Initialize Gemini conversation service
      liveConversation.current = new LiveConversationService(data)
      
      // Set up event listeners for transcript updates
      liveConversation.current.onTranscriptUpdate = (message) => {
        setMessages(prev => [...prev, message])
        
        // Save candidate answers automatically
        if (message.role === 'candidate') {
          const interviewId = localStorage.getItem("currentInterviewId")
          const attemptId = localStorage.getItem("currentAttemptId")
          const questionNumber = messages.filter(m => m.role === 'interviewer').length - 1
          const lastQuestion = messages.filter(m => m.role === 'interviewer').pop()
          
          saveAnswer(interviewId, attemptId, questionNumber, message.content, lastQuestion?.content || "Interview Question")
            .catch(err => console.error("Error saving answer:", err))
        }
      }
      
      // Set up audio response handler (speak the AI response)
      liveConversation.current.onAudioResponse = async (text) => {
        await ttsService.current.speak(text)
        setConversationState('listening')
      }
      
      // Set up state change listener
      liveConversation.current.onStateChange = (newState) => {
        setConversationState(newState)
      }

      // Initialize TTS service
      ttsService.current = new TextToSpeechService()
      await ttsService.current.initialize()
      
      // Initialize speech recognition
      speechRecognition.current = new SpeechRecognitionService()

      setInterviewInProgress(true)
      setIsLoading(false)

      // Start the conversation
      await startLiveConversation()
    } catch (error) {
      console.error("Error initializing interview:", error)
      showToast(`Failed to initialize interview: ${error.message}`, "error")
      setIsLoading(false)
    }
  }

  /**
   * Start the live conversation with Gemini
   */
  const startLiveConversation = async () => {
    try {
      if (!liveConversation.current) {
        throw new Error("Live conversation service not initialized")
      }

      // Initialize Gemini session
      await liveConversation.current.initialize()
      
      setConversationState('ai-speaking')
      
      // Start the conversation (AI will greet and ask first question)
      await liveConversation.current.startConversation()
      
      console.log("Conversation started - AI speaking greeting")
    } catch (error) {
      console.error("Error starting live conversation:", error)
      showToast("Failed to start conversation", "error")
      setConversationState('idle')
    }
  }
  
  /**
   * Start listening for user response
   */
  const startListening = () => {
    if (conversationState !== 'idle' && conversationState !== 'listening') {
      return
    }

    setConversationState('listening')
    setInterimTranscript("")

    speechRecognition.current.startRecording(
      (finalTranscript, interim) => {
        setInterimTranscript(interim)
      },
      async (finalTranscript) => {
        // User finished speaking - process response
        await handleUserResponse(finalTranscript)
      }
    )
  }
  
  /**
   * Handle user's spoken response
   */
  const handleUserResponse = async (transcript) => {
    if (!transcript || transcript.trim().length === 0) {
      startListening()
      return
    }

    setInterimTranscript("")
    setConversationState('processing')

    try {
      // Send response to AI and get next question
      const { isComplete } = await liveConversation.current.sendUserResponse(transcript)
      
      if (isComplete) {
        // Interview complete
        setTimeout(() => completeInterviewSession(), 3000)
      } else {
        // Continue - AI response will be spoken via TTS callback
        setConversationState('ai-speaking')
      }
    } catch (error) {
      console.error("Error handling user response:", error)
      showToast("Failed to process your response", "error")
      setConversationState('idle')
    }
  }

  /**
   * Complete the interview session
   */
  const completeInterviewSession = async () => {
    try {
      setIsEndingInterview(true)
      setConversationState('idle')
      
      const interviewId = localStorage.getItem("currentInterviewId")
      const attemptId = localStorage.getItem("currentAttemptId")

      // Calculate and save scores
      await completeAttempt(interviewId, attemptId)

      setInterviewInProgress(false)
      
      // Show completion message
      showToast("Interview completed! Redirecting to feedback...", "success")
      
      // Navigate to feedback after delay
      setTimeout(() => {
        navigate("/feedback")
      }, 2000)
    } catch (error) {
      console.error("Error completing interview:", error)
      showToast("Failed to complete interview", "error")
      setIsEndingInterview(false)
    }
  }

  // Camera initialization
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        showToast("Unable to access camera. Please check your permissions.", "error")
        setIsCameraOn(false)
      }
    }
    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      
      // Cleanup Gemini Live session
      if (liveConversation.current) {
        liveConversation.current.endConversation()
      }
      
      // Cleanup TTS service
      if (ttsService.current) {
        ttsService.current.cleanup()
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    initializeInterview()
  }, [])

  // Camera initialization
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        showToast("Unable to access camera. Please check your permissions.", "error")
        setIsCameraOn(false)
      }
    }
    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      
      // Cleanup Gemini Live session
      if (liveConversation.current) {
        liveConversation.current.endConversation()
      }
      
      // Cleanup TTS service
      if (ttsService.current) {
        ttsService.current.cleanup()
      }
    }
  }, [])

  const toggleCamera = () => {
    setIsCameraOn((prevState) => {
      const newState = !prevState
      if (stream) {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = newState
        })
      }
      return newState
    })
  }

  const toggleMicrophone = () => {
    // With Gemini Live API, audio streaming is always on
    // This button now just mutes/unmutes (for future implementation)
    // The AI handles turn-taking automatically
    showToast("Microphone is always active during live interview", "info")
  }

  const endInterview = async () => {
    const confirmEnd = window.confirm("Are you sure you want to end the interview? Your progress will be saved.")
    if (!confirmEnd) return

    try {
      setIsEndingInterview(true)
      
      // End the Gemini Live conversation gracefully
      if (liveConversation.current) {
        await liveConversation.current.endConversation()
      }
      
      await completeInterviewSession()
    } catch (error) {
      console.error("Error ending interview:", error)
      showToast("Failed to end interview properly", "error")
      setIsEndingInterview(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Preparing your interview...</p>
        </div>
      </div>
    )
  }

  if (isEndingInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Finalizing your interview...</p>
        </div>
      </div>
    )
  }

  const progress = liveConversation.current?.getProgress() || { questionsAsked: 0, totalQuestions: 5, percentage: 0 }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <BeforeUnloadDialog 
        ref={beforeUnloadRef}
        hasUnsavedChanges={interviewInProgress && messages.length > 0}
        externalShowDialog={showNavigationDialog}
        onConfirmLeave={handleConfirmNavigation}
        onCancelLeave={handleCancelNavigation}
      />
      <Navbar />
      <ToastContainer />
      
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          
          {/* Left Side - Video Feed & Controls */}
          <div className="bg-white rounded-xl border shadow-lg flex flex-col">
            {/* Video Feed */}
            <div className="relative flex-1 bg-gray-900 rounded-t-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${!isCameraOn ? "invisible" : "visible"}`}
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="h-24 w-24 text-gray-600" />
                </div>
              )}

              {/* AI Status Indicator */}
              {conversationState === 'ai-speaking' && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  AI is speaking...
                </div>
              )}

              {conversationState === 'listening' && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Listening...
                </div>
              )}

              {conversationState === 'processing' && (
                <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing...
                </div>
              )}

              {/* Progress Bar */}
              {progress && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 p-3">
                  <div className="flex items-center justify-between text-white text-xs mb-1">
                    <span>Interview Progress</span>
                    <span>{progress.questionsAsked} / {progress.totalQuestions} questions</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 rounded-b-xl border-t">
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleCamera} 
                  className={`p-3 rounded-lg border transition-colors ${
                    isCameraOn 
                      ? 'border-gray-300 hover:bg-gray-100' 
                      : 'border-red-300 bg-red-50 text-red-600'
                  }`}
                  title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                >
                  {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>

                <button 
                  onClick={toggleMicrophone}
                  disabled={conversationState === 'ai-speaking' || conversationState === 'processing'}
                  className={`p-3 rounded-lg border transition-colors ${
                    conversationState === 'listening'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={conversationState === 'listening' ? "Stop listening" : "Start listening"}
                >
                  {conversationState === 'listening' ? (
                    <Mic className="h-5 w-5" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </button>

                <button 
                  onClick={endInterview}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  End Interview
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Live Transcript */}
          <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
            <TranscriptPanel 
              messages={messages}
              isAISpeaking={conversationState === 'ai-speaking'}
              isProcessing={conversationState === 'processing'}
              interimTranscript={interimTranscript}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

