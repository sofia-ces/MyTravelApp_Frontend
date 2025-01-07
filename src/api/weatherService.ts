import axios from 'axios';

// Ensure you're referencing the environment variable correctly

const API_KEY = "YOUR-API-KEY";
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherData = async (city: string) => {
  if (!API_KEY) {
    throw new Error('API key is missing!');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Optional: Use 'metric' to get temperature in Celsius, or 'imperial' for Fahrenheit
      },
    });

    return response.data; // Return weather data from the API
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Unable to fetch weather data.');
  }
};