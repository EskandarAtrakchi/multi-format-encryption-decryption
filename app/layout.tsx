import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Secure File Cache System",
  description: "A secure file encryption and caching system with AES-GCM encryption",
  icons : {
    icon: "https://github.com/EskandarAtrakchi/multi-format-encryption-decryption/blob/main/public/encryption.png?raw=true",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
