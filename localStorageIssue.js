//local storage issue

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