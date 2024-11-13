window.addEventListener("load", () => {
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
    // Apply default theme and show PIN modal on page load
    const savedTheme = localStorage.getItem("theme") || "light-theme"; // Load saved theme or default to light
    setTheme(savedTheme);
  });
  
  // Function to set the theme
  function setTheme(themeName) {
    document.documentElement.className = themeName; // Apply the new theme
    localStorage.setItem("theme", themeName); // Save the theme to local storage
  }
  