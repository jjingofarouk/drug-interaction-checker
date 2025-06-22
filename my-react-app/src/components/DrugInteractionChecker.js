import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import './styles.css';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [singleDrug, setSingleDrug] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [singleDrugInteractions, setSingleDrugInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [drugOptions, setDrugOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugOptions = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'drugOptions'));
        const options = {};
        querySnapshot.forEach((doc) => {
          options[doc.id] = doc.data().name;
        });
        setDrugOptions(options);
        setLoading(false);
      } catch (err) {
        setError('Failed to load drug options.');
        setLoading(false);
        console.error('Error fetching drug options:', err);
      }
    };
    fetchDrugOptions();
  }, []);

  const allDrugOptions = useMemo(() => (
    Object.fromEntries(
      Object.entries(drugOptions).map(([id, name]) => [name, name])
    )
  ), [drugOptions]);

  const findCustomInteractions = useCallback(async (drug1, drug2) => {
    if (!drug1 || !drug2) return [];

    const drug1Id = Object.keys(drugOptions).find(
      (key) => drugOptions[key].toLowerCase() === drug1.toLowerCase()
    );
    const drug2Id = Object.keys(drugOptions).find(
      (key) => drugOptions[key].toLowerCase() === drug2.toLowerCase()
    );

    if (!drug1Id || !drug2Id) return [];

    try {
      const [drug1Doc, drug2Doc] = await Promise.all([
        getDoc(doc(db, 'drugInteractions', drug1Id)),
        getDoc(doc(db, 'drugInteractions', drug2Id)),
      ]);

      const interactions1 = (drug1Doc.exists() ? drug1Doc.data().interactions : []).map(
        ({ drug, drugId, description }) => ({
          source: 'custom',
          drug1: drugOptions[drug1Id],
          drug2: drugOptions[drugId] || drug,
          description,
          extended_description: description,
          title: `${drugOptions[drug1Id]} + ${drugOptions[drugId] || drug}`,
        })
      );

      const interactions2 = (drug2Doc.exists() ? drug2Doc.data().interactions : []).map(
        ({ drug, drugId, description }) => ({
          source: 'custom',
          drug1: drugOptions[drug2Id],
          drug2: drugOptions[drugId] || drug,
          description,
          extended_description: description,
          title: `${drugOptions[drug2Id]} + ${drugOptions[drugId] || drug}`,
        })
      );

      return [
        ...interactions1.filter((i) => i.drug2.toLowerCase() === drug2.toLowerCase()),
        ...interactions2.filter((i) => i.drug2.toLowerCase() === drug1.toLowerCase()),
      ];
    } catch (err) {
      console.error('Error fetching interactions:', err);
      return [];
    }
  }, [drugOptions]);

  const findSingleDrugInteractions = useCallback(async (drug) => {
    if (!drug) return [];

    const drugId = Object.keys(drugOptions).find(
      (key) => drugOptions[key].toLowerCase() === drug.toLowerCase()
    );

    if (!drugId) return [];

    try {
      const drugDoc = await getDoc(doc(db, 'drugInteractions', drugId));
      if (!drugDoc.exists()) return [];

      return drugDoc.data().interactions.map(
        ({ drug, drugId, description }) => ({
          source: 'custom',
          drug1: drugOptions[drugId],
          drug2: drugOptions[drugId] || drug,
          description,
          extended_description: description,
          title: `${drugOptions[drugId]} + ${drugOptions[drugId] || drug}`,
        })
      );
    } catch (err) {
      console.error('Error fetching single drug interactions:', err);
      return [];
    }
  }, [drugOptions]);

  const findRelatedInteractions = useCallback(async (drug) => {
    const drugId = Object.keys(drugOptions).find(
      (key) => drugOptions[key].toLowerCase() === drug.toLowerCase()
    );

    if (!drugId) return [];

    try {
      const drugDoc = await getDoc(doc(db, 'drugInteractions', drugId));
      if (!drugDoc.exists()) return [];

      return drugDoc.data().interactions
        .map(({ drug, drugId, description }) => ({
          drug1: drugOptions[drugId],
          drug2: drugOptions[drugId] || drug,
          description,
          extended_description: description,
        }))
        .slice(0, 5);
    } catch (err) {
      console.error('Error fetching related interactions:', err);
      return [];
    }
  }, [drugOptions]);

  const checkInteractions = useCallback(async () => {
    setInteractions([]);
    setSuggestions([]);
    setSingleDrugInteractions([]);

    let foundInteractions = [];
    let suggestedInteractions = [];
    let singleInteractions = [];

    if (singleDrug) {
      singleInteractions = await findSingleDrugInteractions(singleDrug);
    } else if (selectedDrug1 && selectedDrug2) {
      foundInteractions = await findCustomInteractions(selectedDrug1, selectedDrug2);

      const [drug1Related, drug2Related] = await Promise.all([
        findRelatedInteractions(selectedDrug1),
        findRelatedInteractions(selectedDrug2),
      ]);

      suggestedInteractions = [...drug1Related, ...drug2Related]
        .filter(
          (interaction, index, self) =>
            index ===
            self.findIndex(
              (t) => t.drug1 === interaction.drug1 && t.drug2 === interaction.drug2
            )
        )
        .slice(0, 5);
    }

    setInteractions(foundInteractions);
    setSuggestions(suggestedInteractions);
    setSingleDrugInteractions(singleInteractions);
  }, [selectedDrug1, selectedDrug2, singleDrug, findCustomInteractions, findRelatedInteractions, findSingleDrugInteractions]);

  useEffect(() => {
    if (Object.keys(drugOptions).length > 0) {
      checkInteractions();
    }
  }, [checkInteractions, drugOptions]);

  const handleInputFocus = useCallback((index) => setActiveInput(index), []);
  const handleScreenPress = useCallback(() => setActiveInput(null), []);

  const handleSingleDrugClear = () => {
    setSingleDrug('');
    setSingleDrugInteractions([]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container" onClick={handleScreenPress}>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Drug Interaction Checker</h1>
        </div>
      </div>
      <div className="main-container">
        <div className="search-section">
          <h2 className="search-section-title">Single Drug Interaction Search</h2>
          <div className="search-inputs-container">
            <div className="input-wrapper">
              <label className="input-label">Search Medication</label>
              <DrugSearchInput
                value={singleDrug}
                onSelect={setSingleDrug}
                placeholder="Enter a medication..."
                onFocus={handleInputFocus}
                inputIndex={0}
                activeInput={activeInput}
                zIndex={3}
                allDrugOptions={allDrugOptions}
              />
              {singleDrug && (
                <button
                  className="clear-button"
                  onClick={handleSingleDrugClear}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <h2 className="search-section-title">Pairwise Drug Interaction Search</h2>
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
          {singleDrugInteractions.length > 0 ? (
            <div className="results-section">
              <h2 className="results-section-title">Interactions for {singleDrug}</h2>
              {singleDrugInteractions.map((interaction, index) => (
                <InteractionCard key={index} interaction={interaction} />
              ))}
            </div>
          ) : singleDrug ? (
            <div className="message-card">
              <CheckCircle className="no-interaction-icon" size={32} />
              <h3 className="message-title">No Interactions Found</h3>
              <p className="message-text">
                No known interactions for {singleDrug}.
              </p>
            </div>
          ) : interactions.length > 0 ? (
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
                Enter one drug to see all its interactions or two drugs to check for specific interactions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;