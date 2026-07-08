'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { AgentName } from '@/components/interview/AgentStatusIndicator'
import type { TranscriptMessage } from '@/components/interview/TranscriptPanel'
import { SpeechRecognitionService } from '@/features/interview/speech-recognition'
import { TextToSpeechService } from '@/features/interview/text-to-speech'
import { PLACEHOLDER_WORKSPACE } from '@/lib/placeholder-data'

type AgentStepResponse = {
  status: string
  responseText?: string
  currentQuestionIndex: number
  totalQuestions: number
  followUpType?: string
}

type UseInterviewSessionOptions = {
  attemptId: string
  getAuthToken?: () => Promise<string | null>
}

export function useInterviewSession({
  attemptId,
  getAuthToken,
}: UseInterviewSessionOptions) {
  const [question, setQuestion] = useState(PLACEHOLDER_WORKSPACE.question)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(
    PLACEHOLDER_WORKSPACE.totalQuestions
  )
  const [transcript, setTranscript] = useState<TranscriptMessage[]>(
    PLACEHOLDER_WORKSPACE.transcript
  )
  const [activeAgent, setActiveAgent] = useState<AgentName | undefined>()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const speechRef = useRef<SpeechRecognitionService | null>(null)
  const ttsRef = useRef<TextToSpeechService | null>(null)
  const interimRef = useRef('')

  const progressPercent =
    totalQuestions > 0 ? Math.round(((questionIndex + 1) / totalQuestions) * 100) : 0

  const postAgentStep = useCallback(
    async (candidateMessage?: string) => {
      const token = getAuthToken ? await getAuthToken() : null
      if (!token) return null

      setActiveAgent(candidateMessage ? 'followup' : 'planner')
      const response = await fetch(`/api/attempts/${attemptId}/agent-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateMessage }),
      })

      if (!response.ok) {
        throw new Error('Agent step failed')
      }

      return (await response.json()) as AgentStepResponse
    },
    [attemptId, getAuthToken]
  )

  const applyAgentResponse = useCallback(async (result: AgentStepResponse) => {
    setQuestionIndex(result.currentQuestionIndex)
    setTotalQuestions(result.totalQuestions)
    if (result.responseText) {
      setQuestion(result.responseText)
      setTranscript((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: 'interviewer' as const,
          content: result.responseText!,
          timestamp: new Date().toISOString(),
        },
      ])
      setActiveAgent('question')
      if (ttsRef.current?.isSupported()) {
        await ttsRef.current.speak(result.responseText)
      }
      setActiveAgent(undefined)
    }
  }, [])

  const startInterview = useCallback(async () => {
    try {
      const result = await postAgentStep()
      if (result) await applyAgentResponse(result)
    } catch {
      setError('Failed to start interview session')
    }
  }, [applyAgentResponse, postAgentStep])

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!answer.trim()) return
      setTranscript((prev) => [
        ...prev,
        {
          id: `${Date.now()}-candidate`,
          role: 'candidate' as const,
          content: answer,
          timestamp: new Date().toISOString(),
        },
      ])
      try {
        setActiveAgent('followup')
        const result = await postAgentStep(answer)
        if (result) await applyAgentResponse(result)
      } catch {
        setError('Failed to process your answer')
      } finally {
        setActiveAgent(undefined)
      }
    },
    [applyAgentResponse, postAgentStep]
  )

  const handleStartRecording = useCallback(() => {
    if (!speechRef.current?.isSupported()) {
      setError('Speech recognition is not supported in this browser')
      return
    }
    setIsRecording(true)
    setIsPaused(false)
    interimRef.current = ''
    speechRef.current.startRecording(
      (finalTranscript, interimTranscript) => {
        interimRef.current = finalTranscript || interimTranscript
      },
      (finalTranscript) => {
        setIsRecording(false)
        if (finalTranscript.trim()) {
          void submitAnswer(finalTranscript.trim())
        }
      }
    )
  }, [submitAnswer])

  const handleStopRecording = useCallback(() => {
    speechRef.current?.stopRecording()
    setIsRecording(false)
    setIsPaused(false)
  }, [])

  const handleTogglePause = useCallback(() => {
    if (!isRecording) return
    if (isPaused) {
      handleStartRecording()
    } else {
      speechRef.current?.stopRecording()
      setIsPaused(true)
    }
  }, [handleStartRecording, isPaused, isRecording])

  useEffect(() => {
    speechRef.current = new SpeechRecognitionService()
    ttsRef.current = new TextToSpeechService()
    void ttsRef.current.initialize()
    void startInterview()
  }, [startInterview])

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key.toLowerCase() === 'm') {
        setIsMuted((prev) => {
          const next = !prev
          if (next) ttsRef.current?.stop()
          return next
        })
      }
      if (event.key.toLowerCase() === 'c') {
        setCameraEnabled((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return {
    data: {
      question,
      questionIndex,
      totalQuestions,
      transcript,
      activeAgent,
      elapsedSeconds,
      progressPercent,
    },
    isRecording,
    isPaused,
    isMuted,
    cameraEnabled,
    error,
    onStartRecording: handleStartRecording,
    onStopRecording: handleStopRecording,
    onTogglePause: handleTogglePause,
    submitAnswer,
  }
}
