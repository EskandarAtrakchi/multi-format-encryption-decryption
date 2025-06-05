"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      onLogout()
      alert("You have been logged out successfully.")
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className={`
        relative overflow-hidden border-red-500/50 text-red-400 hover:text-white
        transition-all duration-300 group
        ${isHovered ? "w-32" : "w-12"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2">
        <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span
          className={`
          transition-all duration-300 overflow-hidden whitespace-nowrap
          ${isHovered ? "opacity-100 w-16" : "opacity-0 w-0"}
        `}
        >
          Logout
        </span>
      </div>

      {/* Hover background */}
      <div
        className={`
        absolute inset-0 bg-red-500 transition-transform duration-300
        ${isHovered ? "translate-x-0" : "translate-x-full"}
      `}
      />
      
    </Button>
  )
}
