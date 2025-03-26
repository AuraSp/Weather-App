import winston from 'winston';
import 'winston-mongodb';
import dotenv from 'dotenv';

dotenv.config();


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: 'src/logs/error.log',
            level: 'error',
        }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: 'src/logs/info.log', level: 'info'
        }),


        // IF UNCOMMENT `transport` below - 
        // SERVER FUNCTION LOGS WILL BE SENT TO DB WITH THE CITIES
        
        // new winston.transports.MongoDB({
        //     db: process.env.MONGO_URI ?? 'mongodb://localhost:27017/logs,
        //     collection: 'logs'
        // }),
    ],
});

export default logger;