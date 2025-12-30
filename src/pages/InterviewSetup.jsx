
import React, { useState, useRef, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Camera, Info, Mic, Briefcase, Code, Clock, BarChart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { createAttempt, hasIncompleteAttempt } from "../services/attemptService"

export default function InterviewSetup() {
  const [hasPermissions, setHasPermissions] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [interviewTip, setInterviewTip] = useState("")
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const interviewId = localStorage.getItem("currentInterviewId")

        if (!interviewId) {
          navigate("/")
          return
        }

        const interviewDoc = await getDoc(doc(db, "interviews", interviewId))

        if (interviewDoc.exists()) {
          setInterviewData(interviewDoc.data())
        } else {
          setError("Interview not found")
          navigate("/")
        }
      } catch (err) {
        console.error("Error fetching interview data:", err)
        setError("Failed to load interview data")
      } finally {
        setLoading(false)
      }
    }

    fetchInterviewData()
  }, [navigate])

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(mediaStream)
      setHasPermissions(true)
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Failed to access camera or microphone")
    }
  }

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const startInterview = async () => {
    if (!hasPermissions) {
      setError("Please enable camera and microphone access first")
      return
    }

    try {
      const interviewId = localStorage.getItem("currentInterviewId")

      // Check for and clean up any incomplete attempts before starting
      const hasIncomplete = await hasIncompleteAttempt(interviewId)
      if (hasIncomplete) {
        console.log("Cleaning up incomplete attempts before starting new one")
      }

      // Create new attempt (this will also clean up any incomplete attempts)
      const attemptId = await createAttempt(interviewId)
      localStorage.setItem("currentAttemptId", attemptId)

      navigate("/interview-page")
    } catch (error) {
      console.error("Error starting interview:", error)
      setError("Failed to start interview. Please try again.")
    }
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  useEffect(() => {
    const tips = [
      "Prepare examples of your past experiences to illustrate your skills.",
      "Practice active listening during the interview.",
      "Research the company beforehand to show your interest.",
      "Prepare thoughtful questions to ask the interviewer.",
      "Be confident and maintain good eye contact.",
    ]
    setInterviewTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview setup...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Let's Get Started</h1>
          <p className="mt-2 text-lg text-gray-600">Prepare for your AI-powered Mock Interview</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Interview Details Card */}
          <div className="bg-white rounded-xl border shadow-md overflow-hidden flex flex-col">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-semibold text-blue-800">Interview Details</h2>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <InterviewDetailItem
                  icon={<Briefcase className="h-6 w-6 text-blue-500" />}
                  title="Job Role/Position"
                  value={interviewData?.role || "N/A"}
                />
                <InterviewDetailItem
                  icon={<Code className="h-6 w-6 text-green-500" />}
                  title="Job Description/Tech Stack"
                  value={interviewData?.description || "N/A"}
                />
                <InterviewDetailItem
                  icon={<Clock className="h-6 w-6 text-yellow-500" />}
                  title="Years of Experience"
                  value={`${interviewData?.experience || "N/A"} years`}
                />
                <InterviewDetailItem
                  icon={<BarChart className="h-6 w-6 text-purple-500" />}
                  title="Interview Difficulty"
                  value={interviewData?.difficulty || "N/A"}
                  badge
                />
              </div>
              <div className="mt-auto pt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Interview Tip:</h3>
                  <p className="text-sm text-blue-600">{interviewTip}</p>
                </div>
                <button
                  onClick={startInterview}
                  className="w-full px-6 py-3 text-sm font-medium text-white bg-black  hover:bg-gray-800 rounded-md transition-colors"
                  disabled={!hasPermissions}
                >
                  Start Interview
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Camera Preview Card */}
            <div className="bg-white rounded-xl border shadow-md overflow-hidden">
              <div className="bg-white-50 p-4">
                <h2 className="text-xl font-semibold text-black">Camera Preview</h2>
              </div>
              <div className="aspect-video bg-gray-100 relative">
                {hasPermissions ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Alert */}
            <div className="flex gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm shadow-sm">
              <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700">
                Enable Video Web Cam and Microphone to start your AI-generated Mock Interview. You'll answer 5 questions
                and receive a report based on your responses. <br />
                Note: We never record your video. Feel free to turn off your camera; you can disable webcam access at
                any time.
              </p>
            </div>

            {/* Controls Card */}
            <div className="bg-white rounded-xl border shadow-md">
              <div className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <Camera className="h-5 w-5 text-black" />
                    <Mic className="h-5 w-5 text-black" />
                    <span className="font-medium">Enable Web Cam and Microphone</span>
                  </div>
                  {!hasPermissions && (
                    <button
                      onClick={startWebcam}
                      className="w-full md:w-auto px-20 py-3 text-sm font-medium text-white bg-black  hover:bg-gray-800 disabled:opacity-50 rounded-md transition-colors"
                    >
                      Enable Devices
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InterviewDetailItem({ icon, title, value, badge = false }) {
  return (
    <div className="flex items-start space-x-3">
      {icon}
      <div>
        <h3 className="text-sm font-semibold text-gray-700">{title}:</h3>
        {badge ? (
          <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-800">
            {value}
          </span>
        ) : (
          <p className="text-sm text-gray-600">{value}</p>
        )}
      </div>
    </div>
  )
}

