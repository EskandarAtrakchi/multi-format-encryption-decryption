export interface EncryptedFile {
  iv: number[]
  encryptedData: number[]
  hash: string
  mimeType: string
  size: number
}

export interface DisplayedFile {
  name: string
  url: string
  mimeType: string
  hash?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
}
