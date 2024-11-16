const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Signup successful', token });
    } catch (error) {
        console.log('Signup error:', error);

        res.status(500).json({ message: 'Signup failed1', error: error.message });
    }
};



const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};


module.exports = { signup, login };
