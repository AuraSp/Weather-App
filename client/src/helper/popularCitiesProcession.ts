
import { PopularCities } from '../types/cities';

//Helper function to get the most frequent value in storage
export const processMostFrequentCities = (popularCities: PopularCities[]): PopularCities[] => {
    return [...popularCities]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
};