// Purpose: To allow the user to switch between light and dark themes
function setTheme(themeName) {
    document.documentElement.className = themeName;
    localStorage.setItem('theme', themeName); // Save theme to local storage
}

// Apply saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    setTheme(savedTheme);
});