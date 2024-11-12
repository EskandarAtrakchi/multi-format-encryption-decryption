async function requestPin() {
    const pin = prompt("Please input your PIN to access the webpage");

    try {
        const response = await fetch('https://multi-format-encryption-decryption.onrender.com/getPin');
        const data = await response.json();

        if (pin === data.pin) {
            alert("Access granted. Welcome to the webpage!");
        } else {
            alert("Access denied.\nPlease close this tab.");
            window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html"; 
        }
    } catch (error) {
        console.error("Error accessing backend:", error);
        alert("Error accessing backend service.\nPlease close this tab.");
        window.location.href = "https://eskandaratrakchi.github.io/multi-format-encryption-decryption/src/html/explaination.html"; 
    }
}
