"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ClearStorageButtonProps {
  onClear: () => void
}

export function ClearStorageButton({ onClear }: ClearStorageButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClear = () => {
    if (showConfirm) {
      onClear()
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowConfirm(false), 5000)
    }
  }

  return (
    <div className="space-y-4">
      {showConfirm && (
        <Alert className="bg-red-500/10 border-red-500/20 max-w-md">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            This will permanently delete all stored files and encryption keys. Click again to confirm.
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleClear}
        variant={showConfirm ? "destructive" : "outline"}
        className={`
          transition-all duration-300
          ${
            showConfirm
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "border-red-500/50 text-red-400 hover:bg-red-500/10"
          }
        `}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {showConfirm ? "Confirm Delete All" : "Clear All Storage"}
      </Button>
    </div>
  )
}
