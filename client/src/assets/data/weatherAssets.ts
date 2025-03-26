
type WeatherImage = {
    wallpaper: string;
    icon: string;
};

type WeatherImages = {
    [key: string]: WeatherImage;
};

export const weatherImage: WeatherImages = {
    "clear": {
        wallpaper: "/backgrounds/clear.png",
        icon: '/icons/clear.svg'
    },
    "partly-cloudy": {
        wallpaper: "/backgrounds/partly-cloudy.png",
        icon: "/icons/partly-cloudy.svg"
    },
    "cloudy": {
        wallpaper: "/backgrounds/cloudy.png",
        icon: "/icons/cloudy.svg"
    },
    "cloudy-with-sunny-intervals": {
        wallpaper: "/backgrounds/cloudy-with-sunny-intervals.png",
        icon: "/icons/cloudy-with-sunny-intervals.svg"
    },
    "light-rain": {
        wallpaper: "/backgrounds/light-rain.png",
        icon: "/icons/light-rain.svg"
    },
    "rain": {
        wallpaper: "/backgrounds/rain.png",
        icon: "/icons/heavy-rain.svg"
    },
    "heavy-rain": {
        wallpaper: "/backgrounds/rain.png",
        icon: "/icons/heavy-rain.svg"
    },
    "thunder": {
        wallpaper: "/background/thunder.png",
        icon: "/icons/thunder.svg"
    },
    "isolated-thunderstorms": {
        wallpaper: "/background/thunder.png",
        icon: "/icons/isolated-thunderstorms.svg"
    },
    "thunderstorms": {
        wallpaper: "/background/thunder.png",
        icon: "/icons/thunderstorms.svg"
    },
    "heavy-rain-with-thunderstorms": {
        wallpaper: "/background/rain.png",
        icon: "/icons/heavy-rain-with-thunderstorms.svg"
    },
    "light-sleet": {
        wallpaper: "/background/sleet.png",
        icon: "/icons/light-sleet.svg"
    },
    "sleet": {
        wallpaper: "/background/sleet.png",
        icon: "/icons/sleet.svg"
    },
    "freezing-rain": {
        wallpaper: "/background/sleet.png",
        icon: "/icons/freezing-rain.svg"
    },
    "light-snow": {
        wallpaper: "/background/snow.png",
        icon: "/icons/light-snow.svg"
    },
    "snow": {
        wallpaper: "/background/snow.png",
        icon: "/icons/snow.svg"
    },
    "heavy-snow": {
        wallpaper: "/background/snow.png",
        icon: "/icons/heavy-snow.svg"
    },
    "fog": {
        wallpaper: "/background/fog.png",
        icon: "/icons/fog.svg"
    },
    "hail": {
        wallpaper: "/background/hail.png",
        icon: "/icons/hail.svg"
    }
};
