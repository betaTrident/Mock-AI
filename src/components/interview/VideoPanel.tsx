"use client"

import { useEffect, useRef, useState } from "react"
import { BotIcon, UserIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type VideoPanelProps = {
  className?: string
  isAISpeaking?: boolean
  cameraEnabled?: boolean
}

export function VideoPanel({
  className,
  isAISpeaking = false,
  cameraEnabled = true,
}: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function startCamera() {
      if (!cameraEnabled) {
        setHasCamera(false)
        setError("Camera off")
        if (videoRef.current) videoRef.current.srcObject = null
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasCamera(true)
          setError(null)
        }
      } catch {
        setError("Camera access unavailable")
        setHasCamera(false)
      }
    }

    startCamera()

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [cameraEnabled])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={cn("size-full object-cover", !hasCamera && "hidden")}
        />
        {!hasCamera ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <UserIcon className="size-10" />
            <p className="text-sm">{error ?? "Initializing camera..."}</p>
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge variant="secondary">You</Badge>
        </div>

        <div
          className={cn(
            "absolute right-3 top-3 flex items-center gap-2 rounded-lg border border-border bg-background/80 px-2 py-1 backdrop-blur-sm",
            isAISpeaking && "ring-2 ring-primary"
          )}
        >
          <BotIcon />
          <span className="text-xs font-medium">AI Interviewer</span>
          {isAISpeaking ? (
            <Badge variant="default" className="text-xs">
              Speaking
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
