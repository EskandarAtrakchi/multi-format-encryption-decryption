document.addEventListener("DOMContentLoaded", () => {
  // Select the theme toggle button
  const themeToggleButton = document.getElementById("themeToggle");
  if (themeToggleButton) {
    // Add event listener for the button click
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

// Rate limiting and PIN verification variables
let pinVerified = false; // Flag to check if PIN is verified
let attemptCount = 0;
const maxAttempts = 3;
const lockoutTime = 30000; // Lockout time in milliseconds (e.g., 30 seconds)
const storedHashedPIN =
  "82f084acdaefea0ed3254cb48ac75406bdeb5eba249ae22237e00b4dceb2bf1b"; // Precomputed hash of the correct PIN with a fixed salt
const fixedSalt = "SOME_RANDOM_SALT"; // Fixed salt used for hashing

// Function to check the entered PIN
async function checkPIN() {
  // Rate-limiting check

  if (attemptCount >= maxAttempts) {
    console.log("Too many attempts. Locking out for a while.");
    alert("Too many attempts. Please try again later.");
    setTimeout(() => {
      attemptCount = 0;
    }, lockoutTime); // Reset attempts after lockout time
    return;
  }

  const enteredPIN = document.getElementById("pinInput").value;
  console.log("Entered PIN:", enteredPIN); // Log the entered PIN

  try {
    const hashedEnteredPIN = await hashPIN(enteredPIN + fixedSalt); // Use the fixed salt during hashing
    console.log("Hashed Entered PIN:", hashedEnteredPIN); // Log the hashed entered PIN

    
    // Compare the dynamically generated hash with the precomputed hash
    if (hashedEnteredPIN === storedHashedPIN) {
      
      console.log("PIN verified successfully.");
      document.getElementById("pinModal").style.display = "none"; // Hide modal if PIN is correct
      document.getElementById("mainContent").style.display = "block"; // Show main content
      pinVerified = true; // Set the flag to true
      document.getElementById("pinError").style.display = "none"; // Hide error message if correct
      
    } else {
      console.log("Incorrect PIN. Attempt count:", attemptCount + 1); // Log incorrect PIN attempt
      attemptCount++; // Increment attempt count on incorrect PIN
      document.getElementById("pinError").style.display = "block"; // Show error message
    }

  } catch (error) {
    console.error("Error during PIN hashing:", error); // Catch any hashing errors
  }
}

// Function to hash the PIN using SHA-256
async function hashPIN(pin) {
  console.log("Hashing PIN:", pin); // Log the PIN before hashing

  const msgBuffer = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Hashed PIN (SHA-256):", hashHex); // Log the hashed result
  return hashHex;
}

// Function to set the theme
function setTheme(themeName) {
  document.documentElement.className = themeName; // Apply the new theme
  localStorage.setItem("theme", themeName); // Save the theme to local storage
}
