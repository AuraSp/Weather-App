import { useState, useMemo, useEffect } from 'react';
import { weatherImage } from './assets/data/weatherAssets';
import { Forecast, WeatherData, } from './types/weather';
import { Cities, PopularCities } from './types/cities';
import { ReactSVG } from 'react-svg'
import { TiWeatherWindy } from "react-icons/ti";
import { GiWaterDrop } from "react-icons/gi";
import { Row, Col, Form, Card, Spinner, Button } from 'react-bootstrap';
import { getCurrentTimeFormatted } from './helper/dateFormationProcession';
import { processForecastData } from './helper/weatherProcession';
import { processMostFrequentCities } from './helper/popularCitiesProcession';
import { useScreenSize } from './helper/screenSizeFixation';


function App() {

  const DEFAULT_CITY_CODE = 'vilnius';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cities, setCities] = useState<Cities[]>([]);
  const [defaultCity, setDefaultCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentForecast, setCurrentForecast] = useState<Forecast | null>(null);
  const [dailyForecast, setDailyForecast] = useState<Forecast[]>([]);
  const [popularCities, setPopularCities] = useState<PopularCities[]>([]);
  const [currentWallpaper, setCurrentWallpaper] = useState<string>('');
  const [currentIcon, setCurrentIcon] = useState<string>('');



  //Helper functions
  const screenSize = useScreenSize();
  const currentTimeFormatted = getCurrentTimeFormatted();
  const processedCities: PopularCities[] = useMemo(
    () => processMostFrequentCities(popularCities),
    [popularCities]
  );


  //Logger function
  const logSelectedCity = async (city: string) => {
    try {
      const apiUrl = 'http://localhost:3001/log-city';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.info('City logged:', data.log.city, data.log.timestamp.slice(0, 10));
    } catch (error) {
      console.error('Error:', error);
    }
  };




  useEffect(() => {
    const mostViewed = JSON.parse(localStorage.getItem('mostViewedCities') || '[]');

    if (mostViewed.length === 0) {
      getDefaultPlaces();
    } else {
      setPopularCities(mostViewed)
    }
  }, [])

  useEffect(() => {
    if (popularCities.length > 0) {
      localStorage.setItem('mostViewedCities', JSON.stringify(popularCities));
    }
  }, [popularCities]);


  // GET all stored cities from API
  useEffect(() => {
    const getPlaces = async () => {
      try {
        setIsLoading(true);

        const apiResponse = await fetch('/api/places');

        if (!apiResponse.ok) {
          throw new Error(`Failed to fetch cities: ${apiResponse.status} ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        setCities(data);

        const weatherResponse = await fetch(`/api/places/${DEFAULT_CITY_CODE}/forecasts/long-term`);

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();

        setWeatherData(weatherData);

        // Process forecast data
        const { currentForecast, dailyForecast } = processForecastData(weatherData.forecastTimestamps);

        setCurrentForecast(currentForecast);
        setDailyForecast(dailyForecast);

        if (currentForecast) {
          const condition = currentForecast.conditionCode;
          const { wallpaper, icon } = weatherImage[condition];

          setCurrentWallpaper(wallpaper);
          setCurrentIcon(icon);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getPlaces();
  }, []);


  // GET default places according to default names from API
  const getDefaultPlaces = async () => {
    const defaultCityCodes = ["vilnius", "kaunas", "klaipeda"];

    // Fetch weather data for default cities in parallel
    const defaultWeatherData = await Promise.allSettled(
      defaultCityCodes.map((code) =>
        fetch(`/api/default-places/${code}`).then((response) =>
          response.json()
        )

      )
    );


    const defaultCitiesWithWeather = defaultWeatherData.map((result) => {
      if (result.status === "fulfilled") {

        return {
          code: result.value.place.code,
          name: result.value.place.name,
          airTemperature: result.value.forecastTimestamps[0].airTemperature,
          count: 1,
        };
      } else {
        return {
          code: "unknown",
          name: "Unknown",
          airTemperature: null,
          count: 1,
        };
      }
    });

    setPopularCities(defaultCitiesWithWeather);
    localStorage.setItem('mostViewedCities', JSON.stringify(defaultCitiesWithWeather));
  };


  // UPDATE current city with the new selected one
  const handleCitySelect = async (code: string) => {
    try {
      // Fetch weather data for the selected city
      const apiResponse = await fetch(`/api/places/${code}/forecasts/long-term/`);

      if (!apiResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await apiResponse.json();
      setWeatherData(data);
      setDefaultCity(code);

      // Process forecast data
      const { currentForecast, dailyForecast, currentIcon, currentWallpaper } = processForecastData(data.forecastTimestamps);
      setCurrentForecast(currentForecast);
      setDailyForecast(dailyForecast);
      setCurrentIcon(currentIcon);
      setCurrentWallpaper(currentWallpaper);



      const selectedCity = cities.find((city) => city.code === code)
      if (selectedCity && currentForecast) {
        getMostViewedCities(selectedCity, currentForecast);
        logSelectedCity(selectedCity.name);
      } else {
        console.error('Selected city not found or current forecast is missing');
      }

    } catch (error) {
      console.error("Failed to fetch weather data:", error)
    }
  };

  // GET and SEND most viewed/popular cities from/to local storage
  const getMostViewedCities = (place: Cities, forecast: Forecast) => {

    setPopularCities((prevCities: PopularCities[]) => {
      const cityIndex = prevCities.findIndex((city) => city.code === place.code)

      if (cityIndex !== -1) {
        // If the city already exists, increment its count
        const updateCities = [...prevCities];
        updateCities[cityIndex].count += 1;
        return updateCities;
      } else {
        // If the city doesn't exist, add it to the list
        return [...prevCities,
        { code: place.code, name: place.name, airTemperature: forecast.airTemperature, count: 1 }];
      }
    })
  };

  console.log(currentForecast)
  // UPDATE `root`s background and screen size
  useEffect(() => {
    const root = document.getElementById('root');
    // const defaultImage = weatherImage[3].wallpaper;

    if (root) {
      root.style.setProperty('--root-bg-image', `url(${currentWallpaper})`);


      root.classList.remove('small', 'medium', 'large');
      root.classList.add(screenSize);
    }
  }, [currentWallpaper, screenSize])


  // Loading state
  if (isLoading) return <Row className='text-warning d-flex m-auto justify-items-center w-100 h-100'>
    <Col className="text-center">
      <Spinner animation="border" role="status"></Spinner>
      <span className="d-block pt-4 fs-4 text-white">Loading weather data...</span>
    </Col>
  </Row>;

  // No data state
  if (!weatherData) return <div>No data found.</div>;

  // No current forecast state
  if (!currentForecast) return <div>No forecast available for the current time.</div>;

  return (
    <>
      {/* SIDE LEFT PANEL */}
      <div className='side__panel'>

        {/* DROPDOWN SELECTION */}
        <Form.Select
          value={defaultCity}
          onChange={(e) => handleCitySelect(e.target.value)}
          className="side__panel--dropdown-select rounded-0 bg-transparent text-white"
        >
          <option>Choose a city...</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code} className='text-dark'>
              {city.name}
            </option>
          ))}
        </Form.Select>


        {/* ADDITIONAL FORECAST DATA INSIDE PANEL */}
        {weatherData ? (
          <div className="panel-info  h-50 w-100">
            <div className="panel-info--feel-temperature text-center">
              Feels like temperature: <span className="d-block ">{currentForecast.feelsLikeTemperature} %</span>
            </div>
            <div className="panel-info--gust text-center ">
              Wind gust: <span className="d-block ">{currentForecast.windGust} km/h</span>
            </div>
            <div className="panel-info--precipitation text-center" >
              Precipitation: <span className="d-block ">{currentForecast.totalPrecipitation} mm</span>
            </div>
          </div>
        ) : (
          <Row>
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading weather data...</span>
              </Spinner>
            </Col>
          </Row>
        )}
      </div>


      {/* MAIN CONTENT */}
      <div className='main__content w-100'>
        {weatherData ? (
          <>
            {/* CITIES TITLE */}
            <Row className="main__content--location w-100">
              <Col className="title align-self-center">
                <span className="title--head d-block">{weatherData.place.name}</span>
                <span className="title--subhead">
                  {weatherData.place.country}, {weatherData.place.countryCode}
                </span>
              </Col>

              {/* CONDITION FOR THAT CITY */}
              <Col className="condition text-center h-100">
                <ReactSVG className="condition--image" src={currentIcon} />

                <div className="condition--type d-block text-capitalize">{currentForecast.conditionCode.replace(/-/g, ' ')}</div>


                <span className="condition--wind">
                  <TiWeatherWindy /> {!['small'].includes(screenSize) && ` `}
                  {currentForecast.windSpeed} km/h
                </span>


                {['small', 'medium'].includes(screenSize) && (
                  <span className="condition--temperature">
                    {currentForecast.airTemperature} °C
                  </span>
                )}


                <span className="condition--humidity">
                  <GiWaterDrop /> {currentForecast.relativeHumidity}%
                </span>

              </Col>
            </Row>



            {/* TEMPERATURE FOR THAT CITY */}
            <Row className="main__content--current-temperature w-100 h-auto">
              <Col>
                <span className="current-date d-block">{currentTimeFormatted}</span>
                <span className="current-temperature">
                  {currentForecast ? `${currentForecast.airTemperature}` : "No data for the current hour"}
                  <span className="temperature-unit">°C</span>
                </span>
              </Col>
            </Row>



            {/* WEEKLY FORECAST FOR THAT CITY */}
            <Row className="main__content--weekly-forecast w-100 h-auto">
              <h3 className='weekly-forecast-title w-100 text-center m-0'>Weekly Forecast</h3>
              <div className="weekly-forecast-card">
                {dailyForecast.map((forecast, index) => (
                  <div key={index} className='card-box'>
                    <span className='card-day d-block text-center'>
                      {new Date(forecast.forecastTimeUtc).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </span>

                    {['small', 'medium'].includes(screenSize) && (
                      <span className="card-humidity text-light">
                        <GiWaterDrop className='text-info' />{forecast.relativeHumidity}%</span>
                    )}

                    <span className='card-temperature'>{forecast.airTemperature}
                      <span className="temperature-unit">°C</span>
                    </span>
                  </div>
                ))}
              </div>
            </Row>
          </>
        ) : (
          <Row>
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading weather data...</span>
              </Spinner>
            </Col>
          </Row>
        )}



        {/* MOST VIEWED/POPULAR FORECAST || DEFAULT POPULAR CITIES */}
        <Row className="main__content--popular-forecast w-100 h-auto">
          <Col>
            <Row className="popular-forecast-card w-100 text-center">
              {processedCities.map((forecast: PopularCities, index: number) => (
                <Col key={index} xs={2} md={4} lg={2} className='card-box border-1 rounded-4'>
                  <Button onClick={() => handleCitySelect(forecast.code)} className="border-0 w-100 h-100 rounded bg-transparent p-0">
                    <Card className="border-0 w-100 h-100 rounded bg-transparent text-light">
                      <Card.Body className="text-center p-0">
                        <span className="card-name d-block">{forecast.name}</span>
                        <span className="card-temperature">
                          {forecast.airTemperature}
                          <span className="temperature-unit alignment-super">°C</span>
                        </span>
                      </Card.Body>
                    </Card>
                  </Button>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default App
