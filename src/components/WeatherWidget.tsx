import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../api/weatherService';
import { fetchLocationDetails } from '../api/locationService'; // The Geoapify service you just created


const WeatherWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [weatherNotFound, setWeatherNotFound] = useState<boolean>(false);
  const [locationNotFound, setLocationNotFound] = useState<boolean>(false);

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Handle weather search
  const handleWeatherSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchWeatherData(city);
      if (!data || !data.name) {
        setWeatherNotFound(true);
      } else {
        setWeather(data);
        setWeatherNotFound(false);
        setError('');
      }
    } catch (error) {
      setError('Unable to fetch weather data. Please check the city name.');
      setWeather(null);
      setWeatherNotFound(false);
    }
  };

  // Handle location search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const locationData = await fetchLocationDetails(location);
      if (!locationData || locationData.features.length === 0) {
        setLocationNotFound(true);
      } else {
        setLocationDetails(locationData);
        setLocationNotFound(false);
        setError('');
      }
    } catch (err) {
      setError('Unable to fetch location data.');
      setLocationDetails(null);
      setLocationNotFound(false);
    }
  };

  return (
    <div className="user-list-container">
      <div className="weather-widget">
        {/* Clock */}
       

        <h2 className="weather-widget-title">Weather Forecast <i className="fas fa-cloud-sun-rain"></i>
        </h2>

        {/* Search form for weather */}
        <form onSubmit={handleWeatherSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter city for weather"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
            required
          />
          <button type="submit" className="search-button">Search Weather</button>
        </form>

        {/* Show error message if there is one */}
        {error && <p className="error-message">{error}</p>}

        {/* Show "No result found" for weather if not found */}
        {weatherNotFound && <p>No result found for weather.</p>}

        {/* Weather details */}
        {weather && !weatherNotFound && (
          <div className="weather-info">
            <h3 className="city-name">City: {weather.name}</h3>
            <div className="weather-details">
              <div className="temperature">
                <p>Temperature: {Math.round(weather.main.temp)}°C</p>
              </div>
              <div className="description">
                <p>Description: {weather.weather[0].description}</p>
              </div>
              <div className="weather-icon">
                Humidity: <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default WeatherWidget;