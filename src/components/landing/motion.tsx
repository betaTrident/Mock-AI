"use client"

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion"
import type { ReactNode } from "react"

export function useLandingMotion() {
  const reduced = useReducedMotion()

  return {
    reduced,
    fadeUp: reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
    fadeIn: reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, ease: "easeOut" as const },
        },
    hoverLift: reduced
      ? {}
      : {
          whileHover: { y: -2 },
          transition: { duration: 0.2 },
        },
    float: reduced
      ? {}
      : {
          animate: { y: [0, -6, 0] },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
        },
  }
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

type FadeUpProps = HTMLMotionProps<"div"> & { children: ReactNode }

export function FadeUp({ children, className, ...props }: FadeUpProps) {
  const { reduced, fadeUp } = useLandingMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} {...fadeUp} {...props}>
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
}

export function Stagger({ children, className }: StaggerProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}
