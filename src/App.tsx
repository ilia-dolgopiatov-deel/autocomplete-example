import React, { useState, useEffect } from 'react';
import { fetchCountriesSugegstions } from './api';
import type { Country } from './api';
import './App.css';
import Autocomplete from './components/Autocomplete';
import { useDebounce } from './hooks';

function App() {
  const [country, setCountry] = useState('');
  const [suggestItems, setSuggestItems] = useState<Country[]>([]);

  const debouncedCountryInput = useDebounce(country);

  useEffect(() => {
    async function loadSuggestion() {
      const countriesList = await fetchCountriesSugegstions(country);
      setSuggestItems(countriesList);
    }

    if (!debouncedCountryInput) {
      setSuggestItems([]);
    } else {
      loadSuggestion();
    }
  }, [debouncedCountryInput]);

  return (
    <div className="container">
      <Autocomplete
        placeholder="Select Country"
        value={country}
        onChange={setCountry}
        suggestions={suggestItems}
      />
    </div>
  );
}

export default App;
