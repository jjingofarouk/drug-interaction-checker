import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Dimensions,
  Keyboard,
  Pressable,
} from 'react-native';
import drugBankOptions from './drugOptions.json';
import drugBankInteractions from './druginteractionsdata.json';
import customDrugOptions from './DrugOptions2.json';
import customInteractions from './druginteractionsdata2.json';

const windowHeight = Dimensions.get('window').height;

// Separate InteractionCard component
const InteractionCard = React.memo(({ interaction }) => (
  <View style={styles.interactionCard}>
    <View style={styles.interactionHeader}>
      <Text style={styles.drugName}>{interaction.title}</Text>
      <View style={[
        styles.sourceBadge,
        { backgroundColor: interaction.source === 'drugbank' ? '#EFF6FF' : '#F0FDF4' }
      ]}>
        <Text style={[
          styles.sourceText,
          { color: interaction.source === 'drugbank' ? '#1E40AF' : '#166534' }
        ]}>
          {interaction.source}
        </Text>
      </View>
    </View>
    <Text style={styles.interactionText}>{interaction.description}</Text>
    {interaction.extended_description && (
      <Text style={styles.extendedDescription}>
        {interaction.extended_description}
      </Text>
    )}
  </View>
));

// Separate SuggestionCard component
const SuggestionCard = React.memo(({ suggestion }) => (
  <View style={styles.suggestionCard}>
    <Text style={styles.drugName}>
      {suggestion.drug1} + {suggestion.drug2}
    </Text>
    <Text style={styles.interactionText}>{suggestion.description}</Text>
    {suggestion.extended_description && (
      <Text style={styles.extendedDescription}>
        {suggestion.extended_description}
      </Text>
    )}
  </View>
));

// Drug Search Input Component
const DrugSearchInput = React.memo(({ 
  value, 
  onSelect, 
  placeholder, 
  onFocus, 
  inputIndex, 
  activeInput,
  zIndex,
  allDrugOptions 
}) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
    setShowSuggestions(true);

    if (text.length > 0) {
      const filtered = Object.values(allDrugOptions)
        .filter(drug => 
          drug.toLowerCase().includes(text.toLowerCase()))
        .sort()
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [allDrugOptions]);

  const handleSelect = useCallback((drug) => {
    setSearchText(drug);
    onSelect(drug);
    setShowSuggestions(false);
    setSuggestions([]);
    Keyboard.dismiss();
  }, [onSelect]);

  const isActive = activeInput === inputIndex;

  return (
    <View style={[styles.searchContainer, { zIndex }]}>
      <TextInput
        style={[
          styles.searchInput,
          isActive && styles.searchInputActive,
          value && styles.searchInputFilled
        ]}
        value={searchText}
        onChangeText={handleSearch}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        onFocus={() => {
          setShowSuggestions(true);
          onFocus(inputIndex);
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 200);
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsList} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
          >
            {suggestions.map((drug) => (
              <TouchableOpacity
                key={drug}
                style={styles.suggestionItem}
                onPress={() => handleSelect(drug)}
              >
                <Text style={styles.suggestionText}>{drug}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
});

// Main Component
const DrugInteractionChecker = () => {
  const [selectedDrug1, setSelectedDrug1] = useState("");
  const [selectedDrug2, setSelectedDrug2] = useState("");
  const [interactions, setInteractions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  // Memoize drug options
  const allDrugOptions = useMemo(() => ({
    ...drugBankOptions,
    ...Object.fromEntries(
      Object.values(customDrugOptions).map(drug => [drug, drug])
    )
  }), []);

  // Interaction finding functions
  const findDrugBankInteractions = useCallback((drug1, drug2) => {
    let foundInteractions = [];
    
    const drug1Entries = Object.entries(drugBankOptions)
      .filter(([_, name]) => name === drug1);
    const drug2Entries = Object.entries(drugBankOptions)
      .filter(([_, name]) => name === drug2);
    
    drug1Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(...drugBankInteractions[id].interactions
          .filter(interaction => interaction[0].toLowerCase().includes(drug2.toLowerCase()))
          .map(interaction => ({
            source: 'drugbank',
            drug1,
            drug2,
            description: interaction[1],
            title: interaction[0].replace(/<\/?[^>]+(>|$)/g, "")
          })));
      }
    });

    drug2Entries.forEach(([id]) => {
      if (drugBankInteractions[id]) {
        foundInteractions.push(...drugBankInteractions[id].interactions
          .filter(interaction => interaction[0].toLowerCase().includes(drug1.toLowerCase()))
          .map(interaction => ({
            source: 'drugbank',
            drug1,
            drug2,
            description: interaction[1],
            title: interaction[0].replace(/<\/?[^>]+(>|$)/g, "")
          })));
      }
    });

    return foundInteractions;
  }, []);

  const findCustomInteractions = useCallback((drug1, drug2) => {
    return customInteractions
      .filter(interaction => 
        (interaction.drug.toLowerCase() === drug1.toLowerCase() && 
         interaction.interacting_drug.toLowerCase() === drug2.toLowerCase()) ||
        (interaction.drug.toLowerCase() === drug2.toLowerCase() && 
         interaction.interacting_drug.toLowerCase() === drug1.toLowerCase())
      )
      .map(interaction => ({
        source: 'custom',
        drug1: interaction.drug,
        drug2: interaction.interacting_drug,
        description: interaction.description,
        extended_description: interaction.extended_description,
        title: `${interaction.drug} + ${interaction.interacting_drug}`
      }));
  }, []);

  const findRelatedInteractions = useCallback((drug) => {
    return customInteractions
      .filter(interaction => 
        interaction.drug.toLowerCase() === drug.toLowerCase() ||
        interaction.interacting_drug.toLowerCase() === drug.toLowerCase()
      )
      .map(interaction => ({
        drug1: interaction.drug,
        drug2: interaction.interacting_drug,
        description: interaction.description,
        extended_description: interaction.extended_description
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
        ...findCustomInteractions(selectedDrug1, selectedDrug2)
      ];

      if (foundInteractions.length === 0) {
        const drug1Related = findRelatedInteractions(selectedDrug1);
        const drug2Related = findRelatedInteractions(selectedDrug2);
        
        suggestedInteractions = [...drug1Related, ...drug2Related]
          .filter((interaction, index, self) => 
            index === self.findIndex(t => 
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

  const handleInputFocus = useCallback((index) => {
    setActiveInput(index);
  }, []);

  const handleScreenPress = useCallback(() => {
    Keyboard.dismiss();
    setActiveInput(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.mainContainer} onPress={handleScreenPress}>
        <ScrollView 
          style={styles.mainScroll} 
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Drug Interaction Checker</Text>
            <Text style={styles.subtitle}>Search for potential drug interactions</Text>
          </View>
          
          <View style={styles.searchInputsContainer}>
            <View style={[styles.inputWrapper, { zIndex: 2 }]}>
              <Text style={styles.inputLabel}>First Medication</Text>
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
            </View>

            <View style={[styles.inputWrapper, { zIndex: 1 }]}>
              <Text style={styles.inputLabel}>Second Medication</Text>
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
            </View>
          </View>

          <View style={styles.resultsContainer}>
            {interactions.length > 0 ? (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsSectionTitle}>Known Interactions</Text>
                {interactions.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </View>
            ) : selectedDrug1 && selectedDrug2 ? (
              <View style={styles.messageCard}>
                <View style={styles.noInteractionIcon}>
                  <Text style={styles.iconText}>✓</Text>
                </View>
                <Text style={styles.messageTitle}>No Direct Interactions Found</Text>
                <Text style={styles.messageText}>
                  No known interactions between {selectedDrug1} and {selectedDrug2}.
                </Text>
                {suggestions.length > 0 && (
                  <View style={styles.suggestionsSection}>
                    <Text style={styles.suggestionsTitle}>Related Interactions</Text>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard key={index} suggestion={suggestion} />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.messageCard}>
                <Text style={styles.messageTitle}>Get Started</Text>
                <Text style={styles.messageText}>
                  Search and select two medications to check for potential interactions.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Pressable>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
  },
  headerContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  searchInputsContainer: {
    padding: 24,
    gap: 32,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 4,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInputActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  searchInputFilled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '105%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 16,
    color: '#334155',
  },
  resultsContainer: {
    padding: 24,
    paddingTop: 8,
  },
  resultsSection: {
    gap: 16,
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  interactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  interactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  drugName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  interactionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  extendedDescription: {
    fontSize: 15,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  noInteractionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    marginRight: 16,
  },
  loadingContent: {
    flex: 1,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  loadingStageText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  suggestionsSection: {
    width: '100%',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 16,
  },
  suggestionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default DrugInteractionChecker;