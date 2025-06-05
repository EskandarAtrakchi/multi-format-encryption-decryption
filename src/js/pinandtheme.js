document.addEventListener("DOMContentLoaded", () => {
    const themeToggleButton = document.getElementById("themeToggle");
    if (themeToggleButton) {
      themeToggleButton.addEventListener("click", () => {
        const currentTheme = document.documentElement.className;
        const newTheme = currentTheme === "light-theme" ? "dark-theme" : "light-theme";
        setTheme(newTheme);
      });
    }
  
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
  
    const savedTheme = localStorage.getItem("theme") || "light-theme";
    setTheme(savedTheme);
    document.getElementById("pinModal").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
  
    const pinSubmitButton = document.getElementById("pinSubmit");
    if (pinSubmitButton) {
      pinSubmitButton.addEventListener("click", checkPIN); // Add click listener for PIN submission
    }
  });
  
  // Rate limiting and PIN verification variables
  let pinVerified = false;
  let attemptCount = 0;
  const maxAttempts = 3;
  const lockoutTime = 30000;
  
  async function checkPIN() {
    if (attemptCount >= maxAttempts) {
      console.log("Too many attempts. Locking out for a while.");
      alert("Too many attempts. Please try again later.");
      setTimeout(() => { attemptCount = 0; }, lockoutTime); // Reset attempts after lockout time
      return;
    }
  
    const enteredPIN = document.getElementById("pinInput").value;
  
    try {
      // Send the PIN to the server for verification
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: enteredPIN }),
        credentials: "include", // Ensure session cookie is included
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("PIN verified successfully.");
        document.getElementById("pinModal").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
        pinVerified = true;
        document.getElementById("pinError").style.display = "none";
      } else {
        console.log("Incorrect PIN. Attempt count:", attemptCount + 1);
        attemptCount++;
        document.getElementById("pinError").style.display = "block";
      }
    } catch (error) {
      console.error("Error during PIN verification:", error);
    }
  }
  
  function setTheme(themeName) {
    document.documentElement.className = themeName;
    localStorage.setItem("theme", themeName); // Save the theme to local storage
  }
