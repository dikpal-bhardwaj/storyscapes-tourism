const destinationRoutes = require('./routes/destinationRoutes');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 

app.get('/api', (req, res) => {
    res.json({
        status: 'success',
        message: 'Storyscapes Tourism API is live and ready to serve stories.'
    });
});

app.use('/api/destinations', destinationRoutes);

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Route not found in the Storyscape.' });
});

app.use((err, req, res, next) => {
    console.error(`[Server Error]: ${err.stack}`);
    res.status(500).json({
        status: 'error',
        message: 'An unexpected server error occurred.'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
