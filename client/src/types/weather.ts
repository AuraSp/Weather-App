export interface Forecast {
    forecastTimeUtc: string;
    airTemperature: number;
    feelsLikeTemperature: number;
    windSpeed: number;
    windGust: number;
    windDirection: number;
    windDirectionCardinal: string;
    cloudCover: number;
    seaLevelPressure: number;
    relativeHumidity: number;
    totalPrecipitation: number;
    conditionCode: string;
}

export interface WeatherData {
    place: {
        code: string;
        name: string;
        administrativeDivision: string;
        country: string;
        countryCode: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    forecastType: string;
    forecastCreationTimeUtc: string;
    forecastTimestamps: Forecast[];
}