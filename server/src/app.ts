import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './config/logger';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

// GET all cities rout
app.get('/api/places', async (req, res) => {
    try {
        const response = await axios.get('https://api.meteo.lt/v1/places');

        res.json(response.data);
    } catch (error) {

        console.debug(`Error fetching places:, ${error}`);

        res.status(500).json({ error: 'Failed to fetch places data' });
    }
});

// GET city by `param`
app.get('/api/places/:cityCode/forecasts/long-term', async (req, res) => {
    const { cityCode } = req.params;
    try {
        const response = await axios.get(`https://api.meteo.lt/v1/places/${cityCode}/forecasts/long-term`);

        res.json(response.data);
    } catch (error) {

        console.log(`Error fetching weather data for ${cityCode}:, ${error}`);

        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// GET weather data for multiple default cities
app.get('/api/default-places/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const response = await axios.get(`https://api.meteo.lt/v1/places/${code}/forecasts/long-term`);
        const { place, forecastTimestamps } = response.data;

        res.json({
            place: {
                code: place.code,
                name: place.name,
            },
            forecastTimestamps: forecastTimestamps,
        });
    } catch (error) {
        console.error(`Error fetching weather data for ${code}:`, error);
        res.status(500).json({ error: `Failed to fetch weather data for ${code}` });
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


// LOG MODEL
const logSchema = new mongoose.Schema({
    city: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
})
const Log = mongoose.model('Log', logSchema);

// LOG ROUTE
app.post('/log-city', async (req, res) => {
    const { city } = req.body;


    try {
        const newLog = new Log({ type: 'city', city: city });
        await newLog.save();
        logger.info(`City selected: ${city}`);

        res.status(201).json({
            status: 'success',
            message: 'City logged successfully',
            log: newLog,
        });
    } catch (err) {
        logger.error(`Failed to log city: ${err}`);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to log city',
        });
    }
});

app.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find();

        logger.info(`Logs fined: ${logs}`);

        res.status(200).json({
            status: 'success',
            results: logs.length,
            logs: logs,
        })
    } catch (err) {

        const error = err as Error;
        logger.error(`Failed to fetch logs: ${error.message}`);

        res.status(500).json({
            status: "fail",
            message: 'Failed to fetch logs'
        });
    }
})

export default app;