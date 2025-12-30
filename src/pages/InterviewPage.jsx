
import React, { useState, useRef, useEffect } from "react"
import { Volume2, Mic, Video, VideoOff, Loader2 } from "lucide-react"
import { doc, getDoc, collection, getDocs, addDoc, writeBatch } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { generateQuestions } from "../services/questionGenerator"
import { SpeechRecognitionService } from "../services/speechRecognition"
import { saveAnswer } from "../services/answerService"
import { useInterviewToast } from "./interviewToast"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { createAttempt, completeAttempt } from "../services/attemptService"

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [stream, setStream] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isEndingInterview, setIsEndingInterview] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set())
  const [currentAttemptId, setCurrentAttemptId] = useState(null) // Added state for attempt ID
  const videoRef = useRef(null)
  const speechRecognition = useRef(null)
  const { ToastContainer, showToast } = useInterviewToast()
  const navigate = useNavigate()

  useEffect(() => {         
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        console.log("User authenticated:", user.uid)
      } else {
        console.log("No user authenticated")
        showToast("Please log in to access the interview", "error")
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const initializeInterview = async (forceNewQuestions = false) => {
    setIsLoading(true)
    try {
      const interviewId = localStorage.getItem("currentInterviewId")
      const interviewDoc = await getDoc(doc(db, "interviews", interviewId))

      if (!interviewDoc.exists()) {
        throw new Error("Interview not found")
      }

      const interviewData = interviewDoc.data()

      // Create a new attempt
      const attemptId = await createAttempt(interviewId)
      setCurrentAttemptId(attemptId)
      localStorage.setItem("currentAttemptId", attemptId)

      // If forcing new questions (retake), delete existing questions
      if (forceNewQuestions) {
        const questionsSnapshot = await getDocs(
          collection(db, "interviews", interviewId, "attempts", currentAttemptId, "questions"),
        )
        const batch = writeBatch(db)

        // Delete all existing questions
        questionsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
      }

      // Generate new questions
      const interviewQuestions = await generateQuestions(interviewData)

      // Save new questions to Firestore
      const batch = writeBatch(db)
      interviewQuestions.forEach((question, index) => {
        const questionRef = doc(collection(db, "interviews", interviewId, "attempts", attemptId, "questions"))
        batch.set(questionRef, { ...question, order: index })
      })
      await batch.commit()

      setQuestions(interviewQuestions)
      setCurrentQuestion(0)
      setAnsweredQuestions(new Set())

      speechRecognition.current = new SpeechRecognitionService()
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing interview:", error)
      showToast(`Failed to initialize interview: ${error.message}`, "error")
      setIsLoading(false)
    }
  }

  // Initial load - use existing questions if available
  useEffect(() => {
    initializeInterview(false)
  }, [])

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
    }
  }, [])

  const speakQuestion = () => {
    const speech = new SpeechSynthesisUtterance(questions[currentQuestion]?.question)
    window.speechSynthesis.speak(speech)
  }

  const startRecording = () => {
    setIsRecording(true)
    setTranscript("")
    setInterimTranscript("")

    speechRecognition.current.startRecording(
      (finalTranscript, interim) => {
        setTranscript(finalTranscript)
        setInterimTranscript(interim)
      },
      async (finalTranscript) => {
        setIsRecording(false)
        try {
          const interviewId = localStorage.getItem("currentInterviewId")
          const attemptId = localStorage.getItem("currentAttemptId")
          await saveAnswer(interviewId, attemptId, currentQuestion, finalTranscript, questions[currentQuestion])

          setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion))

          showToast(`Your answer has been saved.`)

          // Automatically move to the next question after a short delay
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion((prev) => prev + 1)
            } else {
              showToast("You've answered all questions. You can now end the interview.")
            }
          }, 2000)
        } catch (error) {
          console.error("Error saving answer:", error)
          showToast(`Failed to save your answer: ${error.message}`, "error")
        }
      },
    )
  }

  const stopRecording = () => {
    speechRecognition.current.stopRecording()
  }

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

  const endInterview = async () => {
    if (answeredQuestions.size < questions.length) {
      showToast("Please answer all questions before ending the interview.", "error")
      return
    }
    setIsEndingInterview(true)
    try {
      const interviewId = localStorage.getItem("currentInterviewId")
      const attemptId = localStorage.getItem("currentAttemptId")

      // Calculate and update the attempt score
      const averageScore = await completeAttempt(interviewId, attemptId)

      // Navigate to feedback page
      navigate("/feedback")
    } catch (error) {
      console.error("Error completing attempt:", error)
      showToast(`Failed to complete the interview: ${error.message}`, "error")
    } finally {
      setIsEndingInterview(false)
    }
  }

  const retakeInterview = async () => {
    try {
      setIsLoading(true)

      // Clear all state
      setQuestions([])
      setAnsweredQuestions(new Set())
      setCurrentQuestion(0)
      setTranscript("")
      setInterimTranscript("")

      // Initialize with forced new questions
      await initializeInterview(true)

      showToast("Interview reset successfully. New questions generated.", "success")
    } catch (error) {
      console.error("Error retaking interview:", error)
      showToast(`Failed to retake interview: ${error.message}`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Preparing your interview questions...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      <ToastContainer />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Questions */}
          <div className="bg-white rounded-xl border shadow-lg flex flex-col">
            <div className="flex-1 p-4 sm:p-6">
              {/* Question Tabs */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        currentQuestion === index
                          ? "bg-black text-white"
                          : answeredQuestions.has(index)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    Question {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="min-h-[100px]">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">{questions[currentQuestion]?.question}</h2>
                  <button
                    onClick={speakQuestion}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto">
                  {isRecording ? (
                    <>
                      <p className="text-sm text-gray-600">{interimTranscript}</p>
                      <p className="text-sm font-medium">{transcript}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Your answer will appear here...</p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Note:</h3>
                  <p className="text-sm text-blue-700">
                    Click on Record Answer when you're ready to answer the question. Your answer will be automatically
                    saved when you finish speaking.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                  <button
                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className={`w-full sm:w-auto px-4 py-2 rounded-md border border-black text-sm font-medium
                      ${currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                  >
                    Previous Question
                  </button>
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={endInterview}
                      disabled={answeredQuestions.size < questions.length}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white
                        ${
                          answeredQuestions.size < questions.length
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                      End Interview
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion((prev) => prev + 1)}
                      className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium bg-black hover:bg-gray-800 text-white"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Video */}
          <div className="bg-white rounded-xl border shadow-lg flex flex-col">
            <div className="flex-1 p-4 sm:p-6 flex flex-col">
              <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden">
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
              </div>

              <div className="flex justify-between items-center mt-4">
                <button onClick={toggleCamera} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Video className="h-5 w-5" />
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Mic className={`h-5 w-5 ${isRecording ? "text-red-500" : "text-gray-600"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

