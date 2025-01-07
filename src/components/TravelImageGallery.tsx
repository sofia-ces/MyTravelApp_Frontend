import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TravelImageGallery: React.FC<{ location: string }> = ({ location }) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://api.pexels.com/v1/search?query=${location}&per_page=12`, // Fetch 5 images (adjust as needed)
          {
            headers: {
              Authorization: 'tueR1X8kCLmjUczq8KzWPb2nro1oL02JWgA6MrkcY4qSiyS3IeJrL6r6', // Replace with your API key
            },
          }
        );
        setImages(response.data.photos.map((photo: any) => photo.src.large)); // Extract image URLs
      } catch (error) {
        setError('Failed to fetch images');
        console.error(error);
      }
    };

    fetchImages();
  }, [location]); // Re-fetch when location changes

  return (
    <div className="user-list-container">
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} style={{ width: '200px', height: '200px' }}>
              <img src={image} alt={`Travel Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
};

export default TravelImageGallery;