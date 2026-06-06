const express = require('express');
const router = express.Router();
const { getStories, getStoryById, createStory, deleteStory, getMyStories } = require('../controllers/storyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getStories);
router.get('/me', protect, getMyStories);
router.get('/:id', getStoryById);
router.post('/', protect, createStory);
router.delete('/:id', protect, deleteStory); // Users can't delete yet, or you can remove 'admin' if you want them to delete their own.

module.exports = router;
