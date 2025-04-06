import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import drugBankOptions from './drugOptions.json';
import drugBankInteractions from './druginteractionsdata.json';
import customDrugOptions from './DrugOptions2.json';
import customInteractions from './druginteractionsdata2.json';
import Navbars from './Navbar';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const allDrugOptions = useMemo(() => ({
    ...(drugBankOptions || {}),
    ...Object.fromEntries(
      Object.values(customDrugOptions || {}).map(drug => [drug, drug])
    ),
  }), []);

  const findDrugBankInteractions = useCallback((drug1, drug2) => {
    let foundInteractions = [];
    const drug1Entries = Object.entries(drugBankOptions || {})
      .filter(([_, name]) => name === drug1);
    const drug2Entries = Object.entries(drugBankOptions || {})
      .filter(([_, name]) => name === drug2);

    drug1Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(
          ...(drugBankInteractions[id].interactions || [])
            .filter((interaction) =>
              interaction[0].toLowerCase().includes(drug2.toLowerCase())
            )
            .map((interaction) => ({
              source: 'drugbank',
              drug1,
              drug2,
              description: interaction[1],
              title: interaction[0].replace(/<\/?[^>]+(>|$)/g, ''),
            }))
        );
      }
    });

    drug2Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(
          ...(drugBankInteractions[id].interactions || [])
            .filter((interaction) =>
              interaction[0].toLowerCase().includes(drug1.toLowerCase())
            )
            .map((interaction) => ({
              source: 'drugbank',
              drug1,
              drug2,
              description: interaction[1],
              title: interaction[0].replace(/<\/?[^>]+(>|$)/g, ''),
            }))
        );
      }
    });

    return foundInteractions;
  }, []);

  const findCustomInteractions = useCallback((drug1, drug2) => {
    return (customInteractions || [])
      .filter(
        (interaction) =>
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
    return (customInteractions || [])
      .filter(
        (interaction) =>
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

        suggestedInteractions = [...drug1Related, ...drug2Related].filter(
          (interaction, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.drug1 === interaction.drug1 && t.drug2 === interaction.drug2
            )
        );
      }
    }

    setInteractions(foundInteractions);
    setSuggestions(suggestedInteractions);
  }, [
    selectedDrug1,
    selectedDrug2,
    findDrugBankInteractions,
    findCustomInteractions,
    findRelatedInteractions,
  ]);

  useEffect(() => {
    checkInteractions();
  }, [checkInteractions]);

  const handleInputFocus = useCallback((index) => setActiveInput(index), []);
  const handleScreenPress = useCallback(() => setActiveInput(null), []);

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Unlock Safe Medication Insights</h1>
          <p className="hero-subtitle">
            Explore drug interactions effortlessly with our cutting-edge tool—your health, simplified.
          </p>
          <div className="hero-cta">Get Started</div>
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
                <h3 className="message-title">No Interactions Found</h3>
                <p className="message-text">
                  Good news! No known interactions between {selectedDrug1} and{' '}
                  {selectedDrug2} based on our data.
                </p>
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <h4 className="suggestions-title">
                      Related Interactions to Explore
                    </h4>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard key={index} suggestion={suggestion} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="message-card">
                <h3 className="message-title">Check Your Medications</h3>
                <p className="message-text">
                  Enter two drugs above to uncover potential interactions with
                  our reliable database.
                </p>
              </div>
            )}
          </div>

          <div className="info-section">
            <h2 className="info-title">Why It Matters</h2>
            <p className="info-text">
              Understanding drug interactions can prevent unexpected side
              effects or reduced efficacy. Our tool delivers fast, trustworthy
              insights to keep you informed.
            </p>
            <ul className="info-list">
              <li>Built on comprehensive pharmaceutical data</li>
              <li>Instant, easy-to-read results</li>
              <li>Empowers discussions with your doctor</li>
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
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(
            120deg,
            var(--primary-dark) 0%,
            var(--primary-color) 100%
          );
          padding: 6rem 2rem 4rem;
          text-align: center;
          position: relative;
          color: var(--white);
          box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.1);
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.25rem;
          animation: slideIn 0.8s ease-out;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.5;
          max-width: 700px;
          margin: 0 auto 2rem;
          opacity: 0.95;
          animation: slideIn 0.8s ease-out 0.2s both;
        }

        .hero-cta {
          display: inline-block;
          padding: 1rem 2.5rem;
          background-color: var(--secondary-color);
          color: var(--white);
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: slideIn 0.8s ease-out 0.4s both;
        }

        .hero-cta:hover {
          background-color: var(--secondary-dark);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
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
          padding: 4rem 1rem;
        }

        .main-scroll {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        /* Search Section */
        .search-section {
          position: relative;
          z-index: 10;
        }

        .search-inputs-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
        }

        .input-label {
          color: var(--dark);
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }

        /* DrugSearchInput Styles */
        :global(.drug-search-input) {
          position: relative;
          width: 100%;
        }

        :global(.drug-search-input input) {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          font-family: 'Poppins', sans-serif;
          color: var(--dark);
          background-color: var(--white);
          border: 2px solid var(--light-gray);
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        :global(.drug-search-input input:focus) {
          border-color: var(--primary-color);
          box-shadow: 0 4px 16px rgba(58, 143, 133, 0.2);
          transform: translateY(-2px);
        }

        :global(.drug-search-input input::placeholder) {
          color: var(--medium-gray);
          opacity: 0.8;
        }

        :global(.drug-search-input .dropdown) {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--white);
          border-radius: 12px;
          border: 1px solid var(--light-gray);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: 0.5rem;
          animation: dropdownFade 0.2s ease-out;
        }

        :global(.drug-search-input .dropdown-item) {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          color: var(--dark-gray);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        :global(.drug-search-input .dropdown-item:hover) {
          background-color: var(--primary-light);
          color: var(--primary-dark);
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Results Section */
        .results-container {
          padding: 2rem 0;
        }

        .results-section-title {
          color: var(--primary-dark);
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .message-card {
          background-color: var(--white);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .message-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .no-interaction-icon {
          font-size: 3.5rem;
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
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .suggestions-title {
          color: var(--primary-dark);
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1.5rem;
        }

        /* Info Section */
        .info-section {
          background-color: var(--white);
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .info-title {
          color: var(--primary-dark);
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .info-text {
          color: var(--medium-gray);
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .info-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 1.25rem;
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
            gap: 2rem;
          }

          .hero-section {
            padding: 4rem 1rem 3rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-cta {
            padding: 0.75rem 2rem;
            font-size: 1.1rem;
          }

          .message-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DrugInteractionChecker;