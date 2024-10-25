document.addEventListener("DOMContentLoaded", () => {
  // Select the theme toggle button
  const themeToggleButton = document.getElementById("themeToggle");
  if (themeToggleButton) {
    // Check if the button exists and add event listener
    themeToggleButton.addEventListener("click", () => {
      const currentTheme = document.documentElement.className;
      const newTheme =
        currentTheme === "light-theme" ? "dark-theme" : "light-theme";
      setTheme(newTheme);
    });
  } else {
    console.warn("Theme toggle button not found!");
  }

  // PIN modal handling
  const pinCloseButton = document.getElementById("pinClose");
  if (pinCloseButton) {
    pinCloseButton.addEventListener("click", () => {
      if (!pinVerified) {
        alert(
          "Access Denied. You must enter the correct PIN to access the site."
        );
      } else {
        document.getElementById("pinModal").style.display = "none";
      }
    });
  }

  // Apply default theme and show PIN modal on page load
  setTheme("light-theme"); // Set to default theme
  document.getElementById("pinModal").style.display = "block";
  document.getElementById("mainContent").style.display = "none"; // Initially hide main content
});

const correctPIN = "1234";
let pinVerified = false; // Flag to check if PIN is verified

function checkPIN() {
  const enteredPIN = document.getElementById("pinInput").value;
  if (enteredPIN === correctPIN) {
    document.getElementById("pinModal").style.display = "none";
    document.getElementById("mainContent").style.display = "block"; // Show main content
    pinVerified = true; // Set the flag to true
  } else {
    document.getElementById("pinError").style.display = "block"; // Show error message
  }
}

function setTheme(themeName) {
  document.documentElement.className = themeName; // Apply the new theme
}

// Clear localStorage and reset dropdown options
document.getElementById("clearStorage").addEventListener("click", function () {
  localStorage.clear(); // Clear everything from localStorage

  // Clear the dropdown options
  const fileSelect = document.getElementById("fileSelect");
  fileSelect.innerHTML =
    '<option value="" disabled selected>Select a file to retrieve</option>'; // Reset dropdown

  alert("All stored files and keys have been cleared.");
  window.location.reload(); // Refresh the page
});

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

// Store file in the cache and localStorage (with encryption and hash for integrity)
async function storeFileInCache(file) {
  // Check if the file exceeds the maximum size
  if (file.size > MAX_FILE_SIZE) {
    alert(
      `The file "${file.name}" is too large (${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)} MB). Maximum allowed size is 5 MB.`
    );
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
    mimeType: file.type, // Store file type (e.g., image/jpeg, application/pdf)
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
    if (e.name === "QuotaExceededError") {
      alert(
        `Failed to store the file "${file.name}". The file is too large or localStorage is full.`
      );
      console.log("QuotaExceededError: Failed to store file in localStorage.");
      return;
    } else {
      console.log("Error storing file in localStorage:", e);
    }
  }
}

// Retrieve and decrypt file from the cache or localStorage
async function retrieveFileFromCache(fileName) {
  let cacheEntry =
    cache.get(fileName) || JSON.parse(localStorage.getItem(fileName));

  if (cacheEntry) {
    const encryptionKey = await getSecretKey(); // Use the saved key or generate a new one
    const decryptedData = await decryptData(
      new Uint8Array(cacheEntry.encryptedData),
      new Uint8Array(cacheEntry.iv),
      encryptionKey
    );
    const recalculatedHash = await hashData(decryptedData);

    // Check integrity
    if (recalculatedHash === cacheEntry.hash) {
      console.log(`File retrieved and integrity verified: ${fileName}`);

      // Create a Blob from the decrypted data and display the file
      const blob = new Blob([decryptedData], { type: cacheEntry.mimeType });
      const url = URL.createObjectURL(blob);

      // Display the file (PDFs, images, etc.)
      displayFile(blob, cacheEntry.mimeType, fileName);

      // Show modal with encryption details
      showRetrieveModal(fileName, cacheEntry.hash, cacheEntry.iv);
    } else {
      console.log("File integrity check failed!");
      document.getElementById(
        "output"
      ).innerText = `Integrity check failed for: ${fileName}`;
    }
  } else {
    console.log(`No file found for key: ${fileName}`);
    document.getElementById(
      "output"
    ).innerText = `No file found for: ${fileName}`;
  }
}

// Function to display files
function displayFile(blob, mimeType, fileName) {
  const url = URL.createObjectURL(blob); // Create object URL for the blob
  document.getElementById("output").innerHTML = ""; // Clear previous output
  if (mimeType.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    document.getElementById("output").appendChild(img);
  } else if (mimeType === "application/pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.width = "100%";
    iframe.height = "600px";
    document.getElementById("output").appendChild(iframe);
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.textContent = `Download ${fileName}`;
    document.getElementById("output").appendChild(a);
  }
}
