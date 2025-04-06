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
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border-left: 3px solid var(--secondary-color);
          position: relative;
          overflow: hidden;
        }
        
        .suggestion-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }
        
        .suggestion-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--primary-light) 0%, transparent 70%);
          opacity: 0.2;
          border-radius: 0 0 0 100%;
        }
        
        .drug-combination {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        
        .drug-pill {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          padding: 0.35rem 0.8rem;
          border-radius: 20px;
          font-size: 0.95rem;
          font-weight: 600;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .plus-icon {
          color: var(--secondary-color);
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0.5rem;
        }
        
        .interaction-text {
          color: var(--dark-gray);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          font-weight: 400;
        }
        
        .extended-description {
          color: var(--medium-gray);
          font-size: 0.95rem;
          line-height: 1.6;
          padding-top: 1rem;
          border-top: 1px solid var(--light-gray);
          font-weight: 300;
        }
        
        @media (max-width: 768px) {
          .suggestion-card {
            padding: 1.25rem;
          }
          
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
            padding: 0.3rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
});

export default SuggestionCard;