import React, { useState, useEffect, useCallback } from 'react';
import { pharmacyTheme } from './theme';

const DrugSearchInput = React.memo(({
  value,
  onSelect,
  placeholder,
  onFocus,
  inputIndex,
  activeInput,
  zIndex,
  allDrugOptions,
}) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => setSearchText(value), [value]);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
    setShowSuggestions(true);
    if (text.length > 0) {
      const filtered = Object.values(allDrugOptions)
        .filter(drug => drug.toLowerCase().includes(text.toLowerCase()))
        .sort()
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [allDrugOptions]);

  const handleSelect = useCallback((drug) => {
    setSearchText(drug);
    onSelect(drug);
    setShowSuggestions(false);
    setSuggestions([]);
  }, [onSelect]);

  const isActive = activeInput === inputIndex;

  return (
    <div className="search-container" style={{ zIndex }}>
      <input
        type="text"
        className={`search-input ${isActive ? 'search-input-active' : ''} ${value ? 'search-input-filled' : ''}`}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        onFocus={() => {
          setShowSuggestions(true);
          onFocus(inputIndex);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        style={{ 
          backgroundColor: pharmacyTheme.cardBackground, 
          color: pharmacyTheme.text 
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="suggestions-container" 
          style={{ 
            backgroundColor: pharmacyTheme.cardBackground, 
            boxShadow: pharmacyTheme.cardShadow 
          }}
        >
          <div className="suggestions-list">
            {suggestions.map(drug => (
              <div
                key={drug}
                className="suggestion-item"
                onClick={() => handleSelect(drug)}
                style={{ color: pharmacyTheme.text }}
              >
                <div className="suggestion-text">{drug}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default DrugSearchInput;
