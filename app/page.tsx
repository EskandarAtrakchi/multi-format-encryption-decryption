"use client"
import { PinModal } from "@/components/pin-modal"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { FileDisplay } from "@/components/file-display"
import { SocialCards } from "@/components/social-cards"
import { LogoutButton } from "@/components/logout-button"
import { ClearStorageButton } from "@/components/clear-storage-button"
import { useAuth } from "@/hooks/use-auth"
import { useFileStorage } from "@/hooks/use-file-storage"

export default function HomePage() {
  const { isAuthenticated, logout, isLoading } = useAuth()
  const { files, selectedFile, displayedFile, storeFile, retrieveFile, clearAllFiles, setSelectedFile } =
    useFileStorage()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <PinModal />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Secure File Cache</h1>
        </div>
        <LogoutButton onLogout={logout} />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Social Cards */}
        <div className="flex justify-center">
          <SocialCards />
        </div>

        {/* File Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Upload & Encrypt Files</h2>
            <FileUpload onFileStore={storeFile} />
          </div>

          {/* Retrieve Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Retrieve & Decrypt Files</h2>
            <FileList
              files={files}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileRetrieve={retrieveFile}
            />
          </div>
        </div>

        {/* File Display */}
        {displayedFile && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">File Preview</h2>
            <FileDisplay file={displayedFile} />
          </div>
        )}

        {/* Storage Management */}
        <div className="flex justify-center">
          <ClearStorageButton onClear={clearAllFiles} />
        </div>
      </main>
    </div>
  )
}
