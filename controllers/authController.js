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
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const userDetail = {email: user.email, password: user.password} 
        jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: userDetail });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
