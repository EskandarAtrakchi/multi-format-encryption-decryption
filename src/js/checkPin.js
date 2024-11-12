async function requestPin() {
    const pin = prompt("Please input your PIN to access the webpage");

    try {
        const response = await fetch('https://multi-format-encryption-decryption.onrender.com/getPin');
        const data = await response.json();

        if (pin === data.pin) {
            alert("Access granted");
        } else {
            alert("Access denied");
            window.location.href = "about:blank"; // Redirect if access is denied
        }
    } catch (error) {
        console.error("Error accessing backend:", error);
        alert("Error accessing backend service.");
        window.location.href = "about:blank"; // Redirect if there is an error
    }
}
