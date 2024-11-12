// Define the maximum file size limit (in bytes), e.g., 5 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Hash Table (Map) to store cached data
const cache = new Map();

// Function to persist or retrieve the encryption key
async function getSecretKey() {
    const storedKey = localStorage.getItem('encryptionKey');

    if (storedKey) {
        // Convert the stored key back to CryptoKey
        return await window.crypto.subtle.importKey(
            "jwk", // Key format
            JSON.parse(storedKey), // Stored key
            {
                name: "AES-GCM",
            },
            true, // Extractable
            ["encrypt", "decrypt"]
        );
    } else {
        // Generate a new key if none is stored
        const newKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true, // Extractable
            ["encrypt", "decrypt"]
        );

        // Export the key and save it to localStorage
        const exportedKey = await window.crypto.subtle.exportKey("jwk", newKey);
        localStorage.setItem('encryptionKey', JSON.stringify(exportedKey));

        return newKey;
    }
}

// Function to encrypt data (Confidentiality)
async function encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector for AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    );
    return {
        iv: iv,
        encryptedData: encryptedData
    };
}

// Function to decrypt data (Confidentiality)
async function decryptData(encryptedData, iv, key) {
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );
    return decryptedData;
}

// Function to hash data (Integrity)
async function hashData(data) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))); // Base64 encoding
}

// Function to convert a Blob to an ArrayBuffer (needed for encryption)
function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

// Function to update the file selection dropdown
function updateFileSelect(fileName) {
    const fileSelect = document.getElementById("fileSelect");
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    fileSelect.appendChild(option);
}

function passKey() {
    let PIN = prompt("Please input your PIN to access the file");

    if (PIN == 1234) {
        alert("Access granted");
    } else {
        alert("Access denied");
        window.close();
    }
}