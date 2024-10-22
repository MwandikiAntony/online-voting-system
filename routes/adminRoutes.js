const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify admin user
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        // Check if user is admin (you can add a role field in your User model)
        if (user.role !== 'admin') return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Add a candidate
router.post('/add-candidate', verifyAdmin, (req, res) => {
    // Logic to add a candidate to the database
});

// Get voting results
router.get('/results', verifyAdmin, (req, res) => {
    // Logic to retrieve and send voting results
});

module.exports = router;
