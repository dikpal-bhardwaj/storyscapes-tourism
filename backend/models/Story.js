const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    content: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
