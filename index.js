const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto= require('crypto');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



// Enable CORS for all origins (or specify an origin if needed)
app.use(cors());

// Serve static files if needed (optional)



//middleware setup!
app.use(bodyParser.json());

//creating a session timeout cookie, this goes inline with prevent unauthorized users on a shared device
app.use(session({
    secret: 'BobisSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        name:'mySessionCookie',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30000 //setting time 
    }
}));

// Precomputed hash of the correct PIN (using SHA-256)
const storedHashedPIN = '82f084acdaefea0ed3254cb48ac75406bdeb5eba249ae22237e00b4dceb2bf1b';
const fixedSalt = 'SOME_RANDOM_SALT'; // Fixed salt used for hashing

let attemptCount = 0;
const maxAttempts = 3;
const lockoutTime = 30000; // Lockout time in milliseconds (30 seconds)

function getPINFromEnv() {
    if (process.env.PIN) {
        return process.env.PIN;
    } else {
        console.error('PIN not set in .env file');
        return null;
    }
}



app.post('/login', async (req, res) => {
    // Checking the login attempts
    if (req.session.attemptCount >= maxAttempts) {
        return res.status(429).json({ success: false, message: 'Too many attempts, please try again later' });
    }

    const { pin } = req.body;
    const correctPIN = getPINFromEnv();

    if (!correctPIN) {
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    try {
        const hashedEnteredPIN = await hashPIN(pin + fixedSalt);
        const hashedCorrectPIN = await hashPIN(correctPIN + fixedSalt);

        if (hashedEnteredPIN === hashedCorrectPIN) {
            // If the PIN is right, set session and send response
            req.session.isAuthenticated = true;
            req.session.attemptCount = 0;
            res.json({ success: true, message: 'PIN Verified. Access granted.' });
        } else {
            req.session.attemptCount = (req.session.attemptCount || 0) + 1;
            res.status(400).json({ success: false, message: 'Incorrect PIN' });
        }
    } catch (err) {
        console.error('Error during PIN Verification: ', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

async function hashPIN(pin) 
{
    const encoder = new TextEncoder(); 
    const msgBuffer = encoder.encode(pin); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
    .map((b) => b.toString(16).padStart(2,'0'))
    .join('');
}

function isAuthenticated(req,res,next){
    if(req.session.isAuthenticated)
    {
        return next();
    }
    return res.status(401).json({success:false, message:'You need to log in '})
}

//changes made in this section
// Main route page



app.get('/api/session-status', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
      // Session is valid, return a response indicating the user is authenticated
      res.json({ isAuthenticated: true });
    } else {
      // Session expired or not authenticated
      res.json({ isAuthenticated: false });
    }
  });
  


app.post('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err)
        {
            return res.status(500).send('Failed to destory the session');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});


// Endpoint to get the PIN
app.get('/getLogs', isAuthenticated, (req, res) => {
    const pin = getPINFromEnv();
    if (pin) {
        res.json({ pin: pin });
    } else {
        res.status(500).json({ error: 'PIN not set in .env file' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
