"use client"

import * as React from "react"
import { Modal } from "./Modal"

interface BeforeUnloadDialogProps {
  hasUnsavedChanges: boolean
  onConfirmLeave?: () => void
  onCancelLeave?: () => void
  externalShowDialog?: boolean
}

export interface BeforeUnloadDialogRef {
  confirmNavigation: (callback: () => void) => boolean
  showDialog: () => void
  hideDialog: () => void
}

export const BeforeUnloadDialog = React.forwardRef<BeforeUnloadDialogRef, BeforeUnloadDialogProps>(
  ({ hasUnsavedChanges, onConfirmLeave, onCancelLeave, externalShowDialog }, ref) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const [pendingNavigation, setPendingNavigation] = React.useState<(() => void) | null>(null)
  const [preventDialogs, setPreventDialogs] = React.useState(false)

  // Sync with external dialog state
  React.useEffect(() => {
    if (externalShowDialog !== undefined) {
      setShowDialog(externalShowDialog)
    }
  }, [externalShowDialog])

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !preventDialogs) {
        event.preventDefault()
        event.returnValue = "Changes you made may not be saved."
        return "Changes you made may not be saved."
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, preventDialogs])

  const confirmNavigation = React.useCallback(
    (callback: () => void) => {
      if (hasUnsavedChanges && !preventDialogs) {
        setPendingNavigation(() => callback)
        setShowDialog(true)
        return false
      }
      callback()
      return true
    },
    [hasUnsavedChanges, preventDialogs],
  )

  const handleConfirmLeave = () => {
    setShowDialog(false)
    if (pendingNavigation) {
      pendingNavigation()
      setPendingNavigation(null)
    }
    onConfirmLeave?.()
  }

  const handleCancelLeave = () => {
    setShowDialog(false)
    setPendingNavigation(null)
    onCancelLeave?.()
  }

  React.useImperativeHandle(ref, () => ({
    confirmNavigation,
    showDialog: () => setShowDialog(true),
    hideDialog: () => setShowDialog(false),
  }))

  return (
    <Modal
      open={showDialog}
      onClose={handleCancelLeave}
      title="Leave site?"
      size="sm"
      description="Changes you made may not be saved."
      footer={
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelLeave}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLeave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Leave
          </button>
        </div>
      }
    >
      <div className="flex items-center space-x-2 py-2">
        <input
          type="checkbox"
          id="prevent-dialogs"
          checked={preventDialogs}
          onChange={(e) => setPreventDialogs(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="prevent-dialogs" className="text-sm text-gray-600 cursor-pointer select-none">
          Prevent this page from creating additional dialogs
        </label>
      </div>
    </Modal>
  )
})

BeforeUnloadDialog.displayName = "BeforeUnloadDialog"

export function useBeforeUnload(hasUnsavedChanges: boolean) {
  const [showDialog, setShowDialog] = React.useState(false)
  const [pendingNavigation, setPendingNavigation] = React.useState<(() => void) | null>(null)
  const [preventDialogs, setPreventDialogs] = React.useState(false)

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !preventDialogs) {
        event.preventDefault()
        event.returnValue = "Changes you made may not be saved."
        return "Changes you made may not be saved."
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, preventDialogs])

  const confirmNavigation = React.useCallback(
    (callback: () => void) => {
      if (hasUnsavedChanges && !preventDialogs) {
        setPendingNavigation(() => callback)
        setShowDialog(true)
        return false
      }
      callback()
      return true
    },
    [hasUnsavedChanges, preventDialogs],
  )

  const handleConfirmLeave = () => {
    setShowDialog(false)
    if (pendingNavigation) {
      pendingNavigation()
      setPendingNavigation(null)
    }
  }

  const handleCancelLeave = () => {
    setShowDialog(false)
    setPendingNavigation(null)
  }

  return {
    showDialog,
    confirmNavigation,
    handleConfirmLeave,
    handleCancelLeave,
    preventDialogs,
    setPreventDialogs: (checked: boolean) => setPreventDialogs(checked),
  }
}
