const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (or specify an origin if needed)
app.use(cors());

// Serve static files if needed (optional)
app.use(express.static('public'));

// Endpoint to get the PIN
app.get('/getPin', (req, res) => {
    if (process.env.PIN) {
        res.json({ pin: process.env.PIN });
    } else {
        res.status(500).json({ error: 'PIN not set in .env file' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
