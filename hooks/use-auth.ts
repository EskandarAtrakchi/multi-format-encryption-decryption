"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = () => {
      const session = sessionStorage.getItem("authenticated")
      const authTime = sessionStorage.getItem("authTime")

      if (session === "true" && authTime) {
        const sessionTimeout = 3 * 60 * 1000 // 3 minutes
        const elapsed = Date.now() - Number.parseInt(authTime)

        if (elapsed < sessionTimeout) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          logout()
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    // Set up session timeout check
    const sessionTimeout = 3 * 60 * 1000 // 3 minutes
    const timer = setInterval(() => {
      const authTime = sessionStorage.getItem("authTime")
      if (authTime) {
        const elapsed = Date.now() - Number.parseInt(authTime)
        if (elapsed > sessionTimeout) {
          logout()
        }
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const authenticate = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem("authenticated", "true")
    sessionStorage.setItem("authTime", Date.now().toString())
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("authenticated")
    sessionStorage.removeItem("authTime")
  }

  return { isAuthenticated, authenticate, logout, isLoading }
}
