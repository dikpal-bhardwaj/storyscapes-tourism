const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const User = require('./models/User'); 
const Destination = require('./models/Destination');
const Story = require('./models/Story'); 

dotenv.config({ path: path.join(__dirname, '../.env') });

const storyImages = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504280390227-3151eb033b0e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533604101032-473d6e5a073f?q=80&w=1000&auto=format&fit=crop"
];

const titles = [
    "Lost and Found", "A Morning to Remember", "Tastes of the City", 
    "Beyond the Guidebook", "Chasing the Sunset", "Echoes of the Past", 
    "A Quiet Moment", "The Streets at Night", "Conversations with Locals",
    "A View from the Top"
];

const contents = [
    "I wasn't sure what to expect when I first arrived, but the atmosphere immediately pulled me in. I spent hours just walking without a map, letting the architecture and the sounds of daily life guide me. It's the kind of place that stays with you long after you've unpacked your bags at home.",
    "The food here is an absolute revelation. I found a tiny, unassuming spot tucked away in an alley, and it served the best meal of my life. The flavors told a story of centuries of tradition. I sat there watching the world go by, feeling incredibly lucky to be exactly where I was.",
    "Waking up before dawn was entirely worth it. I watched the first light hit the horizon, painting everything in shades of gold and copper. The silence was profound, broken only by the city slowly coming to life. These are the moments I travel for.",
    "Sometimes the best parts of a journey are the mistakes. I took the wrong train and ended up in a neighborhood untouched by tourism. The locals were so welcoming, sharing stories and coffee with a complete stranger. It was a beautiful reminder of our shared humanity."
];

const potentialTags = ["Adventure", "Culture", "Food", "Architecture", "Nature", "Photography", "Hidden Gem", "History"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomTags = () => {
    const shuffled = [...potentialTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
};

const seedStories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n[Database] MongoDB Connected successfully.');

        await Story.deleteMany();
        console.log('[Wipe] Cleared all old stories from the archive.');

        const targetEmail = "elena@example.com";
        const elena = await User.findOne({ email: targetEmail });

        if (!elena) {
            console.error(`[!] Error: Could not find user with email ${targetEmail}. Please make sure she is seeded!`);
            process.exit(1);
        }

        console.log(`[Found] Seeding stories for: ${elena.name} (${elena._id})`);

        const destinations = await Destination.find();
        if (destinations.length < 10) {
            console.error('[!] Error: You need at least 10 destinations in the database.');
            process.exit(1);
        }

        const shuffledDestinations = [...destinations].sort(() => 0.5 - Math.random());
        const selectedDestinations = shuffledDestinations.slice(0, 10);

        const storiesToInsert = selectedDestinations.map((destination) => {
            return {
                title: getRandom(titles),
                content: getRandom(contents),
                images: [getRandom(storyImages)], 
                user: elena._id,
                destination: destination._id,
                tags: getRandomTags() 
            };
        });

        await Story.insertMany(storiesToInsert);
        
        console.log(`\n[Success] Created exactly 10 unique stories for ${elena.name}!`);
        process.exit();

    } catch (error) {
        console.error(`\n[Error] Failed to seed stories: ${error.message}`);
        process.exit(1);
    }
};

seedStories();
