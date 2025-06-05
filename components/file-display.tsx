"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, ImageIcon } from "lucide-react"
import type { DisplayedFile } from "@/types"

interface FileDisplayProps {
  file: DisplayedFile
}

export function FileDisplay({ file }: FileDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const downloadFile = () => {
    const a = document.createElement("a")
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const renderFileContent = () => {
    if (file.mimeType.startsWith("image/")) {
      return (
        <div className="relative">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className={`max-w-full h-auto rounded-lg ${
              isFullscreen ? "fixed inset-4 z-50 object-contain bg-black/90" : "max-h-96"
            }`}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    if (file.mimeType === "application/pdf") {
      return <iframe src={file.url} className="w-full h-96 rounded-lg border border-white/20" title={file.name} />
    }

    if (file.mimeType.startsWith("text/")) {
      return (
        <div className="bg-gray-900 rounded-lg p-4 border border-white/20">
          <iframe src={file.url} className="w-full h-64 bg-white rounded" title={file.name} />
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
        <p className="text-white/70 mb-4">Preview not available for this file type</p>
        <Button onClick={downloadFile} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {file.mimeType.startsWith("image/") ? (
            <ImageIcon className="w-5 h-5 text-blue-400" />
          ) : (
            <FileText className="w-5 h-5 text-blue-400" />
          )}
          <div>
            <h3 className="text-white font-medium">{file.name}</h3>
            <p className="text-white/60 text-sm">{file.mimeType}</p>
          </div>
        </div>
        <Button onClick={downloadFile} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div className="bg-white/5 rounded-lg p-4 border border-white/10">{renderFileContent()}</div>

      {file.hash && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/60 text-xs">
            <strong>Hash:</strong> {file.hash.substring(0, 32)}...
          </p>
        </div>
      )}
    </div>
  )
}
