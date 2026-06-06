const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('./models/User'); 
const Story = require('./models/Story'); 

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanupAdminStories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n[Database] MongoDB Connected successfully.');

        // 1. Find all admin users
        const admins = await User.find({ role: 'admin' });
        
        if (admins.length === 0) {
            console.log('[!] No admin accounts found in the database.');
            process.exit(0);
        }

        // Get an array of just the Admin IDs
        const adminIds = admins.map(admin => admin._id);

        // 2. Delete any story where the 'user' matches an Admin ID
        const result = await Story.deleteMany({ user: { $in: adminIds } });

        console.log(`\n[Success] Cleanup complete!`);
        console.log(`[Details] Safely deleted ${result.deletedCount} stories belonging to your admin account.`);
        
        process.exit(0);

    } catch (error) {
        console.error(`\n[Error] Failed to clean up stories: ${error.message}`);
        process.exit(1);
    }
};

cleanupAdminStories();
