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
    <div className="checker-wrapper" onClick={handleScreenPress}>
      <header className="hero">
        <div className="hero-content">
          <h1>Drug Interaction Checker</h1>
          <p>Stay informed. Stay safe. Instantly check for harmful drug interactions.</p>
        </div>
      </header>

      <main className="checker-main">
        <section className="input-section">
          <div className="input-block">
            <label>Medication 1</label>
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
          <div className="input-block">
            <label>Medication 2</label>
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
        </section>

        <section className="results-section">
          {interactions.length > 0 ? (
            <>
              <h2>Detected Interactions</h2>
              {interactions.map((interaction, index) => (
                <InteractionCard key={index} interaction={interaction} />
              ))}
            </>
          ) : selectedDrug1 && selectedDrug2 ? (
            <div className="message-card">
              <h3>No Interactions Detected</h3>
              <p>No issues found between <strong>{selectedDrug1}</strong> and <strong>{selectedDrug2}</strong>.</p>
              {suggestions.length > 0 && (
                <>
                  <h4>Related Interactions to Consider</h4>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="message-card">
              <h3>Start Checking</h3>
              <p>Enter two medications above to check their interaction.</p>
            </div>
          )}
        </section>

        <section className="info-section">
          <h2>Why Use This Tool?</h2>
          <p>Drug interactions can be harmful or reduce the effectiveness of medications. Our checker helps you stay safe and informed by analyzing interactions using trusted databases.</p>
          <ul>
            <li>Real-time interaction detection</li>
            <li>Reliable and evidence-based sources</li>
            <li>Fast, clear, and secure</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DrugInteractionChecker;