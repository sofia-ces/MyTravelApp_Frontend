import React, { useState } from 'react';
import { fetchWeatherData } from '../api/weatherService';

const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchWeatherData(city);
      setWeather(data);
      setError('');
    } catch (error) {
      setError('Unable to fetch weather data. Please check the city name.');
      setWeather(null);
    }
  };

  return (
    <div className="weather-widget">
      <h2 className="weather-widget-title">Weather Forecast</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Enter city" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          className="city-input" 
          required
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-info">
            
          <h3 className="city-name">{weather.name}</h3>
          <div className="weather-details">
            <div className="temperature">
              <p>{Math.round(weather.main.temp)}°C</p>
            </div>
            <div className="description">
              <p>{weather.weather[0].description}</p>
            </div>
            <div className="weather-icon">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;