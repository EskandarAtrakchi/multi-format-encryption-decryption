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
