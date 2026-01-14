"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { Snackbar, Alert, type AlertColor } from "@mui/material"

const TOAST_DURATION = 5000

interface Toast {
  id: number
  message: string
  severity: AlertColor
}

interface ToastContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, severity: AlertColor) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, severity }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string) => addToast(message, "success"), [addToast])
  const showError = useCallback((message: string) => addToast(message, "error"), [addToast])
  const showWarning = useCallback((message: string) => addToast(message, "warning"), [addToast])
  const showInfo = useCallback((message: string) => addToast(message, "info"), [addToast])

  const value: ToastContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={TOAST_DURATION}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
