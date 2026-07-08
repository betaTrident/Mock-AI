"use client"

import { useEffect, useRef } from "react"
import { BotIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type TranscriptMessage = {
  id: string
  role: "candidate" | "interviewer"
  content: string
  agentName?: string
}

type TranscriptPanelProps = {
  messages: TranscriptMessage[]
  isProcessing?: boolean
  interimTranscript?: string
  className?: string
}

export function TranscriptPanel({
  messages,
  isProcessing = false,
  interimTranscript,
  className,
}: TranscriptPanelProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, interimTranscript, isProcessing])

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Live Transcript</h3>
        <p className="text-xs text-muted-foreground">Real-time conversation</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && !isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <BotIcon className="size-10 opacity-50" />
              <p>Waiting for interview to begin...</p>
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "candidate" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "interviewer" ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <BotIcon className="size-4" />
                </div>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  message.role === "candidate"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {message.agentName ? (
                  <Badge variant="outline" className="mb-1 text-xs">
                    {message.agentName}
                  </Badge>
                ) : null}
                <p>{message.content}</p>
              </div>
              {message.role === "candidate" ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <UserIcon className="size-4 text-primary-foreground" />
                </div>
              ) : null}
            </div>
          ))}

          {isProcessing ? (
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          ) : null}

          {interimTranscript ? (
            <p className="text-right text-sm italic text-muted-foreground">{interimTranscript}</p>
          ) : null}

          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
