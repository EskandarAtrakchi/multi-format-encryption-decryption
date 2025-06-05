document.getElementById("logoutBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
        // Notify the user
        alert("You logged out successfully.");

        // Open the image in a new window
        let newWindow = window.open("https://www.meme-arsenal.com/memes/e5ca881883338283308186d277309bee.jpg", "_blank");

        // Close the current window
        window.close();

        // If the window.close() doesn't work because it wasn't opened by script,
        // you could try redirecting to the image instead.
        if (newWindow === null) {
            window.location.href = "https://www.meme-arsenal.com/memes/e5ca881883338283308186d277309bee.jpg";
        }
    }
});
