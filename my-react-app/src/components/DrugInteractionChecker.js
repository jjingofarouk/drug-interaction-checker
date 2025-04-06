import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import drugBankOptions from './drugOptions.json';
import drugBankInteractions from './druginteractionsdata.json';
import customDrugOptions from './DrugOptions2.json';
import customInteractions from './druginteractionsdata2.json';
import './styles.css';
import Navbars from './Navbar';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const allDrugOptions = useMemo(() => ({
    ...drugBankOptions,
    ...Object.fromEntries(Object.values(customDrugOptions).map(drug => [drug, drug]))
  }), []);

  const findDrugBankInteractions = useCallback((drug1, drug2) => {
    let foundInteractions = [];
    const drug1Entries = Object.entries(drugBankOptions)
      .filter(([_, name]) => name === drug1);
    const drug2Entries = Object.entries(drugBankOptions)
      .filter(([_, name]) => name === drug2);

    drug1Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(...drugBankInteractions[id].interactions
          .filter((interaction) => interaction[0].toLowerCase().includes(drug2.toLowerCase()))
          .map((interaction) => ({
            source: 'drugbank',
            drug1,
            drug2,
            description: interaction[1],
            title: interaction[0].replace(/<\/?[^>]+(>|$)/g, ''),
          })));
      }
    });

    drug2Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(...drugBankInteractions[id].interactions
          .filter((interaction) => interaction[0].toLowerCase().includes(drug1.toLowerCase()))
          .map((interaction) => ({
            source: 'drugbank',
            drug1,
            drug2,
            description: interaction[1],
            title: interaction[0].replace(/<\/?[^>]+(>|$)/g, ''),
          })));
      }
    });

    return foundInteractions;
  }, []);

  const findCustomInteractions = useCallback((drug1, drug2) => {
    return customInteractions
      .filter((interaction) =>
        (interaction.drug.toLowerCase() === drug1.toLowerCase() &&
          interaction.interacting_drug.toLowerCase() === drug2.toLowerCase()) ||
        (interaction.drug.toLowerCase() === drug2.toLowerCase() &&
          interaction.interacting_drug.toLowerCase() === drug1.toLowerCase())
      )
      .map((interaction) => ({
        source: 'custom',
        drug1: interaction.drug,
        drug2: interaction.interacting_drug,
        description: interaction.description,
        extended_description: interaction.extended_description,
        title: `${interaction.drug} + ${interaction.interacting_drug}`,
      }));
  }, []);

  const findRelatedInteractions = useCallback((drug) => {
    return customInteractions
      .filter((interaction) =>
        interaction.drug.toLowerCase() === drug.toLowerCase() ||
        interaction.interacting_drug.toLowerCase() === drug.toLowerCase()
      )
      .map((interaction) => ({
        drug1: interaction.drug,
        drug2: interaction.interacting_drug,
        description: interaction.description,
        extended_description: interaction.extended_description,
      }));
  }, []);

  const checkInteractions = useCallback(() => {
    if (!selectedDrug1 && !selectedDrug2) {
      setInteractions([]);
      setSuggestions([]);
      return;
    }

    let foundInteractions = [];
    let suggestedInteractions = [];

    if (selectedDrug1 && selectedDrug2) {
      foundInteractions = [
        ...findDrugBankInteractions(selectedDrug1, selectedDrug2),
        ...findCustomInteractions(selectedDrug1, selectedDrug2),
      ];

      if (foundInteractions.length === 0) {
        const drug1Related = findRelatedInteractions(selectedDrug1);
        const drug2Related = findRelatedInteractions(selectedDrug2);

        suggestedInteractions = [...drug1Related, ...drug2Related]
          .filter((interaction, index, self) =>
            index === self.findIndex((t) =>
              t.drug1 === interaction.drug1 && t.drug2 === interaction.drug2
            )
          );
      }
    }

    setInteractions(foundInteractions);
    setSuggestions(suggestedInteractions);
  }, [selectedDrug1, selectedDrug2, findDrugBankInteractions, findCustomInteractions, findRelatedInteractions]);

  useEffect(() => {
    checkInteractions();
  }, [checkInteractions]);

  const handleInputFocus = useCallback((index) => setActiveInput(index), []);
  const handleScreenPress = useCallback(() => setActiveInput(null), []);

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Safer Medication Combinations</h1>
          <p className="hero-subtitle">
            Instantly check for drug interactions with our trusted, user-friendly tool—empowering you to make informed health decisions.
          </p>
          <div className="hero-cta">
            <span className="hero-cta-text">Start Checking Now</span>
          </div>
        </div>
      </div>

      <div className="main-container" onClick={handleScreenPress}>
        <div className="main-scroll">
          <div className="search-section">
            <div className="search-inputs-container">
              <div className="input-wrapper">
                <label className="input-label">Medication 1</label>
                <DrugSearchInput
                  value={selectedDrug1}
                  onSelect={setSelectedDrug1}
                  placeholder="Enter first medication..."
                  onFocus={handleInputFocus}
                  inputIndex={1}
                  activeInput={activeInput}
                  zIndex={2}
                  allDrugOptions={allDrugOptions}
                />
              </div>
              <div className="input-wrapper">
                <label className="input-label">Medication 2</label>
                <DrugSearchInput
                  value={selectedDrug2}
                  onSelect={setSelectedDrug2}
                  placeholder="Enter second medication..."
                  onFocus={handleInputFocus}
                  inputIndex={2}
                  activeInput={activeInput}
                  zIndex={1}
                  allDrugOptions={allDrugOptions}
                />
              </div>
            </div>
          </div>

          <div className="results-container">
            {interactions.length > 0 ? (
              <div className="results-section">
                <h2 className="results-section-title">Detected Interactions</h2>
                {interactions.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : selectedDrug1 && selectedDrug2 ? (
              <div className="message-card">
                <div className="no-interaction-icon">✓</div>
                <h3 className="message-title">No Interactions Detected</h3>
                <p className="message-text">
                  Based on available data, no interactions were found between {selectedDrug1} and {selectedDrug2}.
                </p>
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <h4 className="suggestions-title">Related Interactions to Consider</h4>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard key={index} suggestion={suggestion} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="message-card">
                <h3 className="message-title">Start Checking Interactions</h3>
                <p className="message-text">
                  Enter two medications above to see if they interact. Our database provides reliable, up-to-date information.
                </p>
              </div>
            )}
          </div>

          <div className="info-section">
            <h2 className="info-title">Why Check Drug Interactions?</h2>
            <p className="info-text">
              Drug interactions can alter how medications perform, potentially reducing effectiveness or increasing side effects. Our tool empowers you with clear, reliable insights from a comprehensive database, promoting safer medication use.
            </p>
            <ul className="info-list">
              <li>Powered by trusted pharmaceutical data</li>
              <li>Fast, clear, and actionable results</li>
              <li>Supports informed conversations with your healthcare provider</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #3a8f85;
          --primary-dark: #2c7269;
          --primary-light: #8cc5bf;
          --secondary-color: #d68c45;
          --secondary-dark: #b87339;
          --secondary-light: #e9b384;
          --dark: #2d3a3a;
          --dark-gray: #4d5c5c;
          --medium-gray: #7e8c8c;
          --light-gray: #d2d8d8;
          --off-white: #f8f7f5;
          --white: #ffffff;
          --success: #739e73;
          --warning: #e6b86a;
          --error: #c17b7b;
          --info: #6a91ab;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container {
          background-color: var(--off-white);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: var(--white);
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2), transparent 50%);
          opacity: 0.3;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 2rem;
          opacity: 0.9;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .hero-cta {
          display: inline-block;
          padding: 0.75rem 2rem;
          background-color: var(--secondary-color);
          color: var(--white);
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .hero-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Main Container */
        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .main-scroll {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* Search Section */
        .search-section {
          text-align: center;
        }

        .search-inputs-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .input-label {
          color: var(--dark);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        /* Results Section */
        .results-container {
          padding: 2rem 0;
        }

        .results-section-title {
          color: var(--primary-dark);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
        }

        .message-card {
          background-color: var(--white);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .message-card:hover {
          transform: translateY(-4px);
        }

        .no-interaction-icon {
          font-size: 3rem;
          color: var(--success);
          margin-bottom: 1.5rem;
        }

        .message-title {
          color: var(--dark);
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .message-text {
          color: var(--medium-gray);
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .suggestions-title {
          color: var(--primary-dark);
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1.5rem;
        }

        /* Info Section */
        .info-section {
          background: linear-gradient(180deg, var(--white) 0%, var(--off-white) 100%);
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .info-title {
          color: var(--primary-dark);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .info-text {
          color: var(--medium-gray);
          font-size: 1.15rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .info-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .info-list li {
          position: relative;
          padding-left: 2rem;
          font-size: 1.15rem;
          color: var(--dark-gray);
          text-align: left;
        }

        .info-list li:before {
          content: '✔';
          color: var(--success);
          position: absolute;
          left: 0;
          font-size: 1.25rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }

          .search-inputs-container {
            grid-template-columns: 1fr;
          }

          .hero-section {
            padding: 4rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-cta {
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DrugInteractionChecker;