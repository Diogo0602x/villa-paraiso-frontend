"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Stub AuthProvider prepared for future JWT implementation
interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user] = useState<User | null>(null)
  const [isLoading] = useState(false)

  const login = useCallback(async (_email: string, _password: string) => {
    // Stub: Will be implemented when authentication is added
    console.log("Login stub - authentication not implemented yet")
  }, [])

  const logout = useCallback(() => {
    // Stub: Will be implemented when authentication is added
    console.log("Logout stub - authentication not implemented yet")
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
