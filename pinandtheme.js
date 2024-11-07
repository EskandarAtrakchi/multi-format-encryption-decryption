document.addEventListener("DOMContentLoaded", () => {
    // Select the theme toggle button
    const themeToggleButton = document.getElementById("themeToggle");
    if (themeToggleButton) {
      // Add event listener for the button click
      themeToggleButton.addEventListener("click", () => {
        const currentTheme = document.documentElement.className;
        const newTheme = currentTheme === "light-theme" ? "dark-theme" : "light-theme";
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
          alert("Access Denied. You must enter the correct PIN to access the site.");
        } else {
          document.getElementById("pinModal").style.display = "none"; // Close the modal if PIN is verified
        }
      });
    }
  
    // Apply default theme and show PIN modal on page load
    const savedTheme = localStorage.getItem("theme") || "light-theme"; // Load saved theme or default to light
    setTheme(savedTheme);
    document.getElementById("pinModal").style.display = "block"; // Show the PIN modal
    document.getElementById("mainContent").style.display = "none"; // Hide main content initially
  
    // Attach event listener to the PIN submission button
    const pinSubmitButton = document.getElementById("pinSubmit");
    if (pinSubmitButton) {
      pinSubmitButton.addEventListener("click", checkPIN); // Add click listener for PIN submission
    }
  });
  

  let pinVerified = false; // Flag to check if PIN is verified
  
  // Function to check the entered PIN
  function checkPIN() {
    const enteredPIN = document.getElementById("pinInput").value;
    if (enteredPIN === correctPIN) {
      document.getElementById("pinModal").style.display = "none"; // Hide modal if PIN is correct
      document.getElementById("mainContent").style.display = "block"; // Show main content
      pinVerified = true; // Set the flag to true
      document.getElementById("pinError").style.display = "none"; // Hide error message if correct
    } else {
      document.getElementById("pinError").style.display = "block"; // Show error message
    }
  }
  
  // Function to set the theme
  function setTheme(themeName) {
    document.documentElement.className = themeName; // Apply the new theme
    localStorage.setItem("theme", themeName); // Save the theme to local storage
  }