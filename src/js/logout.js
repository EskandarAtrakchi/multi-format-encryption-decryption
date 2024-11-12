document.getElementById("logoutBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
        // Notify the user
        alert("You logged out successfully.");

        // Alternative action, since window.close() won't work directly:
        // window.close(); // Close the current tab
        window.location.href = "https://www.meme-arsenal.com/memes/e5ca881883338283308186d277309bee.jpg"; 
        // window.history.go(-10); 
    }
});
