"use client"

import { useState, useRef, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import {
  Camera,
  Info,
  Mic,
  Briefcase,
  Code,
  Clock,
  BarChart,
  CheckCircle2,
  Play,
  Video,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/ui/Navbar"
import { createAttempt, hasIncompleteAttempt } from "../../backend/services/attemptService"

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading interview setup...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md border border-gray-200">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-red-600 mb-6 text-sm">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Interview Setup</h1>
              <p className="text-sm text-gray-600">Review your interview details and enable your devices</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Ready to start</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Interview Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  Interview Details
                </h2>
              </div>

              {/* Details Grid */}
              <div className="p-5">
                <div className="space-y-3 mb-6">
                  <InterviewDetailItem
                    icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                    title="Job Role/Position"
                    value={interviewData?.role || "N/A"}
                  />
                  <InterviewDetailItem
                    icon={<Code className="h-5 w-5 text-emerald-600" />}
                    title="Job Description/Tech Stack"
                    value={interviewData?.description || "N/A"}
                  />
                  <InterviewDetailItem
                    icon={<Clock className="h-5 w-5 text-amber-600" />}
                    title="Years of Experience"
                    value={`${interviewData?.experience || "N/A"} years`}
                  />
                  <InterviewDetailItem
                    icon={<BarChart className="h-5 w-5 text-purple-600" />}
                    title="Interview Difficulty"
                    value={interviewData?.difficulty || "N/A"}
                    badge
                  />
                </div>

                {/* Start Button */}
                <button
                  onClick={startInterview}
                  className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors disabled:transform-none flex items-center justify-center gap-2"
                  disabled={!hasPermissions}
                >
                  <Play className="h-4 w-4" />
                  Start Interview
                </button>
                {!hasPermissions && (
                  <p className="text-xs text-center text-gray-500 mt-3">Enable camera and microphone to start</p>
                )}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 text-xs mb-1">Interview Tip</h3>
                  <p className="text-xs text-amber-800 leading-relaxed">{interviewTip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Camera & Setup */}
          <div className="space-y-6 flex flex-col">
            {/* Camera Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-600" />
                  Camera Preview
                </h2>
              </div>
              <div className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
                  {hasPermissions ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500 text-white px-2.5 py-1 rounded-md text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Live
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">Camera not enabled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permission Setup */}
            {!hasPermissions ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Camera className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Mic className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Enable Permissions</h3>
                      <p className="text-xs text-gray-600">Allow camera & microphone access</p>
                    </div>
                    <button
                      onClick={startWebcam}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Enable Devices
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-900 text-xs">Ready to begin</h3>
                    <p className="text-xs text-emerald-700 mt-0.5">Devices enabled</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Shield className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 text-xs mb-1">Privacy First</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We never record or store your video. You can disable access anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <FeatureBox
            icon={<Zap className="h-5 w-5" />}
            title="AI-Powered Questions"
            description="Personalized questions for your role"
          />
          <FeatureBox
            icon={<BarChart className="h-5 w-5" />}
            title="Detailed Feedback"
            description="Comprehensive analysis of responses"
          />
          <FeatureBox
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Track Progress"
            description="Monitor improvement over time"
          />
        </div>
      </div>
    </div>
  )
}

function InterviewDetailItem({ icon, title, value, badge = false }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
        {icon}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-xs font-medium text-gray-600 mb-0.5">{title}</h3>
        {badge ? (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {value}
          </span>
        ) : (
          <p className="text-sm text-gray-900 font-medium truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

function FeatureBox({ icon, title, description }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-2">{icon}</div>
      <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
