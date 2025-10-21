"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as User | null
        if (parsed?.id && parsed?.email) {
          setUser(parsed)
        } else {
          localStorage.removeItem("user")
        }
      }
    } catch (error) {
      console.error("Failed to restore auth session", error)
      localStorage.removeItem("user")
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { user?: { id: number; email: string; name: string } }
      | { error?: string }
      | null

    if (!response.ok || !payload || !("user" in payload) || !payload.user) {
      const message =
        (payload && "error" in payload && typeof payload.error === "string" && payload.error) ||
        "Credenciales inválidas."
      console.error("Login failed", message)
      if (response.status === 401) {
        return false
      }
      throw new Error(message)
    }

    const normalizedUser: User = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
    }

    setUser(normalizedUser)
    localStorage.setItem("user", JSON.stringify(normalizedUser))
    return true
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    })

    const payload = (await response.json().catch(() => null)) as
      | { user?: { id: number; email: string; name: string } }
      | { error?: string }
      | null

    if (!response.ok || !payload || !("user" in payload) || !payload.user) {
      const message =
        (payload && "error" in payload && typeof payload.error === "string" && payload.error) ||
        "No fue posible registrar la cuenta."
      console.error("Register failed", message)
      if (response.status === 409) {
        return false
      }
      throw new Error(message)
    }

    const normalizedUser: User = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
    }

    setUser(normalizedUser)
    localStorage.setItem("user", JSON.stringify(normalizedUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
