const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ status: 'error', message: 'User already exists' });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            status: 'success',
            data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
        });
    } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                status: 'success',
                data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (error) { next(error); }
};

const changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        user.password = req.body.newPassword;
        await user.save(); // The pre-save hook will hash this automatically!

        res.json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) { next(error); }
};

module.exports = { registerUser, loginUser, changePassword };
