import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import customDrugOptions from './DrugOptions2.json';
import customInteractions from './druginteractionsdata2.json';
import './styles.css';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const allDrugOptions = useMemo(() => (
    Object.fromEntries(
      Object.values(customDrugOptions || {}).map(drug => [drug, drug])
    )
  ), []);

  const findCustomInteractions = useCallback((drug1, drug2) => {
    const interaction = (customInteractions || [])
      .find(
        (interaction) =>
          (interaction.drug.toLowerCase() === drug1.toLowerCase() &&
            interaction.interacting_drug.toLowerCase() === drug2.toLowerCase()) ||
          (interaction.drug.toLowerCase() === drug2.toLowerCase() &&
            interaction.interacting_drug.toLowerCase() === drug1.toLowerCase())
      );
    return interaction ? [{
      source: 'custom',
      drug1: interaction.drug,
      drug2: interaction.interacting_drug,
      description: interaction.description,
      extended_description: interaction.extended_description,
      title: `${interaction.drug} + ${interaction.interacting_drug}`,
    }] : [];
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
      }))
      .slice(0, 1); // Limit to one suggestion
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
      foundInteractions = findCustomInteractions(selectedDrug1, selectedDrug2);

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
    findCustomInteractions,
    findRelatedInteractions,
  ]);

  useEffect(() => {
    checkInteractions();
  }, [checkInteractions]);

  const handleInputFocus = useCallback((index) => setActiveInput(index), []);
  const handleScreenPress = useCallback(() => setActiveInput(null), []);

  return (
    <div className="container" onClick={handleScreenPress}>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Drug Interaction Checker</h1>
        </div>
      </div>
      <div className="main-container">
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
              <h2 className="results-section-title">Detected Interaction</h2>
              {interactions.map((interaction, index) => (
                <InteractionCard key={index} interaction={interaction} />
              ))}
            </div>
          ) : selectedDrug1 && selectedDrug2 ? (
            <div className="message-card">
              <div className="no-interaction-icon">✓</div>
              <h3 className="message-title">No Interaction Found</h3>
              <p className="message-text">
                No known interactions between {selectedDrug1} and {selectedDrug2}.
              </p>
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">Related Interaction</h4>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="message-card">
              <h3 className="message-title">Check Medications</h3>
              <p className="message-text">
                Enter two drugs to check for interactions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;