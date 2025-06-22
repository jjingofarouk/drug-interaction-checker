import React from 'react';

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
        :root {
          --primary: #1A3C5A; /* Deep navy for professionalism */
          --secondary: #F8FAFC; /* Light gray for clean background */
          --accent: #2563EB; /* Vibrant blue for trust and engagement */
          --text-primary: #1F2937; /* Dark gray for primary text */
          --text-secondary: #6B7280; /* Muted gray for secondary text */
          --white: #FFFFFF; /* Pure white for contrast */
          --border: #D1D5DB; /* Subtle gray for borders */
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        }

        .suggestion-card {
          background-color: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          width: 100%;
        }
        
        .suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .drug-combination {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
          gap: 0.75rem;
        }
        
        .drug-pill {
          background-color: var(--primary);
          color: var(--white);
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border: none;
          transition: background-color 0.2s ease;
        }
        
        .drug-pill:hover {
          background-color: var(--accent);
        }
        
        .plus-icon {
          color: var(--text-secondary);
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0.5rem;
        }
        
        .interaction-text {
          color: var(--text-primary);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          font-weight: 400;
        }
        
        .extended-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          font-weight: 300;
        }
        
        @media (max-width: 768px) {
          .suggestion-card {
            padding: 1.25rem;
          }
          
          .interaction-text {
            font-size: 0.95rem;
          }
          
          .extended-description {
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .suggestion-card {
            padding: 1rem;
          }
          
          .drug-combination {
            gap: 0.5rem;
          }
          
          .drug-pill {
            font-size: 0.85rem;
            padding: 0.4rem 0.8rem;
          }
          
          .plus-icon {
            font-size: 1rem;
            margin: 0 0.4rem;
          }
        }
      `}</style>
    </div>
  );
});

export default SuggestionCard;