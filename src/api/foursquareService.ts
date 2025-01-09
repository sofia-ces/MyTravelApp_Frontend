
import axios from 'axios';

const FOURSQUARE_API_KEY = "YOUR-API-KEY";

export const fetchLocationDetails = async (location: string) => {
  try {
    const response = await axios.get(`https://api.fourffsquare.com/v3/places/search?limit=1&locale=en`, {
      headers: {
        Authorization: FOURSQUARE_API_KEY,
      },
      params: {
        query: location,
        limit: 1, // Limit the results to 1 for simplicity
      },
    });

    const place = response.data.results[0];
    return {
      name: place.name,
      address: place.location.address || 'No address available',
      imageUrl: place.photos ? place.photos[0]?.prefix + 'original' + place.photos[0]?.suffix : 'No image available',
    };
  } catch (error) {
    console.error('Error fetching location details', error);
    throw new Error('Error fetching location details');
  }

  
};