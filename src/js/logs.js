async function requestPin() {
    const pin = prompt("Please input your PIN to access the webpage");

    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');  

        // Check if the token exists
        if (!token) {
            alert("You need to log in first.");
            window.location.href = "/getLogs";  // Redirect to getLogs page if no token
            return;
        }

        // Send the token in the Authorization header
        const response = await fetch('https://multi-format-encryption-decryption.onrender.com/getLogs', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token for authentication
            },
        });

        const data = await response.json();

        // Handle the response from the server
        if (response.ok) {  // Successful request
            if (data.pin && pin === data.pin) {
                alert("Access granted. Welcome to the webpage!");
            } else {
                alert("Access denied. Invalid PIN.");
                window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html";
            }
        } else {
            // Handle authentication failure or other server issues
            if (data.message === 'Unauthorized access: No token provided' || data.message === 'Forbidden: Invalid token') {
                alert("Invalid or expired token. Please log in again.");
                window.location.href = "/getLogs";  // Redirect to getLogs page if token is invalid or expired
            } else {
                console.error("Error accessing backend:", data.message || 'Unknown error');
                alert("Error accessing backend service.\nPlease close this tab.");
                window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html";
            }
        }
    } catch (error) {
        console.error("Error accessing backend:", error);
        alert("Error accessing backend service.\nPlease close this tab.");
        window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html";
    }
}
