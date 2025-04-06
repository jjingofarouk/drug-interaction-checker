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
      <div className="main-container" onClick={handleScreenPress}>
        <div className="main-scroll">
          <div className="header-container">
            <h1 className="title">Check Drug Interactions</h1>
            <p className="subtitle">
              Instantly identify potential interactions between medications with our trusted tool
            </p>
          </div>

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
              Drug interactions can affect how medications work, potentially leading to reduced effectiveness or increased side effects. Our tool helps you stay informed by cross-referencing a comprehensive database of known interactions, ensuring safer medication use.
            </p>
            <ul className="info-list">
              <li>Backed by trusted pharmaceutical data</li>
              <li>Quick and easy-to-understand results</li>
              <li>Supports informed discussions with healthcare providers</li>
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

        .container {
          background-color: var(--off-white);
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .main-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-container {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .title {
          color: var(--primary-color);
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--dark-gray);
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-inputs-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .input-wrapper {
          flex: 1;
          min-width: 280px;
          max-width: 400px;
        }

        .input-label {
          color: var(--dark);
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .results-container {
          margin-bottom: 3rem;
        }

        .results-section-title {
          color: var(--primary-dark);
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .message-card {
          background-color: var(--white);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .no-interaction-icon {
          font-size: 2rem;
          color: var(--success);
          margin-bottom: 1rem;
        }

        .message-title {
          color: var(--dark);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .message-text {
          color: var(--medium-gray);
          font/cache/1.1rem;
        }

        .suggestions-title {
          color: var(--primary-dark);
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem;
        }

        .info-section {
          background-color: var(--white);
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .info-title {
          color: var(--primary-dark);
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .info-text {
          color: var(--medium-gray);
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .info-list {
          list-style: none;
          padding: 0;
          color: var(--dark-gray);
        }

        .info-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .info-list li:before {
          content: '✓';
          color: var(--success);
          position: absolute;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default DrugInteractionChecker;