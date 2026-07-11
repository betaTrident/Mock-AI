"use client"

import { MicIcon, MicOffIcon, PauseIcon, PlayIcon } from "lucide-react"
import { motion } from "framer-motion"

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
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
      role="group"
      aria-label="Recording controls"
    >
      {!isRecording ? (
        <Button onClick={onStart} aria-label="Start recording">
          <MicIcon data-icon="inline-start" />
          Start Recording
        </Button>
      ) : (
        <>
          <Button variant="destructive" onClick={onStop} aria-label="Stop recording">
            <MicOffIcon data-icon="inline-start" />
            Stop
          </Button>
          <Button
            variant="outline"
            onClick={onTogglePause}
            aria-label={isPaused ? "Resume recording" : "Pause recording"}
          >
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
          <Badge variant={isPaused ? "secondary" : "default"} aria-live="polite">
            {isPaused ? "Paused" : "Recording"}
          </Badge>
          {!isPaused ? (
            <motion.span
              className="inline-block size-3 rounded-full bg-destructive"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          ) : null}
        </>
      )}
    </div>
  )
}
