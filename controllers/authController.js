require('dotenv').config(); // Load environment variables from .env file
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            if (user.username === username) {
                return res.status(400).json({ msg: 'Username already exists' });
            }
            if (user.email === email) {
                return res.status(400).json({ msg: 'Email already exists' });
            }
        }

        // Create new user instance
        user = new User({ username, email, password });

        // Hash password before saving to database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

     

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
            if (err) {
                console.error('JWT error:', err);
                return res.status(500).json({ msg: 'JWT token generation failed' });
            }
            const userDetail = { email: user.email }; // Only send necessary user details
            res.json({ token, user: userDetail });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
