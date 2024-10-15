// Hash Table (Map) to store cached data
const cache = new Map();

// Secret key for encryption/decryption (in a real app, this would be securely stored)
const secretKey = window.crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    true, // Extractable
    ["encrypt", "decrypt"]
);

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

// Store file in the cache (with encryption and hash for integrity)
async function storeFileInCache(file) {
    const fileBuffer = await blobToArrayBuffer(file); // Convert file to ArrayBuffer
    const encryptionKey = await secretKey;
    const { iv, encryptedData } = await encryptData(fileBuffer, encryptionKey);
    const fileHash = await hashData(fileBuffer);

    cache.set(file.name, {
        iv: iv,
        encryptedData: encryptedData,
        hash: fileHash,
        mimeType: file.type // Store file type (e.g., image/jpeg, application/pdf)
    });

    console.log(`File stored in cache: ${file.name}`);
    document.getElementById("output").innerText = `File stored: ${file.name}`;

    // Update the dropdown with the new file
    updateFileSelect(file.name);
}

// Retrieve and decrypt file from the cache
async function retrieveFileFromCache(fileName) {
    const cacheEntry = cache.get(fileName);

    if (cacheEntry) {
        const encryptionKey = await secretKey;
        const decryptedData = await decryptData(cacheEntry.encryptedData, cacheEntry.iv, encryptionKey);
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
    } else {
        console.log('No file selected');
        document.getElementById("output").innerText = 'No file selected';
    }
});

document.getElementById("retrieve").addEventListener("click", async () => {
    const fileSelect = document.getElementById("fileSelect");
    const fileName = fileSelect.value;

    if (fileName) {
        await retrieveFileFromCache(fileName);
    } else {
        console.log('No file selected for retrieval');
        document.getElementById("output").innerText = 'No file selected for retrieval';
    }
});