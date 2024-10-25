async function deriveKeyFromPin(pin) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(pin),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const salt = encoder.encode("random_salt");  // Use a fixed, unique salt
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    return key;
}

async function encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));  // Generate a random IV
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        new TextEncoder().encode(data)
    );

    // Return both the IV and the encrypted data as base64 strings
    return {
        iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
        data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
}

async function decryptData(encryptedData, iv, key) {
    const ivArray = new Uint8Array(atob(iv).split("").map(char => char.charCodeAt(0)));
    const encryptedArray = new Uint8Array(atob(encryptedData).split("").map(char => char.charCodeAt(0)));

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivArray },
        key,
        encryptedArray
    );

    return new TextDecoder().decode(decrypted);
}

async function produceAndLocatePin(pin) {
    const key = await deriveKeyFromPin(pin);
    const encryptedPin = await encryptData(pin, key);

    // Store the encrypted PIN and IV in local storage
    localStorage.setItem("user_pin", JSON.stringify(encryptedPin));
}

async function verifyPin(inputPin) {
    const storedData = JSON.parse(localStorage.getItem("user_pin"));
    if (!storedData) return false;

    const key = await deriveKeyFromPin(inputPin);
    try {
        const decryptedPin = await decryptData(storedData.data, storedData.iv, key); //it will decrypt the stored pin using the key and IV
        return decryptedPin === inputPin; //it will return the decrypted pin if the details all match
    } catch {
        return false; // will not return the pin if the details don't match
    }
}

async function promptForPin() 
{//open function
    const storedData = localStorage.getItem("user_pin"); //retrives the pin from the local storage
    const isValid = true; //checks if the pin is valid and will keep looping until it is or they run out of attempts
    let attempt =0; //checks the amount of times a user gets the wrong pin

    while(isValid){ //keeps looping to ask the user for their pin if they get it correct (Will add a counter to stop people from password bashing)
        /*Accidently discovered that the code for the website cannot be accessed while the loop is in action, this helps us prevent attacks */
    if (!storedData) {
        // No PIN exists, ask the user to create one
        let newPin = prompt("Create a new PIN:"); //asks the user to create a pin
        let confirmPin = prompt("Confirm your PIN:"); //asks the user to confirm their pin

        if (newPin === confirmPin) { // this checks if the pins match, when the user is creating a pin
            await produceAndLocatePin(newPin); //performs the function to create, encrypt and store the pin
            alert("PIN has been set successfully!");
            isValid = false; //breaks the while loop
        } else {
            alert("PINs did not match. Please try again.");
            
        }
    } else {
        // Prompt user to enter existing PIN
        
        let inputPin = prompt("Enter your PIN:"+" Attempt: "+attempt); //asks for the pin and counts the attempts the user has tried

        const isVerified = await verifyPin(inputPin);
        
        if (isVerified) {
            alert("PIN verified successfully!");
            isValid = false;
        } else {
            alert("Incorrect PIN. Please try again.");
            attempt++;
        }
        
        if(attempt == 3)
        {
            alert("You have reached your max attempts, closing application now!");
            window.close();
            isValid = false;
          
        }

    }
}
}

// Run the function to check and prompt for a PIN
promptForPin();
