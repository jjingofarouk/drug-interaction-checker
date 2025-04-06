import React from 'react';


const InteractionCard = React.memo(({ interaction }) => {
  return (
    <div className="interaction-card">
      <div className="interaction-header">
        <div className="drug-name">{interaction.title}</div>
        <div className={`source-badge ${interaction.source === 'drugbank' ? 'source-info' : 'source-custom'}`}>
          <div className="source-text">{interaction.source}</div>
        </div>
      </div>
      <div className="interaction-text">{interaction.description}</div>
      {interaction.extended_description && (
        <div className="extended-description">{interaction.extended_description}</div>
      )}
      
      <style jsx>{`
        .interaction-card {
          background-color: var(--white);
          border-radius: 14px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          border-left: 4px solid var(--primary-color);
        }
        
        .interaction-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .interaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        .drug-name {
          color: var(--dark);
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }
        
        .source-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .source-info {
          background-color: var(--info);
        }
        
        .source-custom {
          background-color: var(--success);
        }
        
        .source-text {
          color: var(--white);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .interaction-text {
          color: var(--dark-gray);
          font-size: 1.15rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-weight: 400;
        }
        
        .extended-description {
          color: var(--medium-gray);
          font-size: 1rem;
          line-height: 1.6;
          padding-top: 1.25rem;
          border-top: 1px solid var(--light-gray);
          font-weight: 300;
        }
        
        @media (max-width: 768px) {
          .interaction-card {
            padding: 1.5rem;
          }
          
          .drug-name {
            font-size: 1.25rem;
          }
          
          .interaction-text {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .interaction-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .source-badge {
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
});

export default InteractionCard;