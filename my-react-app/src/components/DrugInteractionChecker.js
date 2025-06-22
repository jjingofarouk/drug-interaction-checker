import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import customDrugOptions from './drugOptions.json';
import customInteractions from './drugInteractionData.json';
import './styles.css';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const allDrugOptions = useMemo(() => (
    Object.fromEntries(
      Object.entries(customDrugOptions || {}).map(([id, name]) => [name, name])
    )
  ), []);

  const findCustomInteractions = useCallback((drug1, drug2) => {
    const drug1Id = Object.keys(customDrugOptions).find(
      key => customDrugOptions[key].toLowerCase() === drug1.toLowerCase()
    );
    const drug2Id = Object.keys(customDrugOptions).find(
      key => customDrugOptions[key].toLowerCase() === drug2.toLowerCase()
    );

    if (!drug1Id || !drug2Id) return [];

    const interactions1 = (customInteractions[drug1Id]?.interactions || []).map(([drug, desc]) => ({
      source: 'custom',
      drug1: customDrugOptions[drug1Id],
      drug2: customDrugOptions[drug.match(/DB\d+/)[0]] || drug.replace(/<[^>]+>/g, ''),
      description: desc,
      extended_description: desc,
      title: `${customDrugOptions[drug1Id]} + ${customDrugOptions[drug.match(/DB\d+/)[0]] || drug.replace(/<[^>]+>/g, '')}`,
    }));

    const interactions2 = (customInteractions[drug2Id]?.interactions || []).map(([drug, desc]) => ({
      source: 'custom',
      drug1: customDrugOptions[drug2Id],
      drug2: customDrugOptions[drug.match(/DB\d+/)[0]] || drug.replace(/<[^>]+>/g, ''),
      description: desc,
      extended_description: desc,
      title: `${customDrugOptions[drug2Id]} + ${customDrugOptions[drug.match(/DB\d+/)[0]] || drug.replace(/<[^>]+>/g, '')}`,
    }));

    return [
      ...interactions1.filter(i => i.drug2.toLowerCase() === drug2.toLowerCase()),
      ...interactions2.filter(i => i.drug2.toLowerCase() === drug1.toLowerCase()),
    ];
  }, []);

  const findRelatedInteractions = useCallback((drug) => {
    const drugId = Object.keys(customDrugOptions).find(
      key => customDrugOptions[key].toLowerCase() === drug.toLowerCase()
    );

    if (!drugId) return [];

    return (customInteractions[drugId]?.interactions || [])
      .map(([interactingDrug, desc]) => ({
        drug1: customDrugOptions[drugId],
        drug2: customDrugOptions[interactingDrug.match(/DB\d+/)[0]] || interactingDrug.replace(/<[^>]+>/g, ''),
        description: desc,
        extended_description: desc,
      }))
      .slice(0, 10);
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

      const drug1Related = findRelatedInteractions(selectedDrug1);
      const drug2Related = findRelatedInteractions(selectedDrug2);

      suggestedInteractions = [...drug1Related, ...drug2Related].filter(
        (interaction, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.drug1 === interaction.drug1 && t.drug2 === interaction.drug2
          )
      ).slice(0, 10);
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
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">Related Interactions</h4>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </div>
              )}
            </div>
          ) : selectedDrug1 && selectedDrug2 ? (
            <div className="message-card">
              <CheckCircle className="no-interaction-icon" size={32} />
              <h3 className="message-title">No Interaction Found</h3>
              <p className="message-text">
                No known interactions between {selectedDrug1} and {selectedDrug2}.
              </p>
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">Related Interactions</h4>
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
