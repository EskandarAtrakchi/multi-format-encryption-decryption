import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function PinModal() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { authenticate, isAuthenticated } = useAuth()
  const router = useRouter()

  const MAX_ATTEMPTS = 3
  const LOCKOUT_TIME = 30000 // 30 seconds

  // Optional client fallback PIN from env for offline dev/testing
  // You can remove this if you want ONLY server validation
  const CLIENT_FALLBACK_PIN = process.env.NEXT_PUBLIC_CORRECT_PIN || "4321"

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true)
      setError(`Too many attempts. Please wait 30 seconds.`)

      const timer = setTimeout(() => {
        setIsLocked(false)
        setAttempts(0)
        setError("")
      }, LOCKOUT_TIME)

      return () => clearTimeout(timer)
    }
  }, [attempts])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Navigates to "/" without adding a new entry in the history
      window.location.reload(); // Refresh the page
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked || !pin.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          authenticate()
          setIsLoading(false)
          return
        } else {
          setError(data.message || "Incorrect PIN")
        }
      } else {
        setError("Server error, please try again later.")
      }
    } catch {
      // Optional fallback client side verification if API route is down
      if (pin.trim() === CLIENT_FALLBACK_PIN) {
        authenticate()
      } else {
        setError("Incorrect PIN (client fallback)")
      }
    }

    setAttempts((prev) => prev + 1)
    setPin("")
    setIsLoading(false)
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
    if (error) setError("")
  }

  if (isAuthenticated) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Secure Access</CardTitle>
          <CardDescription className="text-gray-300">Enter your PIN to access the secure file cache</CardDescription>
          <CardDescription className="text-gray-400 text-sm">Hint: Try "1234"</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={handlePinChange}
              disabled={isLocked || isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-lg tracking-widest"
              maxLength={4}
              autoComplete="off"
            />

            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              disabled={isLocked || !pin.trim() || pin.length !== 4 || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : isLocked ? (
                "Locked"
              ) : (
                "Access System"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Attempts: {attempts}/{MAX_ATTEMPTS}
            {isLocked && <div className="text-red-400 mt-1">Account locked. Please wait...</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
