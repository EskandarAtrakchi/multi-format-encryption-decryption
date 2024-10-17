// src/utils/cryptoUtils.js
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const cache = new Map();
export const secretKey = window.crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"]
);

export async function encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );
    return { iv, encryptedData };
}

export async function decryptData(encryptedData, iv, key) {
    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
    );
    return decryptedData;
}

export async function hashData(data) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

export function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

export async function storeFileInCache(file) {
    if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Max allowed size is 5 MB.`);
        return;
    }

    const fileBuffer = await blobToArrayBuffer(file);
    const encryptionKey = await secretKey;
    const { iv, encryptedData } = await encryptData(fileBuffer, encryptionKey);
    const fileHash = await hashData(fileBuffer);

    const fileEntry = {
        iv: Array.from(iv),
        encryptedData: Array.from(new Uint8Array(encryptedData)),
        hash: fileHash,
        mimeType: file.type,
    };

    cache.set(file.name, fileEntry);
    localStorage.setItem(file.name, JSON.stringify(fileEntry));
}

export async function retrieveFileFromCache(fileName) {
    const cacheEntry = cache.get(fileName) || JSON.parse(localStorage.getItem(fileName));
    if (cacheEntry) {
        const encryptionKey = await secretKey;
        const decryptedData = await decryptData(
            new Uint8Array(cacheEntry.encryptedData),
            new Uint8Array(cacheEntry.iv),
            encryptionKey
        );
        const recalculatedHash = await hashData(decryptedData);
        if (recalculatedHash === cacheEntry.hash) {
            const blob = new Blob([decryptedData], { type: cacheEntry.mimeType });
            return blob;
        } else {
            throw new Error("Integrity check failed");
        }
    } else {
        throw new Error("No file found in cache");
    }
}
