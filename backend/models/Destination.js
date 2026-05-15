const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	tagline: { type: String, required: true },
	heroImage: { type: String, required: true },
	description: { type: String, required: true },
	culture: { type: String },
	featured: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);
