// api/locationService.ts
import axios from 'axios';



const GEOPAFY_API_KEY = '67c96c9029e04e2fa2da28cbbc25a2f8'; // Replace with your Geoapify API key
const BASE_URL = 'https://api.geoapify.com/v1/geocode/search';

export const fetchLocationDetails = async (location: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        text: location,
        apiKey: GEOPAFY_API_KEY,
        lang: 'en',
      },
    });
    return response.data; // Return the data to be used in the component
  } catch (error) {
    console.error("Error fetching location details:", error);
    throw error;
  }
};