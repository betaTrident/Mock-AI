"use client"

import { use } from "react"
import { useRouter } from "next/navigation"

import { InterviewWorkspace } from "@/components/interview/InterviewWorkspace"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { useInterviewSession } from "@/features/interview"
import { PLACEHOLDER_WORKSPACE } from "@/lib/placeholder-data"

type InterviewPageProps = {
  params: Promise<{ id: string }>
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const session = useInterviewSession({ attemptId: id })

  const workspaceData = session.error ? PLACEHOLDER_WORKSPACE : session.data

  return (
    <ErrorBoundary fallbackTitle="Interview session error">
      <InterviewWorkspace
        data={workspaceData}
        isRecording={session.isRecording}
        isPaused={session.isPaused}
        cameraEnabled={session.cameraEnabled}
        isMuted={session.isMuted}
        onStartRecording={session.onStartRecording}
        onStopRecording={session.onStopRecording}
        onTogglePause={session.onTogglePause}
        onEndInterview={() => router.push(`/interview/${id}/feedback`)}
      />
    </ErrorBoundary>
  )
}

