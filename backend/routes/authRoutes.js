const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword, updateProfile, toggleBucketList, getBucketList } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/changepassword', protect, changePassword);

// NEW ROUTES
router.put('/profile', protect, updateProfile);
router.get('/bucketlist', protect, getBucketList);
router.put('/bucketlist/:destId', protect, toggleBucketList);

module.exports = router;
