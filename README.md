# security-fundamentals

## There are two types of cryptographic operations being used: **AES-GCM encryption** for confidentiality and **SHA-256 hashing** for integrity.

### 1. **AES-GCM Encryption (Confidentiality)**
   - **AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)** is used for encrypting and decrypting the data (files in this case). AES-GCM is a symmetric encryption algorithm that provides both confidentiality (by encrypting the data) and data authenticity (via message authentication codes).
   - The key is generated using `window.crypto.subtle.generateKey` with the `AES-GCM` algorithm and a key length of 256 bits.
   - The encryption is done using the `window.crypto.subtle.encrypt` function, with a randomly generated **Initialization Vector (IV)** for each encryption operation. The IV ensures that even if the same data is encrypted multiple times, the ciphertext will be different.
   - The decryption process uses `window.crypto.subtle.decrypt` with the same IV and key to decrypt the data.
 
### 2. **SHA-256 Hashing (Integrity)**
   - **SHA-256 (Secure Hash Algorithm 256-bit)** is used to create a hash of the file's contents. Hashing ensures **data integrity** by providing a unique fingerprint of the data.
   - The `hashData` function uses `window.crypto.subtle.digest` with the SHA-256 algorithm to compute the hash of the file. The hash is then Base64-encoded and stored with the encrypted file.
   - When retrieving the file, the hash is recalculated and compared with the stored hash to ensure the file has not been altered (i.e., verifying its integrity).

### Summary
- **Encryption (AES-GCM)**: The data is encrypted using AES-GCM to provide confidentiality, ensuring that only those with the correct key can decrypt the data.
- **Hashing (SHA-256)**: The data is hashed using SHA-256 to provide integrity, ensuring that the data has not been tampered with after being stored.

So, **SHA-256** is used for hashing (integrity), but the encryption itself is done using **AES-GCM**, not SHA-256.