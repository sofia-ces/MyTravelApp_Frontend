import React, { useState } from 'react';
import { fetchWeatherData } from '../api/weatherService';
import { fetchLocationDetails } from '../api/locationService';  // The Geoapify service you just created

const LocationInformation: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [weatherNotFound, setWeatherNotFound] = useState<boolean>(false);
  const [locationNotFound, setLocationNotFound] = useState<boolean>(false);

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

    console.log("hrereeee");
    e.preventDefault();
    try {
        const locationData = await fetchLocationDetails(location);
        console.log('Location Data:', locationData);
     
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
    <div className="weather-widget">
     
      {/* Location Info Section */}
      <h2 className="weather-widget-title">Location Information</h2>

      {/* Search form for location */}
      <form onSubmit={handleLocationSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-input"
          required
        />
        <button type="submit" className="search-button">Search Location</button>
      </form>

      {/* Show "No result found" for location if not found */}
      {locationNotFound && <p>No result found for location.</p>}

      {/* Location details */}
      {locationDetails && !locationNotFound && locationDetails.features?.length > 0 && (
        <div className="location-info">
          <h3>Location Info</h3>
          <p><strong>Name:</strong> {locationDetails.features[0].properties.country}</p>
          <p><strong>City:</strong> {locationDetails.features[0].properties.city}</p>
          <p><strong>Address:</strong> {locationDetails.features[0].properties.address_line1}</p>
          <p><strong>lat:</strong> {locationDetails.features[0].properties.lat}</p>
          <p><strong>Long:</strong> {locationDetails.features[0].properties.lon}</p>
          {/* Display the image if available */}
          {locationDetails.features[0].properties?.photos && locationDetails.features[0].properties.photos.length > 0 && (
            <img 
              src={locationDetails.features[0].properties.photos[0].image_url} 
              alt="Location"
              width={200}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInformation;