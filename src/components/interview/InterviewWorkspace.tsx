"use client"

import { useState } from "react"
import { PanelRightIcon, SquareIcon } from "lucide-react"

import { AgentStatusIndicator, type AgentName } from "@/components/interview/AgentStatusIndicator"
import { QuestionDisplay } from "@/components/interview/QuestionDisplay"
import { RecordingControls } from "@/components/interview/RecordingControls"
import {
  TranscriptPanel,
  type TranscriptMessage,
} from "@/components/interview/TranscriptPanel"
import { VideoPanel } from "@/components/interview/VideoPanel"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type InterviewWorkspaceData = {
  question: string
  questionIndex: number
  totalQuestions: number
  questionType?: "technical" | "behavioral" | "situational" | "followup"
  transcript: TranscriptMessage[]
  activeAgent?: AgentName
  elapsedSeconds: number
  progressPercent: number
}

type InterviewWorkspaceProps = {
  data: InterviewWorkspaceData
  isRecording?: boolean
  isPaused?: boolean
  cameraEnabled?: boolean
  isMuted?: boolean
  onStartRecording?: () => void
  onStopRecording?: () => void
  onTogglePause?: () => void
  onEndInterview: () => void
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function InterviewWorkspace({
  data,
  isRecording: isRecordingProp,
  isPaused: isPausedProp,
  cameraEnabled = true,
  isMuted = false,
  onStartRecording,
  onStopRecording,
  onTogglePause,
  onEndInterview,
}: InterviewWorkspaceProps) {
  const [localRecording, setLocalRecording] = useState(false)
  const [localPaused, setLocalPaused] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(true)

  const isRecording = isRecordingProp ?? localRecording
  const isPaused = isPausedProp ?? localPaused

  const handleStart = () => {
    if (onStartRecording) onStartRecording()
    else setLocalRecording(true)
    setLocalPaused(false)
  }

  const handleStop = () => {
    if (onStopRecording) onStopRecording()
    else setLocalRecording(false)
    setLocalPaused(false)
  }

  const handleTogglePause = () => {
    if (onTogglePause) onTogglePause()
    else setLocalPaused((prev) => !prev)
  }

  return (
    <div
      className="flex h-[calc(100vh-3.5rem)] flex-col lg:h-screen"
      role="application"
      aria-label="Interview workspace"
    >
      <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[280px_1fr_320px]">
        <div className="hidden lg:block">
          <VideoPanel
            isAISpeaking={data.activeAgent === "question"}
            cameraEnabled={cameraEnabled}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="lg:hidden">
            <VideoPanel
              isAISpeaking={data.activeAgent === "question"}
              cameraEnabled={cameraEnabled}
            />
          </div>

          <QuestionDisplay
            question={data.question}
            questionIndex={data.questionIndex}
            totalQuestions={data.totalQuestions}
            type={data.questionType}
          />

          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            onStart={handleStart}
            onStop={handleStop}
            onTogglePause={handleTogglePause}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Session progress</span>
              <span>{data.progressPercent}%</span>
            </div>
            <Progress value={data.progressPercent} aria-label={`Session progress ${data.progressPercent} percent`} />
          </div>
        </div>

        <div className="hidden rounded-xl border border-border lg:block">
          <TranscriptPanel messages={data.transcript} isProcessing={data.activeAgent !== undefined} />
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="sr-only" id="interview-shortcuts">
          Keyboard shortcuts: M toggles mute, C toggles camera.
        </p>
        <div className="flex items-center gap-4" aria-describedby="interview-shortcuts">
          <span className="font-mono text-sm tabular-nums" aria-label={`Elapsed time ${formatTime(data.elapsedSeconds)}`}>
            {formatTime(data.elapsedSeconds)}
          </span>
          <AgentStatusIndicator activeAgent={data.activeAgent} />
          {isMuted ? <span className="text-xs text-muted-foreground" aria-live="polite">Muted (M)</span> : null}
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={transcriptOpen} onOpenChange={setTranscriptOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden" aria-label="Open transcript panel">
                <PanelRightIcon data-icon="inline-start" />
                Transcript
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-md">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle>Transcript</SheetTitle>
              </SheetHeader>
              <TranscriptPanel
                messages={data.transcript}
                isProcessing={data.activeAgent !== undefined}
                className="h-[calc(100vh-4rem)]"
              />
            </SheetContent>
          </Sheet>

          <Button variant="destructive" size="sm" onClick={onEndInterview} aria-label="End interview">
            <SquareIcon data-icon="inline-start" />
            End Interview
          </Button>
        </div>
      </footer>
    </div>
  )
}

