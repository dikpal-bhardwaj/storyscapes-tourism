const Destination = require('../models/Destination');

const getDestinations = async (req, res, next) => {
    try {
        const destinations = await Destination.find({});
        res.json({ status: 'success', data: destinations });
    } catch (error) {
        next(error);
    }
};

const seedDestinations = async (req, res, next) => {
    try {
        await Destination.deleteMany({});

        const mockData = [
            {
                name: "Shillong",
                tagline: "Where Clouds Whisper",
                heroImage: "/assets/images/shillong-hero.jpg",
                description: "As the mist slowly rolled through the hills, the quiet rhythm of Shillong unfolded. It isn't just a place; it's a feeling of ancient pines and rain-washed streets.",
                culture: "Home to the Khasi people and their sacred groves, where nature and humanity share a silent, centuries-old pact.",
                featured: true
            },
            {
                name: "Kyoto",
                tagline: "The Silent Temples of Autumn",
                heroImage: "/assets/images/kyoto-hero.jpg",
                description: "Time moves differently in Kyoto. Beneath the canopy of burning red maple leaves, the wooden temples stand as guardians of a forgotten era.",
                culture: "A city where the art of the tea ceremony is preserved as a meditation on the present moment.",
                featured: true
            }
        ];

        const createdDestinations = await Destination.insertMany(mockData);
        res.status(201).json({ status: 'success', message: 'Storyscapes seeded!', data: createdDestinations });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res, next) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({ status: 'success', data: destination });
    } catch (error) { next(error); }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) {
            return res.status(404).json({ status: 'error', message: 'Destination not found in the archives.' });
        }
        res.json({ status: 'success', message: 'Destination permanently removed.' });
    } catch (error) { next(error); }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => { // <-- CHANGED TO const AND REMOVED THE 's'
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({ 
                success: false, 
                message: 'Destination not found in the atlas.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: destination 
        });
        
    } catch (error) {
        console.error("Update Destination Error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error while updating destination.',
            error: error.message
        });
    }
};

// @desc    Get a single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.id);
        
        if (!destination) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Destination not found in the atlas.' 
            });
        }

        res.json({ status: 'success', data: destination });
    } catch (error) {
        next(error);
    }
};

// Add getDestination to your exports at the bottom!
module.exports = { 
    getDestinations, 
    getDestination, // <-- Add this
    seedDestinations, 
    createDestination, 
    updateDestination, 
    deleteDestination 
};
