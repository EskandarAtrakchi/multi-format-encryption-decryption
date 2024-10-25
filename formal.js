
async function encryptData(data, key)
{
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt
    (
        {name: "AES_GCM", iv:iv},
        key,
        new TextEncoder().encode(data)
    );

    return
    {
        iv: btoa(String.fromCharCode(new Uint8Array(iv))),
        data: btoa(String.fromCharCode(new Uint8Array(encrypted)))
    };

}//end of encrypted data


