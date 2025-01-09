import React, { useState } from 'react';
import axios from 'axios';

const WikipediaWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&origin=*`
      );

      if (response.data.query && response.data.query.search) {
        setResults(response.data.query.search);
        setError(null);
      } else {
        setResults([]);
        setError('No results found.');
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
      console.log('An error occurred while fetching data.', error);
    }
  };

  return (
    <div className="user-list-container">
             
    <div className="wikipedia-widget">
      <h2>Location Information</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search Wikipedia"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          required
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="results-container">
        {results.map((result) => (
          <div key={result.pageid} className="result-item">
            <h4>{result.title}</h4>
            <p>{result.snippet.replace(/<\/?[^>]+(>|$)/g, '')}</p>
            <a
              href={`https://en.wikipedia.org/?curid=${result.pageid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default WikipediaWidget;
