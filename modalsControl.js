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