// On page load, repopulate fileSelect with stored files
window.addEventListener('load', () => {
    // Clear the dropdown first to avoid duplicates
    const fileSelect = document.getElementById("fileSelect");
    fileSelect.innerHTML = '<option value="" disabled selected>Select a file to retrieve</option>';

    // Iterate over localStorage and populate the dropdown with file names
    for (let i = 0; i < localStorage.length; i++) {
        const fileName = localStorage.key(i);
        updateFileSelect(fileName);
    }
});

// Function to update the file selection dropdown
function updateFileSelect(fileName) {
    const fileSelect = document.getElementById("fileSelect");
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    fileSelect.appendChild(option);
}