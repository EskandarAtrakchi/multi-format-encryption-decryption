const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Authentication middleware to verify the token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user;  // Attach the user info to the request object
        next();  // Proceed to the next middleware or route handler
    });
}

// Protect the /getLogs route with authentication middleware
app.get('/getLogs', authenticateToken, (req, res) => {
    if (process.env.PIN) {
        res.json({ pin: process.env.PIN });
    } else {
        res.status(500).json({ error: 'PIN not set in .env file' });
    }
});

// Example login route that provides a JWT token after successful login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Authenticate user (for simplicity, using static values)
    if (username === 'admin' && password === 'password') {
        const user = { username };  // User object (could include more data)
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
