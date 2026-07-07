"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, Info, XCircle, AlertTriangle, X } from "lucide-react"

const ToastContext = createContext(null)

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
}

const variants = {
  success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  warning: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast) => {
      const id = crypto.randomUUID()
      const safeToast = {
        id,
        message: toast.message ?? "",
        type: toast.type ?? "info",
        duration: toast.duration ?? 3000,
        position: toast.position ?? "top-right",
      }

      setToasts((current) => [...current, safeToast])

      if (safeToast.duration > 0) {
        setTimeout(() => removeToast(id), safeToast.duration)
      }
    },
    [removeToast],
  )

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

function ToastViewport({ toasts, onClose }) {
  const grouped = useMemo(() => {
    return toasts.reduce((acc, toast) => {
      const list = acc[toast.position] ?? []
      acc[toast.position] = [...list, toast]
      return acc
    }, {})
  }, [toasts])

  const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
  }

  return (
    <>
      {Object.entries(grouped).map(([position, items]) => (
        <div
          key={position}
          className={`fixed z-50 flex flex-col gap-3 ${positionClasses[position] || positionClasses["top-right"]}`}
        >
          <AnimatePresence>
            {items.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  )
}

function ToastItem({ toast, onClose }) {
  const { id, message, type } = toast
  const tone = variants[type] || variants.info
  const icon = icons[type] || icons.info

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`w-96 shadow-2xl rounded-lg overflow-hidden border border-white/20 backdrop-blur-md text-white`}
    >
      <div className={`${tone} flex items-start gap-3 px-5 py-4`}>
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <p className="text-sm font-semibold leading-snug flex-1">{message}</p>
        <button
          onClick={() => onClose(id)}
          aria-label="Close toast"
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: toast.duration / 1000, ease: "linear" }}
        className={`h-1 ${type === "success" ? "bg-emerald-400" : type === "error" ? "bg-red-400" : type === "warning" ? "bg-amber-400" : "bg-blue-400"}`}
      />
    </motion.div>
  )
}
