# This is the structure of the main repo 


## Create the main directory
New-Item -ItemType Directory -Name "project-root"

## Create subdirectories
```
New-Item -ItemType Directory -Path "project-root/src/html"
New-Item -ItemType Directory -Path "project-root/src/css"
New-Item -ItemType Directory -Path "project-root/src/js"
New-Item -ItemType Directory -Path "project-root/lib"
New-Item -ItemType Directory -Path "project-root/bin"
New-Item -ItemType Directory -Path "project-root/assets/images"
New-Item -ItemType Directory -Path "project-root/tests"
```
## Tree structure of the project 
```
/project-root
│
├── /bin                   # Scripts or executables (optional)
│
├── /lib                   # Libraries or third-party code (optional)
│   └── /vendor            # External libraries (e.g., jQuery, Bootstrap)
│
├── /src                   # Source files
│   ├── /css               # CSS stylesheets
│   │   └── styles.css     # Main stylesheet
│   │
│   ├── /js                # JavaScript files
│   │   └── script.js      # Main script
│   │
│   └── /html              # HTML files
│       └── index.html     # Main HTML file
│
├── /assets                # Images, fonts, etc.
│   └── /images            # Images folder
│
├── /tests                 # Automated tests (optional)
│
├── README.md              # Project description
│
├── package.json           # (Optional if using npm for package management)
│
└── .gitignore             # Git ignore file
```


## Project Implementation Summary

---

### Technologies and Languages

After discussing whether to use ViteJS with TypeScript or JavaScript with HTML, we settled on:

- **JavaScript**: For client-side logic.
- **HTML & DOM Manipulation**: Used for UI components such as file upload, dropdown menus, and displaying decrypted files.
- **Local Storage**: Used to store the encryption key and encrypted file data in a persistent manner.
- **Web Crypto API**: Provides secure cryptographic functions for encryption, decryption, and hashing.

---

### File Encryption and Decryption Workflow

- **AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)**: Chosen after research for its efficiency and authenticated encryption properties. AES-GCM helps achieve confidentiality by encrypting file data with a secure key.
- **IV (Initialization Vector)**: Research highlighted that data breaches often occur due to patterns in encrypted data. Using an IV introduces randomness, preventing patterns in the ciphertext.

**Implementation**:
- Generate or retrieve a 256-bit AES-GCM encryption key, which is stored as JSON in Local Storage.
- Convert the file to an `ArrayBuffer`, encrypt it with the key, and store the result (encrypted data and IV) in Local Storage and memory cache.

---

### Key Management

- **Local Storage**: Used to store the encryption key, allowing it to be retrieved on the same machine at any time.
- **Key Persistence**: On the first run, the application generates a new key and saves it in Local Storage. For future uses, the same key is retrieved, ensuring consistency and sustainability.

---

### Data Integrity Mechanism

We used **SHA-256 Hashing** to create a hash of the file data before encryption. This hash is then used later to verify the file’s integrity upon decryption by comparing it with a hash of the decrypted data, thereby achieving integrity.

**Team Rationale**:
- SHA-256 guarantees data integrity by detecting any accidental or intentional alterations in the file contents.

---

### File Storage and Retrieval

- **File Storage in Cache**: Local Storage is used for fast and easy storage and retrieval.
- **Decryption Process**: On decryption, the application retrieves the encrypted data, decrypts it with the stored key, verifies integrity using the SHA-256 hash, and displays the file only if integrity is confirmed.

**File Display Formatting**:
- After decryption, files are displayed using `Blob`, URLs, and DOM elements like `img`, `iframe`, or download links.

---

### Cryptographic Mechanisms - Rationale

- **AES-GCM**: Selected for secure and authenticated encryption. This symmetric encryption method (using one key for both encryption and decryption) is efficient, fast, and allows more storage, making it well-suited for Local Storage use.
- **SHA-256**: Ensures data integrity, preventing accidental or intentional corruption.
- **IV (Initialization Vector)**: Prevents repeated data patterns and makes ciphertexts unique for each encryption, even when the same data is encrypted multiple times.

---

### Conclusion

To achieve the CIA principles (Confidentiality, Integrity, Availability), we followed this approach:

- **AES-GCM**: Achieves confidentiality.
- **SHA-256**: Achieves integrity.

When both are successfully achieved, the file becomes available in Local Storage.
