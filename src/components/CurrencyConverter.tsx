import React, { useState, useEffect } from 'react';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1); // Input amount
  const [currencies, setCurrencies] = useState<string[]>([]); // List of currencies
  const [fromCurrency, setFromCurrency] = useState<string>('USD'); // From currency
  const [toCurrency, setToCurrency] = useState<string>('PHP'); // To currency
  const [converted, setConverted] = useState<number | null>(null); // Converted value
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch currency list
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://api.frankfurter.app/currencies');
        if (!response.ok) throw new Error('Failed to fetch currencies');
        const data = await response.json();
        setCurrencies(Object.keys(data)); // Set available currency codes
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCurrencies();
  }, []);

  // Convert currency
  const convertCurrency = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      if (!response.ok) throw new Error('Failed to fetch conversion data');

      const data = await response.json();
      const rate = data.rates[toCurrency];
      setConverted(rate);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="currency-list-container">
    <div className="currency-list">
      <h2>Currency Converter <i className="	fas fa-donate"></i></h2>
      <div>
        <label>
          Amount:{' '}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            style={{ margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <div style={{ margin: '10px 0' }}>
          <label>
            From:{' '}
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              style={{ margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label>
            To:{' '}
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              style={{ margin: '0 10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={convertCurrency}
          style={{
            padding: '5px 15px',
            borderRadius: '4px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {converted !== null && (
        <p style={{ marginTop: '10px' }}>
          Converted Amount: <strong>{converted.toFixed(2)}</strong> {toCurrency}
        </p>
      )}
    </div></div>
  );
};

export default CurrencyConverter;