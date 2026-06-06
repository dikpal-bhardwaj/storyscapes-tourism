const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ status: 'error', message: 'User already exists' });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            status: 'success',
            data: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                bucketList: [], // Clean empty array for new travelers
                token: generateToken(user._id) 
            }
        });
    } catch (error) { next(error); }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // SAFE CHECK: If bucketList doesn't exist yet, fall back to an empty array
            const localizedIds = (user.bucketList || []).map(id => id.toString());

            res.json({
                status: 'success',
                data: { 
                    _id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    bucketList: localizedIds, 
                    token: generateToken(user._id) 
                }
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (error) { next(error); }
};

// @desc    Update user profile (Name & Email)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        await user.save();

        // SAFE CHECK: Wrap optional list properties to keep runtime safe
        const localizedIds = (user.bucketList || []).map(id => id.toString());

        res.json({ 
            status: 'success', 
            data: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                bucketList: localizedIds 
            } 
        });
    } catch (error) { next(error); }
};

// @desc    Add or remove a destination from Bucket List
// @route   PUT /api/auth/bucketlist/:destId
// @access  Private
const toggleBucketList = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const destId = req.params.destId;

        const stringifiedBucketList = (user.bucketList || []).map(id => id.toString());

        if (stringifiedBucketList.includes(destId)) {
            user.bucketList = (user.bucketList || []).filter(id => id.toString() !== destId);
        } else {
            if (!user.bucketList) user.bucketList = [];
            user.bucketList.push(destId);
        }

        await user.save();
        
        // CRITICAL FIX: Just return the raw IDs. 
        // This prevents Mongoose from crashing if the User schema lacks a 'ref'.
        res.json({ status: 'success', data: user.bucketList });
    } catch (error) { 
        next(error); 
    }
};

// @desc    Get user's Bucket List
// @route   GET /api/auth/bucketlist
// @access  Private
const getBucketList = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('bucketList', 'name tagline heroImage');
        res.json({ status: 'success', data: user.bucketList || [] });
    } catch (error) { next(error); }
};

// @desc    Secure password modification route 
// @route   PUT /api/auth/changepassword
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save(); 

        res.json({ status: 'success', message: 'Password updated securely' });
    } catch (error) { next(error); }
};

module.exports = { 
    registerUser, 
    loginUser, 
    changePassword, 
    updateProfile, 
    toggleBucketList, 
    getBucketList 
};
