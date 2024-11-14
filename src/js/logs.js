async function requestPin() {
    const pin = prompt("Please input your PIN to access the webpage");

    try {
        const token = localStorage.getItem('authToken');  // Assuming the token is stored in localStorage

        if (!token) {
            alert("You need to log in first.");
            window.location.href = "/login";  // Redirect to login page if no token
            return;
        }

        const response = await fetch('https://multi-format-encryption-decryption.onrender.com/getLogs', {
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in Authorization header
            },
        });

        const data = await response.json();

        if (data.pin && pin === data.pin) {
            alert("Access granted. Welcome to the webpage!");
        } else {
            alert("Access denied. Invalid PIN.");
            window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html";
        }
    } catch (error) {
        console.error("Error accessing backend:", error);
        alert("Error accessing backend service.\nPlease close this tab.");
        window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html";
    }
}
