import React from 'react';
import { pharmacyTheme } from './theme';

const SuggestionCard = React.memo(({ suggestion }) => (
  <div 
    className="suggestion-card" 
    style={{ 
      backgroundColor: pharmacyTheme.cardBackground, 
      boxShadow: pharmacyTheme.cardShadow 
    }}
  >
    <div className="drug-name" style={{ color: pharmacyTheme.text }}>
      {suggestion.drug1} + {suggestion.drug2}
    </div>
    <div className="interaction-text" style={{ color: pharmacyTheme.text }}>
      {suggestion.description}
    </div>
    {suggestion.extended_description && (
      <div className="extended-description" style={{ color: pharmacyTheme.text }}>
        {suggestion.extended_description}
      </div>
    )}
  </div>
));

export default SuggestionCard;
