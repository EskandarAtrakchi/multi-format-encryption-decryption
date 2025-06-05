const ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256

export async function generateKey(): Promise<CryptoKey> {
  try {
    const key = await crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: KEY_LENGTH,
      },
      true,
      ["encrypt", "decrypt"],
    )

    // Store the key
    const exportedKey = await crypto.subtle.exportKey("jwk", key)
    localStorage.setItem("encryptionKey", JSON.stringify(exportedKey))

    return key
  } catch (error) {
    console.error("Error generating key:", error)
    throw new Error("Failed to generate encryption key")
  }
}

export async function getStoredKey(): Promise<CryptoKey | null> {
  const storedKey = localStorage.getItem("encryptionKey")
  if (!storedKey) return null

  try {
    const keyData = JSON.parse(storedKey)
    return await crypto.subtle.importKey("jwk", keyData, { name: ALGORITHM }, true, ["encrypt", "decrypt"])
  } catch (error) {
    console.error("Error importing stored key:", error)
    // Clear corrupted key
    localStorage.removeItem("encryptionKey")
    return null
  }
}

export async function encryptFile(file: File, key: CryptoKey) {
  try {
    const fileBuffer = await file.arrayBuffer()
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encryptedData = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, fileBuffer)

    // Generate hash for integrity
    const hash = await crypto.subtle.digest("SHA-256", fileBuffer)
    const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)))

    return {
      iv: Array.from(iv),
      encryptedData: Array.from(new Uint8Array(encryptedData)),
      hash: hashBase64,
      mimeType: file.type,
      size: file.size,
    }
  } catch (error) {
    console.error("Error encrypting file:", error)
    throw new Error("Failed to encrypt file")
  }
}

export async function decryptFile(encryptedFile: any, key: CryptoKey): Promise<ArrayBuffer> {
  try {
    const iv = new Uint8Array(encryptedFile.iv)
    const encryptedData = new Uint8Array(encryptedFile.encryptedData)

    const decryptedData = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encryptedData)

    // Verify integrity
    const hash = await crypto.subtle.digest("SHA-256", decryptedData)
    const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)))

    if (hashBase64 !== encryptedFile.hash) {
      throw new Error("File integrity check failed - file may be corrupted")
    }

    return decryptedData
  } catch (error) {
    console.error("Error decrypting file:", error)
    if (error instanceof Error && error.message.includes("integrity")) {
      throw error
    }
    throw new Error("Failed to decrypt file - invalid key or corrupted data")
  }
}
