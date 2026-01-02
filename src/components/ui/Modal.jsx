import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  showClose = true,
  footer,
  blur = true,
}) {
  if (typeof document === "undefined") return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${blur ? "backdrop-blur-sm" : ""}`}
        >
          <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`relative w-full ${sizes[size] || sizes.md} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden`}
          >
            <div className="px-6 pt-6 pb-4 flex items-start gap-3">
              <div className="flex-1">
                {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
                {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="px-6 pb-6">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function useModalController(initial = false) {
  const [open, setOpen] = React.useState(initial);
  const onClose = React.useCallback(() => setOpen(false), []);
  const onOpen = React.useCallback(() => setOpen(true), []);
  return { open, onClose, onOpen, setOpen };
}
