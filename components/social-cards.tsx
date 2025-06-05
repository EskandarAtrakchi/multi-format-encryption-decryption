"use client"

import { useState } from "react"
import { Github, Twitter, Instagram, MessageCircle, Code, Zap } from "lucide-react"

const socialPlatforms = [
  { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600", url: "#" },
  { name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600", url: "#" },
  { name: "GitHub", icon: Github, color: "from-gray-700 to-gray-900", url: "#" },
  { name: "Discord", icon: MessageCircle, color: "from-indigo-500 to-purple-600", url: "#" },
  { name: "CodePen", icon: Code, color: "from-gray-800 to-black", url: "#" },
  { name: "Telegram", icon: Zap, color: "from-blue-500 to-cyan-500", url: "#" },
]

export function SocialCards() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Background gradient */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 
        rounded-2xl transition-opacity duration-300 blur-xl
        ${isHovered ? "opacity-30" : "opacity-0"}
      `}
      />

      {/* Cards container */}
      <div
        className={`
        relative grid grid-cols-3 gap-2 p-4 bg-white/10 backdrop-blur-lg 
        rounded-2xl border border-white/20 transition-all duration-300
        ${isHovered ? "scale-105" : "scale-100"}
      `}
      >
        {socialPlatforms.map((platform, index) => {
          const Icon = platform.icon
          return (
            <a
              key={platform.name}
              href={platform.url}
              className={`
                group relative w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color}
                flex items-center justify-center transition-all duration-300
                hover:scale-110 hover:rotate-3 hover:shadow-lg
                ${isHovered ? "opacity-100" : "opacity-70"}
              `}
              style={{
                transitionDelay: isHovered ? `${index * 50}ms` : "0ms",
              }}
            >
              <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />

              {/* Tooltip */}
              <div
                className="
                absolute -top-8 left-1/2 transform -translate-x-1/2
                bg-black/80 text-white text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none whitespace-nowrap
              "
              >
                {platform.name}
              </div>
            </a>
          )
        })}

        {/* Center text */}
        <div
          className={`
          absolute inset-0 flex items-center justify-center pointer-events-none
          transition-opacity duration-300
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
        >
          <div className="text-center">
            <p className="text-white/80 text-xs font-medium tracking-wider">FOLLOW</p>
            <p className="text-white/60 text-xs">SOCIAL</p>
          </div>
        </div>
      </div>
    </div>
  )
}
