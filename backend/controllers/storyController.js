const Story = require('../models/Story');

// @desc    Get all stories (with optional destination filter)
// @route   GET /api/stories
const getStories = async (req, res, next) => {
    try {
        // 1. Check if the frontend is asking for a specific destination
        const filter = {};
        if (req.query.destination) {
            filter.destination = req.query.destination;
        }

        // 2. Fetch stories and populate using 'user' (matching your updated schema)
        const stories = await Story.find(filter)
            .populate('destination', 'name tagline heroImage')
            .populate('user', 'name email') // Changed from 'author' to 'user'
            .sort({ createdAt: -1 });
            
        res.json({ status: 'success', data: stories });
    } catch (error) { next(error); }
};

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private (Any logged-in user)
const createStory = async (req, res, next) => {
    try {
        const newStoryData = {
            ...req.body,
            user: req.user._id // Changed from 'author' to 'user'
        };

        const story = await Story.create(newStoryData);
        res.status(201).json({ status: 'success', data: story });
    } catch (error) { next(error); }
};

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
const deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ status: 'error', message: 'Story not found.' });
        res.json({ status: 'success', message: 'Story erased from the journal.' });
    } catch (error) { next(error); }
};

// @desc    Get logged in user's stories
// @route   GET /api/stories/me
// @access  Private
const getMyStories = async (req, res, next) => {
    try {
        // Changed from 'author' to 'user' to match schema
        const stories = await Story.find({ user: req.user._id })
            .populate('destination', 'name heroImage')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: stories });
    } catch (error) { next(error); }
};

// @desc    Get a single story by ID
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('user', 'name')
            .populate('destination', 'name');

        if (!story) return res.status(404).json({ status: 'error', message: 'Story not found.' });

        res.json({ status: 'success', data: story });
    } catch (error) { next(error); }
};

module.exports = { getStories, getStoryById, createStory, deleteStory, getMyStories };
