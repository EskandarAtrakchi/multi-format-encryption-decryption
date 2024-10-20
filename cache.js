// Define the maximum file size limit (in bytes), e.g., 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

// Function to display the "file stored" modal with encryption details
function showStoreModal(fileName, fileHash, iv) {
    const storeModal = document.getElementById("storeModal");
    const storeModalText = document.getElementById("storeModalText");
    storeModalText.innerHTML = `
        File "${fileName}" stored successfully!<br />
        <strong>Hash:</strong> ${fileHash}<br />
        <strong>IV:</strong> ${Array.from(iv).join(', ')}
    `;
    storeModal.style.display = "block";
}

// Function to display the "file retrieved" modal with encryption details
function showRetrieveModal(fileName, fileHash, iv) {
    const retrieveModal = document.getElementById("retrieveModal");
    const retrieveModalText = document.getElementById("retrieveModalText");
    retrieveModalText.innerHTML = `
        File "${fileName}" retrieved successfully!<br />
        <strong>Hash:</strong> ${fileHash}<br />
        <strong>IV:</strong> ${Array.from(iv).join(', ')}
    `;
    retrieveModal.style.display = "block";
}

// Close modals when the close button is clicked
document.getElementById("storeClose").addEventListener("click", function () {
    document.getElementById("storeModal").style.display = "none";
});
document.getElementById("retrieveClose").addEventListener("click", function () {
    document.getElementById("retrieveModal").style.display = "none";
});

// Close modals if clicked outside of them
window.addEventListener("click", function (event) {
    const storeModal = document.getElementById("storeModal");
    const retrieveModal = document.getElementById("retrieveModal");
    if (event.target === storeModal) {
        storeModal.style.display = "none";
    }
    if (event.target === retrieveModal) {
        retrieveModal.style.display = "none";
    }
});

// Store file in the cache and localStorage (with encryption and hash for integrity)
async function storeFileInCache(file) {
    // Check if the file exceeds the maximum size
    if (file.size > MAX_FILE_SIZE) {
        alert(`The file "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
        return; // Do not proceed with storing
    }

    const fileBuffer = await blobToArrayBuffer(file); // Convert file to ArrayBuffer
    const encryptionKey = await getSecretKey(); // Use the saved key or generate a new one
    const { iv, encryptedData } = await encryptData(fileBuffer, encryptionKey);
    const fileHash = await hashData(fileBuffer);

    const fileEntry = {
        iv: Array.from(iv), // Store IV as array
        encryptedData: Array.from(new Uint8Array(encryptedData)), // Convert to array for storage
        hash: fileHash,
        mimeType: file.type // Store file type (e.g., image/jpeg, application/pdf)
    };

    // Save to cache (in memory)
    cache.set(file.name, fileEntry);

    try {
        // Save to localStorage (persistent storage)
        localStorage.setItem(file.name, JSON.stringify(fileEntry));

        console.log(`File stored in cache: ${file.name}`);
        document.getElementById("output").innerText = `File stored: ${file.name}`;

        // Update the dropdown with the new file
        updateFileSelect(file.name);

        // Show modal with encryption details
        showStoreModal(file.name, fileHash, iv);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert(`Failed to store the file "${file.name}". The file is too large or localStorage is full.`);
            console.error('QuotaExceededError: Failed to store file in localStorage.');
        } else {
            console.error('Error storing file in localStorage:', e);
        }
    }
}

// Retrieve and decrypt file from the cache or localStorage
async function retrieveFileFromCache(fileName) {
    let cacheEntry = cache.get(fileName) || JSON.parse(localStorage.getItem(fileName));

    if (cacheEntry) {
        const encryptionKey = await getSecretKey(); // Use the saved key or generate a new one
        const decryptedData = await decryptData(new Uint8Array(cacheEntry.encryptedData), new Uint8Array(cacheEntry.iv), encryptionKey);
        const recalculatedHash = await hashData(decryptedData);

        // Check integrity
        if (recalculatedHash === cacheEntry.hash) {
            console.log(`File retrieved and integrity verified: ${fileName}`);

            // Create a Blob from the decrypted data and display the file
            const blob = new Blob([decryptedData], { type: cacheEntry.mimeType });
            const url = URL.createObjectURL(blob);

            // Display the file (PDFs, images, etc.)
            if (cacheEntry.mimeType.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = url;
                document.getElementById("output").innerHTML = '';
                document.getElementById("output").appendChild(img);
            } else if (cacheEntry.mimeType === "application/pdf") {
                const iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.width = "100%";
                iframe.height = "600px";
                document.getElementById("output").innerHTML = '';
                document.getElementById("output").appendChild(iframe);
            } else {
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.textContent = `Download ${fileName}`;
                document.getElementById("output").innerHTML = '';
                document.getElementById("output").appendChild(a);
            }

            // Show modal with encryption details
            showRetrieveModal(fileName, cacheEntry.hash, cacheEntry.iv);

        } else {
            console.log('File integrity check failed!');
            document.getElementById("output").innerText = `Integrity check failed for: ${fileName}`;
        }
    } else {
        console.log(`No file found for key: ${fileName}`);
        document.getElementById("output").innerText = `No file found for: ${fileName}`;
    }
}

// Event Listeners for Storing and Retrieving Data
document.getElementById("store").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        await storeFileInCache(file);
    }
});

document.getElementById("retrieve").addEventListener("click", async () => {
    const fileSelect = document.getElementById("fileSelect");
    const fileName = fileSelect.value;

    if (fileName) {
        await retrieveFileFromCache(fileName);
    }
});


document.getElementById("clearStorage").addEventListener("click", function () {
    // Clear all files and keys from localStorage
    localStorage.clear(); // This clears everything from localStorage

    // Clear the dropdown options
    const fileSelect = document.getElementById("fileSelect");
    fileSelect.innerHTML = '<option value="" disabled selected>Select a file to retrieve</option>'; // Reset dropdown

    window.location.reload();
    // Notify the user
    alert("All stored files and keys have been cleared.");
});
