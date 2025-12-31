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
import Navbar from "./Navbar"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading interview setup...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />

      {/* Header Section */}
      <div className="border-b border-slate-200/50 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-3 font-medium text-xs text-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Interview Preparation</span>
              </div>
              <h1 className="text-4xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">Let's Get Started</h1>
              <p className="text-lg text-slate-600">Prepare for your AI-powered mock interview with confidence</p>
            </div>
            <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border border-blue-200">
              <Zap className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Interview Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
              {/* Card Header */}
              <div className="px-6 py-6 border-b border-slate-200/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  Interview Details
                </h2>
              </div>

              {/* Details Grid */}
              <div className="p-6">
                <div className="space-y-4 mb-8">
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

                {/* Pro Tip Box */}
                <div className="mb-6 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 rounded-xl">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1 text-sm">Pro Tip</h3>
                      <p className="text-sm text-amber-800 leading-relaxed">{interviewTip}</p>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startInterview}
                  className="w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
                  disabled={!hasPermissions}
                >
                  <Play className="h-5 w-5" />
                  Start Interview Now
                </button>
                {!hasPermissions && (
                  <p className="text-xs text-center text-slate-500 mt-3">✓ Enable camera and microphone to start</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Camera & Setup */}
          <div className="space-y-8 flex flex-col">
            {/* Camera Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-5 border-b border-slate-200/50">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-slate-600" />
                  </div>
                  Camera Preview
                </h2>
              </div>
              <div className="p-5">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl relative overflow-hidden shadow-inner border border-slate-300">
                  {hasPermissions ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Live
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-slate-300 rounded-2xl flex items-center justify-center mb-4">
                        <Camera className="h-10 w-10 text-slate-500" />
                      </div>
                      <p className="text-slate-600 font-semibold text-sm">Camera not enabled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permission Setup */}
            {!hasPermissions ? (
              <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Camera className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Mic className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-900 mb-1 text-base">Enable Permissions</h3>
                      <p className="text-sm text-slate-600">Allow camera & microphone access</p>
                    </div>
                    <button
                      onClick={startWebcam}
                      className="w-full px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Enable Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-sm">Ready to begin</h3>
                    <p className="text-xs text-emerald-700 mt-1">Devices enabled and ready</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Privacy First</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We never record or store your video. You can disable access anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          <FeatureBox
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered Questions"
            description="Get personalized interview questions tailored to your role"
          />
          <FeatureBox
            icon={<BarChart className="h-6 w-6" />}
            title="Detailed Feedback"
            description="Receive comprehensive analysis of your responses"
          />
          <FeatureBox
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="Track Progress"
            description="Monitor your improvement across multiple attempts"
          />
        </div>
      </div>
    </div>
  )
}

function InterviewDetailItem({ icon, title, value, badge = false }) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
      <div className="flex-shrink-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
        {badge ? (
          <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
            {value}
          </span>
        ) : (
          <p className="text-sm text-slate-900 font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}

function FeatureBox({ icon, title, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}
