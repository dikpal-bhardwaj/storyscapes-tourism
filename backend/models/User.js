const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    // NEW: Bucket List Array
    bucketList: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Destination' 
    }]
}, { timestamps: true });

// FIXED: Modern promise-based pre-save hook (no 'next' callback)
userSchema.pre('save', async function() {
    // If the password hasn't been modified (like when adding to a bucket list), skip hashing safely!
    if (!this.isModified('password')) {
        return; 
    }
    
    // If it's a new or updated password, generate salt and hash it
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
