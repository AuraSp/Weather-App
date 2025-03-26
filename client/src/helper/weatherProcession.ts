import { Forecast } from '../types/weather';
import { weatherImage } from '../assets/data/weatherAssets';


//Helper function to process angles for wind direction
export const degToCompass = (num: number): string => {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    return arr[(val % 16)];
};

// Helper function to process forecast data
export const processForecastData = (forecastTimestamps: Forecast[]) => {

    // Find the forecast for the current hour
    const now = new Date();
    const nowDate = now.toLocaleDateString('lt-LT');
    const nowHour = `${String(now.getHours()).padStart(2, '0')}:00:00`;
    const currentHourUtc = `${nowDate} ${nowHour}`;

    const currentForecast = forecastTimestamps.find(
        (forecast) => forecast.forecastTimeUtc === currentHourUtc
    ) || null;

    if (currentForecast) {
        currentForecast.windDirectionCardinal = degToCompass(currentForecast.windDirection);
    }

    const iconPath = currentForecast
        ? weatherImage[currentForecast.conditionCode]?.icon || ''
        : '';
    const wallpaperPath = currentForecast
        ? weatherImage[currentForecast.conditionCode]?.wallpaper || ''
        : '';
console.log(wallpaperPath)
    // Collect one forecast per day for the next 5 days
    const dailyForecast: Forecast[] = [];
    let currentDate = '';

    for (const forecast of forecastTimestamps) {
        // By looping data, get 'forecastTImeUtc'
        // Split retrieved full date into two indexes
        // `2025-03-25 00:00:00` -> `(2)['2025-03-25', '00:00:00']`
        // Take only the date itself `[0]` -> `2025-03-25`
        const date = forecast.forecastTimeUtc.split(' ')[0];


        // Check if this forecast belongs to a new day:
        // Since `date !== currentDate("2025-03-22" !== ''):
        // Add the forecast to the dailyForecast array.
        // Update currentDate to "2025-03-22".
        //*** For each forecast, we check if its date `date` is different from `currentDate`
        if (date !== currentDate) {
            if (forecast.windDirection) {
                forecast.windDirectionCardinal = degToCompass(forecast.windDirection);
            }
            dailyForecast.push(forecast);
            currentDate = date;
        }

        // Stop after collecting 5 days
        if (dailyForecast.length >= 5) break;
    }


    return { currentForecast, dailyForecast, currentIcon: iconPath, currentWallpaper: wallpaperPath };
};