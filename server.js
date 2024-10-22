// Import modules at the top
require('dotenv').config(); // Load environment variables from .env
const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const connectDB = require('./config/db'); // Import database connection
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json()); // Middleware to parse JSON
app.use(bodyParser.json()); // Middleware to parse JSON (not needed if express.json() is used)
app.use('/api/auth', authRoutes); // Set up auth routes
app.use('/api/admin', adminRoutes); // Set up admin routes

// Serve the static HTML/CSS/JS files
app.use(express.static(__dirname + '/public'));

// In-memory storage for votes
let votes = {
    candidate1: 0,
    candidate2: 0,
    candidate3: 0
};

// API route for submitting votes
app.post('/api/vote', (req, res) => {
    const { candidate } = req.body;

    if (!votes.hasOwnProperty(candidate)) {
        return res.status(400).json({ success: false, message: "Invalid candidate." });
    }

    // Increment the vote count for the chosen candidate
    votes[candidate]++;
    res.json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
