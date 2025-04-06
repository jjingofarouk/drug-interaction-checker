import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import { pharmacyTheme, developerName } from './theme';
import drugBankOptions from './drugOptions.json';
import drugBankInteractions from './druginteractionsdata.json';
import customDrugOptions from './DrugOptions2.json';
import customInteractions from './druginteractionsdata2.json';
import './styles.css';

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
    <div className="container" style={{ backgroundColor: pharmacyTheme.background }}>
      <div className="main-container" onClick={handleScreenPress}>
        <div className="main-scroll">
          <div className="header-container">
            <div className="title" style={{ color: pharmacyTheme.primary }}>
              Drug Interaction Checker
            </div>
            <div className="subtitle" style={{ color: pharmacyTheme.text }}>
              Search for potential drug interactions
            </div>
            <div className="developer-name" style={{ color: pharmacyTheme.text }}>
              Developed by {developerName}
            </div>
          </div>

          <div className="search-inputs-container">
            <div className="input-wrapper" style={{ zIndex: 2 }}>
              <div className="input-label" style={{ color: pharmacyTheme.text }}>
                First Medication
              </div>
              <DrugSearchInput
                value={selectedDrug1}
                onSelect={setSelectedDrug1}
                placeholder="Search medication..."
                onFocus={handleInputFocus}
                inputIndex={1}
                activeInput={activeInput}
                zIndex={2}
                allDrugOptions={allDrugOptions}
              />
            </div>
            <div className="input-wrapper" style={{ zIndex: 1 }}>
              <div className="input-label" style={{ color: pharmacyTheme.text }}>
                Second Medication
              </div>
              <DrugSearchInput
                value={selectedDrug2}
                onSelect={setSelectedDrug2}
                placeholder="Search medication..."
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
                <div className="results-section-title" style={{ color: pharmacyTheme.primary }}>
                  Known Interactions
                </div>
                {interactions.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : selectedDrug1 && selectedDrug2 ? (
              <div className="message-card" style={{ backgroundColor: pharmacyTheme.cardBackground, boxShadow: pharmacyTheme.cardShadow }}>
                <div className="no-interaction-icon">
                  <div className="icon-text" style={{ color: pharmacyTheme.success }}>✓</div>
                </div>
                <div className="message-title" style={{ color: pharmacyTheme.text }}>
                  No Direct Interactions Found
                </div>
                <div className="message-text" style={{ color: pharmacyTheme.text }}>
                  No known interactions between {selectedDrug1} and {selectedDrug2}.
                </div>
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <div className="suggestions-title" style={{ color: pharmacyTheme.primary }}>
                      Related Interactions
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard key={index} suggestion={suggestion} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="message-card" style={{ backgroundColor: pharmacyTheme.cardBackground, boxShadow: pharmacyTheme.cardShadow }}>
                <div className="message-title" style={{ color: pharmacyTheme.text }}>
                  Get Started
                </div>
                <div className="message-text" style={{ color: pharmacyTheme.text }}>
                  Search and select two medications to check for potential interactions.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;