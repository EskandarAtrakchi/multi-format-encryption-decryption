"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"

interface FileListProps {
  files: string[]
  selectedFile: string | null
  onFileSelect: (fileName: string) => void
  onFileRetrieve: (fileName: string) => Promise<void>
}

export function FileList({ files, selectedFile, onFileSelect, onFileRetrieve }: FileListProps) {
  const handleRetrieve = async () => {
    if (selectedFile) {
      await onFileRetrieve(selectedFile)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-white/80 text-sm font-medium">Select a file to decrypt:</label>
        <Select value={selectedFile || ""} onValueChange={onFileSelect}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Choose a file..." />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {files.length === 0 ? (
              <SelectItem value="no-files" disabled>
                No files stored
              </SelectItem>
            ) : (
              files.map((fileName) => (
                <SelectItem key={fileName} value={fileName} className="text-white">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{fileName}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {files.length > 0 && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/60 text-sm">
            {files.length} file{files.length !== 1 ? "s" : ""} stored
          </p>
        </div>
      )}

      <Button
        onClick={handleRetrieve}
        disabled={!selectedFile}
        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
      >
        <Download className="w-4 h-4 mr-2" />
        Decrypt & Retrieve
      </Button>
    </div>
  )
}
