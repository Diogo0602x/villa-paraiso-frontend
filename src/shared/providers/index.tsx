"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"
import { QueryProvider } from "./QueryProvider"
import { AuthProvider } from "./AuthProvider"
import { ToastProvider } from "./ToastProvider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

export { useAuth } from "./AuthProvider"
export { useToast } from "./ToastProvider"
