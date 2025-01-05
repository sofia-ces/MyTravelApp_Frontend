import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash Access Key

const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com/',
  headers: {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, // Use your API Key here
  },
});

// Fetch an image based on a location (e.g., city name)
export const fetchLocationImage = async (location: string) => {
  try {
    const response = await unsplashApi.get(`/photos/random`, {
      params: {
        query: location,
        orientation: 'landscape', // Optional: adjust image orientation
        count: 1, // Number of images to return
      },
    });
    return response.data[0]; // Return the first image
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    throw error;
  }
};