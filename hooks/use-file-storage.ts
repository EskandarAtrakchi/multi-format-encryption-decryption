"use client"

import { useState, useEffect } from "react"
import { encryptFile, decryptFile, generateKey, getStoredKey } from "@/lib/crypto"
import type { EncryptedFile, DisplayedFile } from "@/types"

export function useFileStorage() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [displayedFile, setDisplayedFile] = useState<DisplayedFile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadStoredFiles()
  }, [])

  const loadStoredFiles = () => {
    try {
      const storedFiles: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key !== "encryptionKey") {
          storedFiles.push(key)
        }
      }
      setFiles(storedFiles.sort()) // Sort alphabetically
    } catch (error) {
      console.error("Error loading stored files:", error)
    }
  }

  const storeFile = async (file: File): Promise<{ success: boolean; message: string; data?: EncryptedFile }> => {
    setIsLoading(true)
    try {
      // Check if file already exists
      if (localStorage.getItem(file.name)) {
        const overwrite = confirm(`File "${file.name}" already exists. Do you want to overwrite it?`)
        if (!overwrite) {
          setIsLoading(false)
          return { success: false, message: "File storage cancelled" }
        }
      }

      let key = await getStoredKey()
      if (!key) {
        key = await generateKey()
      }

      const encryptedData = await encryptFile(file, key)

      // Store in localStorage
      localStorage.setItem(file.name, JSON.stringify(encryptedData))

      // Update files list
      loadStoredFiles()

      return {
        success: true,
        message: `File "${file.name}" encrypted and stored successfully!`,
        data: encryptedData,
      }
    } catch (error) {
      console.error("Error storing file:", error)

      if (error instanceof Error && error.name === "QuotaExceededError") {
        return {
          success: false,
          message: "Storage quota exceeded. Please clear some files and try again.",
        }
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to store file",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const retrieveFile = async (fileName: string): Promise<void> => {
    setIsLoading(true)
    try {
      const storedData = localStorage.getItem(fileName)
      if (!storedData) {
        throw new Error("File not found in storage")
      }

      const encryptedFile: EncryptedFile = JSON.parse(storedData)
      const key = await getStoredKey()

      if (!key) {
        throw new Error("Encryption key not found. Cannot decrypt file.")
      }

      const decryptedData = await decryptFile(encryptedFile, key)

      // Create blob and URL for display
      const blob = new Blob([decryptedData], { type: encryptedFile.mimeType })
      const url = URL.createObjectURL(blob)

      // Clean up previous URL to prevent memory leaks
      if (displayedFile?.url) {
        URL.revokeObjectURL(displayedFile.url)
      }

      setDisplayedFile({
        name: fileName,
        url,
        mimeType: encryptedFile.mimeType,
        hash: encryptedFile.hash,
      })
    } catch (error) {
      console.error("Error retrieving file:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to retrieve file"
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllFiles = () => {
    try {
      // Clean up any object URLs
      if (displayedFile?.url) {
        URL.revokeObjectURL(displayedFile.url)
      }

      localStorage.clear()
      setFiles([])
      setSelectedFile(null)
      setDisplayedFile(null)
    } catch (error) {
      console.error("Error clearing storage:", error)
      alert("Failed to clear storage")
    }
  }

  return {
    files,
    selectedFile,
    displayedFile,
    storeFile,
    retrieveFile,
    clearAllFiles,
    setSelectedFile,
    isLoading,
  }
}
