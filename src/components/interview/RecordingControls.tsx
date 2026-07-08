"use client"

import { MicIcon, MicOffIcon, PauseIcon, PlayIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RecordingControlsProps = {
  isRecording: boolean
  isPaused: boolean
  onStart: () => void
  onStop: () => void
  onTogglePause: () => void
  className?: string
}

export function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onTogglePause,
  className,
}: RecordingControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {!isRecording ? (
        <Button onClick={onStart}>
          <MicIcon data-icon="inline-start" />
          Start Recording
        </Button>
      ) : (
        <>
          <Button variant="destructive" onClick={onStop}>
            <MicOffIcon data-icon="inline-start" />
            Stop
          </Button>
          <Button variant="outline" onClick={onTogglePause}>
            {isPaused ? (
              <>
                <PlayIcon data-icon="inline-start" />
                Resume
              </>
            ) : (
              <>
                <PauseIcon data-icon="inline-start" />
                Pause
              </>
            )}
          </Button>
          <Badge variant={isPaused ? "secondary" : "default"}>
            {isPaused ? "Paused" : "Recording"}
          </Badge>
        </>
      )}
    </div>
  )
}
