"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import type { EncryptedFile } from "@/types"

interface FileUploadProps {
  onFileStore: (file: File) => Promise<{ success: boolean; message: string; data?: EncryptedFile }>
}

export function FileUpload({ onFileStore }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({
          type: "error",
          text: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        })
        return
      }
      setSelectedFile(file)
      setMessage(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({
          type: "error",
          text: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        })
        return
      }
      setSelectedFile(file)
      setMessage(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const result = await onFileStore(selectedFile)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to store file" })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept="*/*"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload className="w-8 h-8 text-white/70 mx-auto mb-2" />
          <p className="text-white/70 mb-1">Click to select or drag & drop a file</p>
          <p className="text-sm text-white/50">Maximum file size: 10MB</p>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{selectedFile.name}</p>
              <p className="text-white/60 text-sm">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <Alert
          className={`${
            message.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
      >
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Encrypting...</span>
          </div>
        ) : (
          "Encrypt & Store"
        )}
      </Button>
    </div>
  )
}
