// Function to filter out theme-related keys
function isThemeKey(key) {
    return key.startsWith('theme');
}

// Clear storage event listener
document.getElementById("clearStorage").addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all stored files and keys?")) {
        // Clear all files and keys from localStorage
        localStorage.clear(); // This clears everything from localStorage

        // Clear the dropdown options
        const fileSelect = document.getElementById("fileSelect");
        fileSelect.innerHTML = '<option value="" disabled selected>Select a file to retrieve</option>'; // Reset dropdown

        // Notify the user
        alert("All stored files and keys have been cleared.");
    }
});

// Event Listeners for Storing and Retrieving Data
document.getElementById("store").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        await storeFileInCache(file);
    }
});

// Populate the dropdown with stored files, excluding theme-related keys
function populateFileSelect() {
    const fileSelect = document.getElementById("fileSelect");
    fileSelect.innerHTML = '<option value="" disabled selected>Select a file to retrieve</option>'; // Reset dropdown

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!isThemeKey(key)) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            fileSelect.appendChild(option);
        }
    }
}

// Call the function to populate the dropdown on page load
document.addEventListener("DOMContentLoaded", populateFileSelect);

// Retrieve and decrypt file from the cache or localStorage
async function retrieveFileFromCache(fileName) {
    let cacheEntry;
    try {
        cacheEntry = cache.get(fileName) || JSON.parse(localStorage.getItem(fileName));
    } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        document.getElementById("output").innerText = `Error retrieving file: ${fileName}`;
        return;
    }

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

// Event listener for retrieving data
document.getElementById("retrieve").addEventListener("click", () => {
    const fileSelect = document.getElementById("fileSelect");
    const selectedFile = fileSelect.value;

    if (selectedFile) {
        retrieveFileFromCache(selectedFile);
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
            console.log('QuotaExceededError: Failed to store file in localStorage.');
            return;
        } else {
            console.log('Error storing file in localStorage:', e);
        }
    }
}