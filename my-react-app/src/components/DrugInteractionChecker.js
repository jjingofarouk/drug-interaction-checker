import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DrugSearchInput from './DrugSearchInput';
import InteractionCard from './InteractionCard';
import SuggestionCard from './SuggestionCard';
import './styles.css';

const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState('');
  const [selectedDrug2, setSelectedDrug2] = useState('');
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [drugOptions, setDrugOptions] = useState({});
  const [drugInteractionsMap, setDrugInteractionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch drug options and build interactions map
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch drug options
        const optionsSnapshot = await getDocs(collection(db, 'drugOptions'));
        const options = {};
        optionsSnapshot.forEach((doc) => {
          options[doc.id] = doc.data().name;
        });
        setDrugOptions(options);

        // Fetch all drug interactions to build a map of which drugs have interactions
        const interactionsSnapshot = await getDocs(collection(db, 'drugInteractions'));
        const interactionsMap = {};
        
        interactionsSnapshot.forEach((doc) => {
          const drugId = doc.id;
          const drugName = options[drugId];
          
          if (drugName) {
            const interactions = doc.data().interactions || [];
            
            // Store array of drug IDs that this drug interacts with
            interactionsMap[drugId] = interactions.map(i => i.drugId);
            
            // Also create reverse mapping for easier lookup
            interactions.forEach(interaction => {
              if (interaction.drugId) {
                if (!interactionsMap[interaction.drugId]) {
                  interactionsMap[interaction.drugId] = [];
                }
                if (!interactionsMap[interaction.drugId].includes(drugId)) {
                  interactionsMap[interaction.drugId].push(drugId);
                }
              }
            });
          }
        });
        
        setDrugInteractionsMap(interactionsMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to load drug data.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Get drugs that have at least one interaction
  const drugsWithInteractions = useMemo(() => {
    return Object.keys(drugInteractionsMap)
      .filter(drugId => drugInteractionsMap[drugId]?.length > 0)
      .map(drugId => drugOptions[drugId])
      .filter(Boolean);
  }, [drugInteractionsMap, drugOptions]);

  // Get filtered drug options for Drug 1 (only drugs with interactions)
  const drug1Options = useMemo(() => {
    const options = {};
    drugsWithInteractions.forEach(drugName => {
      options[drugName] = drugName;
    });
    return options;
  }, [drugsWithInteractions]);

  // Get filtered drug options for Drug 2 based on Drug 1 selection
  const drug2Options = useMemo(() => {
    if (!selectedDrug1) {
      return drug1Options; // Show all drugs with interactions if no Drug 1 selected
    }

    // Find the drug ID for selectedDrug1
    const drug1Id = Object.keys(drugOptions).find(
      id => drugOptions[id].toLowerCase() === selectedDrug1.toLowerCase()
    );

    if (!drug1Id || !drugInteractionsMap[drug1Id]) {
      return {};
    }

    // Get drugs that interact with Drug 1
    const interactingDrugIds = drugInteractionsMap[drug1Id];
    const options = {};
    
    interactingDrugIds.forEach(drugId => {
      const drugName = drugOptions[drugId];
      if (drugName) {
        options[drugName] = drugName;
      }
    });

    return options;
  }, [selectedDrug1, drugOptions, drugInteractionsMap, drug1Options]);

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
    setCurrentPage(1);

    let foundInteractions = [];
    let suggestedInteractions = [];

    if (selectedDrug1 && selectedDrug2) {
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
  }, [selectedDrug1, selectedDrug2, findCustomInteractions, findRelatedInteractions]);

  useEffect(() => {
    if (Object.keys(drugOptions).length > 0) {
      checkInteractions();
    }
  }, [checkInteractions, drugOptions]);

  const handleInputFocus = useCallback((index) => setActiveInput(index), []);
  const handleScreenPress = useCallback(() => setActiveInput(null), []);

  const handleDrug1Select = (drug) => {
    setSelectedDrug1(drug);
    // Clear drug 2 if it doesn't interact with the new drug 1
    if (selectedDrug2) {
      const drug1Id = Object.keys(drugOptions).find(
        id => drugOptions[id].toLowerCase() === drug.toLowerCase()
      );
      const drug2Id = Object.keys(drugOptions).find(
        id => drugOptions[id].toLowerCase() === selectedDrug2.toLowerCase()
      );
      
      if (drug1Id && drug2Id && drugInteractionsMap[drug1Id]) {
        if (!drugInteractionsMap[drug1Id].includes(drug2Id)) {
          setSelectedDrug2('');
        }
      }
    }
  };

  // Pagination logic
  const paginatedInteractions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return interactions.slice(startIndex, startIndex + itemsPerPage);
  }, [interactions, currentPage]);

  const totalPages = Math.ceil(interactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get interaction count for display
  const drug1InteractionCount = useMemo(() => {
    if (!selectedDrug1) return 0;
    const drug1Id = Object.keys(drugOptions).find(
      id => drugOptions[id].toLowerCase() === selectedDrug1.toLowerCase()
    );
    return drug1Id && drugInteractionsMap[drug1Id] ? drugInteractionsMap[drug1Id].length : 0;
  }, [selectedDrug1, drugOptions, drugInteractionsMap]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading drug database...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle className="error-icon" />
        <h3 className="error-title">Error Loading Data</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container" onClick={handleScreenPress}>

      <div className="main-container">
        <div className="search-section">
          <h2 className="search-section-title">Check Drug Interactions</h2>
          <div className="search-inputs-container">
            <div className="input-wrapper">
              <label className="input-label">
                First Medication
                {selectedDrug1 && drug1InteractionCount > 0 && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    fontSize: '0.875rem', 
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}>
                    ({drug1InteractionCount} known interactions)
                  </span>
                )}
              </label>
              <DrugSearchInput
                value={selectedDrug1}
                onSelect={handleDrug1Select}
                placeholder="Enter first medication..."
                onFocus={handleInputFocus}
                inputIndex={1}
                activeInput={activeInput}
                zIndex={2}
                allDrugOptions={drug1Options}
              />
              {selectedDrug1 && drug1InteractionCount === 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle size={16} />
                  No known interactions in database
                </div>
              )}
            </div>
            <div className="input-wrapper">
              <label className="input-label">
                Second Medication
                {selectedDrug1 && Object.keys(drug2Options).length > 0 && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    (showing {Object.keys(drug2Options).length} drugs that interact with {selectedDrug1})
                  </span>
                )}
              </label>
              <DrugSearchInput
                value={selectedDrug2}
                onSelect={setSelectedDrug2}
                placeholder={
                  selectedDrug1 
                    ? Object.keys(drug2Options).length > 0
                      ? "Enter second medication..."
                      : "No interactions found for selected drug"
                    : "Select first medication first..."
                }
                onFocus={handleInputFocus}
                inputIndex={2}
                activeInput={activeInput}
                zIndex={1}
                allDrugOptions={drug2Options}
                disabled={!selectedDrug1 || Object.keys(drug2Options).length === 0}
              />
              {selectedDrug1 && Object.keys(drug2Options).length === 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle size={16} />
                  {selectedDrug1} has no known interactions in our database
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: 'var(--accent)' }}>Smart Filtering:</strong> Only medications with documented interactions are shown in the search. 
            If you select a medication, the second field will only show drugs that have known interactions with your selection.
          </div>
        </div>

        <div className="results-container">
          {interactions.length > 0 ? (
            <div className="results-section">
              <h2 className="results-section-title">
                Found Interaction Between {selectedDrug1} and {selectedDrug2}
              </h2>
              {paginatedInteractions.map((interaction, index) => (
                <InteractionCard key={index} interaction={interaction} />
              ))}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4 className="suggestions-title">Related Interactions You May Want to Check</h4>
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
                No known interactions between {selectedDrug1} and {selectedDrug2} in our database.
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
              <h3 className="message-title">Select Medications to Check</h3>
              <p className="message-text">
                Select two medications above to check for potential interactions. Our smart filtering ensures you only see drugs with documented interactions.
              </p>
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--secondary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  How it works:
                </div>
                <ul style={{ marginLeft: '1.25rem', lineHeight: '1.7' }}>
                  <li>Start by selecting your first medication</li>
                  <li>The second field will show only medications that interact with your first choice</li>
                  <li>If no options appear, the selected drug has no known interactions</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;