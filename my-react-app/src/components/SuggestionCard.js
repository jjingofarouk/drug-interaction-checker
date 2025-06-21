import React from 'react';
import './styles.css';

const SuggestionCard = React.memo(({ suggestion }) => {
  return (
    <div className="suggestion-card">
      <div className="drug-combination">
        <span className="drug-pill">{suggestion.drug1}</span>
        <span className="plus-icon">+</span>
        <span className="drug-pill">{suggestion.drug2}</span>
      </div>
      <div className="interaction-text">{suggestion.description}</div>
      {suggestion.extended_description && (
        <div className="extended-description">{suggestion.extended_description}</div>
      )}
      
      <style jsx>{`
        .suggestion-card {
          background-color: var(--white);
          border: 2px solid var(--black);
          border-radius: 0;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .suggestion-card:hover {
          background-color: var(--black);
          color: var(--white);
        }
        
        .suggestion-card:hover .drug-pill {
          background-color: var(--white);
          color: var(--black);
        }
        
        .suggestion-card:hover .plus-icon {
          color: var(--white);
        }
        
        .suggestion-card:hover .interaction-text {
          color: var(--white);
        }
        
        .suggestion-card:hover .extended-description {
          color: var(--white);
          border-top: 1px solid var(--white);
        }
        
        .drug-combination {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        
        .drug-pill {
          background-color: var(--black);
          color: var(--white);
          border-radius: 0;
          font-size: 0.95rem;
          font-weight: 600;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          border: 1px solid var(--black);
        }
        
        .plus-icon {
          color: var(--black);
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0.5rem;
        }
        
        .interaction-text {
          color: var(--black);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          font-weight: 400;
        }
        
        .extended-description {
          color: var(--black);
          font-size: 0.95rem;
          line-height: 1.6;
          border-top: 1px solid var(--black);
          font-weight: 300;
        }
        
        @media (max-width: 768px) {
          .interaction-text {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .drug-combination {
            flex-direction: row;
            align-items: center;
          }
          
          .drug-pill {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
});

export default SuggestionCard;