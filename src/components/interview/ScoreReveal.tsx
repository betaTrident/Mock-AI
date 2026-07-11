"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

type ScoreRevealProps = {
  value: number
  className?: string
}

export function ScoreReveal({ value, className }: ScoreRevealProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const controls = animate(count, value, { duration: 0.3, ease: "easeOut" })
    return controls.stop
  }, [count, value])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest))
    return unsubscribe
  }, [rounded])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {display}%
    </motion.span>
  )
}
