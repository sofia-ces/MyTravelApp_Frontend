// src/components/LocationSearch.tsx
import React, { useState } from 'react';
import { fetchLocationDetails } from '../api/foursquareService';

const LocationSearch: React.FC = () => {
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await fetchLocationDetails(location);
      setLocationData(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch location details');
      setLocationData(null);
    }
  };

  return (
    <div>
      <h1>Search Location</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}

      {locationData && (
        <div>
          <h2>{locationData.name}</h2>
          <p>{locationData.address}</p>
          {locationData.imageUrl && <img src={locationData.imageUrl} alt={locationData.name} />}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;