import dotenv from 'dotenv';
import logger from './config/logger';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;


// MongoDB Connection
const mongoURI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/serverLogs';

mongoose.connect(mongoURI)
    .then(() =>
        logger.log({
            level: 'warn',
            message: `Connected to Mongo DB`
        })
    )
    .catch((error) =>
        logger.error({
            level: 'error',
            message: `MongoDB connection error: ${error}`
        })
    );

// Start the server
app.listen(PORT, () => {
    logger.log({
        level: 'info',
        message: `Server is running at port ${PORT}`
    });
});