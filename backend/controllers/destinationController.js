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

module.exports = { getDestinations, seedDestinations };
