import React from 'react';
import { pharmacyTheme } from './theme';

const InteractionCard = React.memo(({ interaction }) => (
  <div 
    className="interaction-card" 
    style={{ 
      backgroundColor: pharmacyTheme.cardBackground, 
      boxShadow: pharmacyTheme.cardShadow 
    }}
  >
    <div className="interaction-header">
      <div className="drug-name" style={{ color: pharmacyTheme.text }}>
        {interaction.title}
      </div>
      <div
        className="source-badge"
        style={{
          backgroundColor: interaction.source === 'drugbank' 
            ? pharmacyTheme.info 
            : pharmacyTheme.success,
        }}
      >
        <div
          className="source-text"
          style={{ color: pharmacyTheme.cardBackground }}
        >
          {interaction.source}
        </div>
      </div>
    </div>
    <div className="interaction-text" style={{ color: pharmacyTheme.text }}>
      {interaction.description}
    </div>
    {interaction.extended_description && (
      <div className="extended-description" style={{ color: pharmacyTheme.text }}>
        {interaction.extended_description}
      </div>
    )}
  </div>
));

export default InteractionCard;
