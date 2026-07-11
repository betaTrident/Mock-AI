"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type VoiceVisualizerProps = {
  bars?: number
  className?: string
  size?: "sm" | "md"
}

export function VoiceVisualizer({
  bars = 12,
  className,
  size = "md",
}: VoiceVisualizerProps) {
  const reduced = useReducedMotion()
  const heights =
    size === "sm"
      ? [3, 7, 11, 5, 13, 9, 7, 14, 5, 10, 6, 9]
      : [5, 10, 16, 8, 20, 12, 14, 22, 10, 18, 12, 16]

  return (
    <div
      className={cn("flex items-end justify-center gap-[3px]", className)}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const h = heights[i % heights.length]
        if (reduced) {
          return (
            <span
              key={i}
              className="w-[3px] rounded-full bg-blue-400/70"
              style={{ height: h }}
            />
          )
        }
        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-blue-400/80"
            animate={{ height: [h * 0.35, h, h * 0.45, h * 0.85, h * 0.35] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.07,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

type VoiceRingProps = {
  className?: string
  size?: number
}

export function VoiceRing({ className, size = 48 }: VoiceRingProps) {
  const reduced = useReducedMotion()

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {!reduced && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-blue-400/50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-1 rounded-full border border-blue-400/30"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.35,
            }}
          />
        </>
      )}
      <span className="relative flex items-center justify-center rounded-full bg-blue-500/20 ring-2 ring-blue-400/40"
        style={{ width: size * 0.55, height: size * 0.55 }}
      >
        <span
          className="rounded-full bg-blue-400"
          style={{ width: size * 0.18, height: size * 0.18 }}
        />
      </span>
    </div>
  )
}
