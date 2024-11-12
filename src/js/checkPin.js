async function requestPin() {
    const pin = prompt("Please input your PIN to access the webpage");

    try {
        const response = await fetch('https://multi-format-encryption-decryption.onrender.com/getPin');
        const data = await response.json();

        if (pin === data.pin) {
            alert("Access granted. Welcome to the webpage!");
        } else {
            alert("Access denied.\nClosing the window.");
            window.location.reload();
        }
    } catch (error) {
        console.error("Error accessing backend:", error);
        alert("Error accessing backend service.\nClosing the window.");
        window.location.reload();
    }
}
