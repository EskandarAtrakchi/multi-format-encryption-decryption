const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



// Enable CORS for all origins (or specify an origin if needed)
app.use(cors());

// Serve static files if needed (optional)
app.use(express.static('css'));
app.use('/javascript', express.static(path.join(__dirname, "javascript")));
app.use(express.static('javascript'));

//creating a session timeout cookie, this goes inline with prevent unauthorized users on a shared device
app.use(session({
    secret: 'BobisSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 10000 //setting time 
    }
}))



//main route page
app.get('/', (req,res) => {
    
    if(req.session.views)
    {
        req.session.views++;
    } else {
        req.session.views =1;
    }

    res.sendFile(path.join(__dirname, 'views', 'index.html'), (err) => {
        if(err)
        {
            console.log("Error sending file: ",err);
            res.sendStatus(500);
        } else {
            console.log('Views: ${req.session.views}');
            console.log(`Session Expires in: ${(req.session.cookie.maxAge/1000).toFixed(1)}`)
        }
    });
})

app.get('/api/session-data', (req,res) => {
    res.json({views: req.session.views || 0});
});



// Endpoint to get the PIN
app.get('/getLogs', (req, res) => {
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
