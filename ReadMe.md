# This is the structure of the main repo 


## Create the main directory
New-Item -ItemType Directory -Name "project-root"

## Create subdirectories
New-Item -ItemType Directory -Path "project-root/src/html"
New-Item -ItemType Directory -Path "project-root/src/css"
New-Item -ItemType Directory -Path "project-root/src/js"
New-Item -ItemType Directory -Path "project-root/lib"
New-Item -ItemType Directory -Path "project-root/bin"
New-Item -ItemType Directory -Path "project-root/assets/images"
New-Item -ItemType Directory -Path "project-root/tests"


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